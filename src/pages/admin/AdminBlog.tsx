import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, ExternalLink } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import type { BlogPost } from "@/types/database";
import { getBlogCoverUrl } from "@/lib/image-utils";

const AdminBlog = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const post = posts.find((p) => p.id === id);
      if (post?.cover_image_path) {
        await supabase.storage.from("blog").remove([post.cover_image_path]);
      }
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setDeleteId(null);
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("blog_posts").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] }),
  });

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl uppercase text-secondary-foreground">Blog</h1>
          <p className="text-secondary-foreground/50 text-sm">{posts.length} posts cadastrados</p>
        </div>
        <Button asChild className="font-heading uppercase tracking-wider">
          <Link to="/admin/blog/new">
            <Plus size={18} className="mr-2" /> Novo Post
          </Link>
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/30" size={18} />
        <Input
          placeholder="Buscar posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
        />
      </div>

      {isLoading ? (
        <div className="text-secondary-foreground/50 text-center py-12">Carregando...</div>
      ) : (
        <div className="bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-secondary-foreground/10 hover:bg-transparent">
                <TableHead className="text-secondary-foreground/50">Capa</TableHead>
                <TableHead className="text-secondary-foreground/50">Título</TableHead>
                <TableHead className="text-secondary-foreground/50">Categoria</TableHead>
                <TableHead className="text-secondary-foreground/50">URL Externa</TableHead>
                <TableHead className="text-secondary-foreground/50">Status</TableHead>
                <TableHead className="text-secondary-foreground/50 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((post) => {
                const coverUrl = getBlogCoverUrl(post.cover_image_path);
                return (
                  <TableRow key={post.id} className="border-secondary-foreground/10 hover:bg-secondary-foreground/5">
                    <TableCell>
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={post.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-secondary-foreground/10 flex items-center justify-center">
                          <span className="text-secondary-foreground/30 text-xs">N/A</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-secondary-foreground font-medium max-w-xs truncate">
                      {post.title}
                    </TableCell>
                    <TableCell className="text-secondary-foreground/60">{post.category}</TableCell>
                    <TableCell className="text-secondary-foreground/60 max-w-[220px]">
                      <a
                        href={post.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 truncate hover:text-primary transition-colors"
                      >
                        <span className="truncate">{post.external_url}</span>
                        <ExternalLink size={12} className="flex-shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          toggleActive.mutate({ id: post.id, is_active: !post.is_active })
                        }
                        className="flex items-center gap-1.5"
                      >
                        {post.is_active ? (
                          <Badge className="bg-green-500/10 text-green-400 border-0 hover:bg-green-500/20">
                            <Eye size={12} className="mr-1" /> Ativo
                          </Badge>
                        ) : (
                          <Badge className="bg-secondary-foreground/10 text-secondary-foreground/40 border-0 hover:bg-secondary-foreground/20">
                            <EyeOff size={12} className="mr-1" /> Inativo
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" className="text-secondary-foreground/60 hover:text-primary">
                          <Link to={`/admin/blog/${post.id}`}>
                            <Pencil size={16} />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-secondary-foreground/60 hover:text-destructive"
                          onClick={() => setDeleteId(post.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-secondary-foreground/40 py-12">
                    Nenhum post encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-secondary border-secondary-foreground/20">
          <DialogHeader>
            <DialogTitle className="text-secondary-foreground">Excluir post</DialogTitle>
            <DialogDescription className="text-secondary-foreground/50">
              Tem certeza? Esta ação não pode ser desfeita. A imagem de capa também será removida.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-secondary-foreground/20 text-secondary-foreground">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
