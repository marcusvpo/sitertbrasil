import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@/types/database";
import { getBlogCoverUrl } from "@/lib/image-utils";

const AdminBlogForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    category: "",
    external_url: "",
    is_active: true,
    sort_order: 0,
  });
  const [existingCoverPath, setExistingCoverPath] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", id],
    enabled: isEdit,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as BlogPost;
    },
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        category: post.category,
        external_url: post.external_url,
        is_active: post.is_active,
        sort_order: post.sort_order,
      });
      setExistingCoverPath(post.cover_image_path);
    }
  }, [post]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      setRemoveCover(false);
    }
  };

  const handleRemoveExistingCover = () => {
    setRemoveCover(true);
    setExistingCoverPath(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let coverPath = existingCoverPath;

      // Remove old cover if marked or replaced
      if ((removeCover || newFile) && post?.cover_image_path) {
        await supabase.storage.from("blog").remove([post.cover_image_path]);
        coverPath = null;
      }

      // Upload new cover
      if (newFile) {
        const ext = newFile.name.split(".").pop();
        const fileName = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("blog")
          .upload(fileName, newFile, { upsert: false });
        if (uploadError) throw uploadError;
        coverPath = fileName;
      }

      const postData = {
        title: form.title.trim(),
        category: form.category.trim(),
        external_url: form.external_url.trim(),
        cover_image_path: coverPath,
        is_active: form.is_active,
        sort_order: form.sort_order,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        const { error } = await supabase.from("blog_posts").update(postData).eq("id", id!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(postData);
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post", id] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts-public"] });
      toast({ title: isEdit ? "Post atualizado!" : "Post criado!" });
      navigate("/admin/blog");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && isLoading) {
    return <div className="p-8 text-secondary-foreground/50">Carregando...</div>;
  }

  const coverPreview = newFile
    ? URL.createObjectURL(newFile)
    : existingCoverPath
    ? getBlogCoverUrl(existingCoverPath)
    : null;

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/blog")}
        className="text-secondary-foreground/60 hover:text-secondary-foreground mb-4"
      >
        <ArrowLeft size={18} className="mr-2" /> Voltar
      </Button>

      <h1 className="font-heading text-2xl uppercase text-secondary-foreground mb-6">
        {isEdit ? "Editar Post" : "Novo Post"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label className="text-secondary-foreground/70">Título *</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
            className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
            placeholder="Ex: MOTOREX patrocina principais campeonatos FIM"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-secondary-foreground/70">Categoria *</Label>
          <Input
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            required
            className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
            placeholder="Ex: Notícias, Dicas Técnicas, Campeonatos, Lançamentos"
          />
          <p className="text-secondary-foreground/40 text-xs">
            Posts com a mesma categoria são agrupados automaticamente na página Blog.
          </p>
        </div>

        {/* External URL */}
        <div className="space-y-2">
          <Label className="text-secondary-foreground/70">URL do Post (Substack / externo) *</Label>
          <Input
            type="url"
            value={form.external_url}
            onChange={(e) => setForm((p) => ({ ...p, external_url: e.target.value }))}
            required
            className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
            placeholder="https://rtbrasil.substack.com/p/nome-do-post"
          />
          <p className="text-secondary-foreground/40 text-xs">
            Ao clicar no card no site, o usuário é direcionado para esta URL em nova aba.
          </p>
        </div>

        {/* Cover image */}
        <div className="space-y-3">
          <Label className="text-secondary-foreground/70">Imagem de Capa</Label>
          <div className="flex items-start gap-4">
            {coverPreview ? (
              <div className="relative group aspect-square w-40 rounded-lg overflow-hidden border border-secondary-foreground/10">
                <img src={coverPreview} alt="Capa" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    if (newFile) {
                      setNewFile(null);
                    } else {
                      handleRemoveExistingCover();
                    }
                  }}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                {newFile && (
                  <div className="absolute bottom-0 inset-x-0 bg-primary/80 text-primary-foreground text-[9px] text-center py-0.5">
                    NOVA
                  </div>
                )}
              </div>
            ) : (
              <label className="aspect-square w-40 rounded-lg border-2 border-dashed border-secondary-foreground/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload size={24} className="text-secondary-foreground/30 mb-1" />
                <span className="text-secondary-foreground/30 text-xs">Adicionar capa</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Active + sort order */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Switch checked={form.is_active} onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))} />
            <Label className="text-secondary-foreground/70">Post ativo</Label>
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-secondary-foreground/70">Ordem</Label>
            <Input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-20 bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" className="font-heading uppercase tracking-wider" disabled={saving}>
            {saving ? "Salvando..." : isEdit ? "Salvar Alterações" : "Criar Post"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/blog")} className="text-secondary-foreground border-secondary-foreground/20">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogForm;
