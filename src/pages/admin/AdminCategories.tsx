import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ProductCategory } from "@/types/database";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

const slugify = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as ProductCategory[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("product_categories").insert({
        name,
        slug: slugify(name),
        sort_order: categories.length,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewName("");
      toast({ title: "Categoria criada!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from("product_categories")
        .update({ name, slug: slugify(name) })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditId(null);
      toast({ title: "Categoria atualizada!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteId(null);
      toast({ title: "Categoria excluída!" });
    },
  });

  const startEdit = (cat: ProductCategory) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  return (
    <div className="p-6 md:p-8 max-w-xl">
      <h1 className="font-heading text-2xl uppercase text-secondary-foreground mb-6">Categorias</h1>

      {/* Add new */}
      <div className="flex gap-2 mb-6">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nova categoria..."
          className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
          onKeyDown={(e) => {
            if (e.key === "Enter" && newName.trim()) {
              e.preventDefault();
              createMutation.mutate(newName.trim());
            }
          }}
        />
        <Button
          onClick={() => newName.trim() && createMutation.mutate(newName.trim())}
          disabled={!newName.trim() || createMutation.isPending}
          className="font-heading uppercase tracking-wider"
        >
          <Plus size={18} />
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg px-4 py-3"
          >
            {editId === cat.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editName.trim()) {
                      updateMutation.mutate({ id: cat.id, name: editName.trim() });
                    }
                    if (e.key === "Escape") setEditId(null);
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-green-400 hover:text-green-300 h-8 w-8"
                  onClick={() => editName.trim() && updateMutation.mutate({ id: cat.id, name: editName.trim() })}
                >
                  <Check size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="text-secondary-foreground/40 h-8 w-8" onClick={() => setEditId(null)}>
                  <X size={16} />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-secondary-foreground text-sm">{cat.name}</span>
                <span className="text-secondary-foreground/30 text-xs">{cat.slug}</span>
                <Button variant="ghost" size="icon" className="text-secondary-foreground/40 hover:text-primary h-8 w-8" onClick={() => startEdit(cat)}>
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="text-secondary-foreground/40 hover:text-destructive h-8 w-8" onClick={() => setDeleteId(cat.id)}>
                  <Trash2 size={14} />
                </Button>
              </>
            )}
          </div>
        ))}
        {isLoading && <p className="text-secondary-foreground/40 text-sm">Carregando...</p>}
        {!isLoading && categories.length === 0 && <p className="text-secondary-foreground/40 text-sm">Nenhuma categoria.</p>}
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-secondary border-secondary-foreground/20">
          <DialogHeader>
            <DialogTitle className="text-secondary-foreground">Excluir categoria</DialogTitle>
            <DialogDescription className="text-secondary-foreground/50">
              Produtos desta categoria ficarão sem categoria. Deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-secondary-foreground/20 text-secondary-foreground">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
