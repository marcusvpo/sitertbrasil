import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, X, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product, ProductCategory, ProductImage } from "@/types/database";

import { getProductImageUrl } from "@/lib/image-utils";

const slugify = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    compare_price: "",
    category_id: "",
    volume: "",
    badge: "",
    is_featured: false,
    is_active: true,
    sort_order: 0,
  });
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const { data: categories = [] } = useQuery({
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

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    enabled: isEdit,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, images:product_images(*)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Product & { images: ProductImage[] };
    },
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        short_description: product.short_description || "",
        price: product.price?.toString() || "",
        compare_price: product.compare_price?.toString() || "",
        category_id: product.category_id || "",
        volume: product.volume || "",
        badge: product.badge || "",
        is_featured: product.is_featured,
        is_active: product.is_active,
        sort_order: product.sort_order,
      });
      setExistingImages(product.images || []);
    }
  }, [product]);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : slugify(name),
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: string) => {
    setImagesToDelete((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const getImageUrl = (path: string) =>
    `${SUPABASE_URL}/storage/v1/object/public/products/${path}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        short_description: form.short_description.trim() || null,
        price: form.price ? parseFloat(form.price) : null,
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        category_id: form.category_id || null,
        volume: form.volume.trim() || null,
        badge: form.badge.trim() || null,
        is_featured: form.is_featured,
        is_active: form.is_active,
        sort_order: form.sort_order,
      };

      let productId = id;

      if (isEdit) {
        const { error } = await supabase.from("products").update(productData).eq("id", id!);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("products").insert(productData).select("id").single();
        if (error) throw error;
        productId = data.id;
      }

      // Delete removed images
      if (imagesToDelete.length > 0) {
        const toDelete = (product?.images || []).filter((img) => imagesToDelete.includes(img.id));
        if (toDelete.length) {
          await supabase.storage.from("products").remove(toDelete.map((img) => img.storage_path));
          await supabase.from("product_images").delete().in("id", imagesToDelete);
        }
      }

      // Upload new images
      if (newFiles.length > 0) {
        const folderName = form.slug.trim();
        const currentCount = existingImages.length;

        for (let i = 0; i < newFiles.length; i++) {
          const file = newFiles[i];
          const ext = file.name.split(".").pop();
          const fileName = `${Date.now()}-${i}.${ext}`;
          const storagePath = `${folderName}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(storagePath, file, { upsert: false });

          if (uploadError) throw uploadError;

          const { error: imgError } = await supabase.from("product_images").insert({
            product_id: productId,
            storage_path: storagePath,
            alt_text: form.name,
            sort_order: currentCount + i,
          });
          if (imgError) throw imgError;
        }
      }

      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast({ title: isEdit ? "Produto atualizado!" : "Produto criado!" });
      navigate("/admin");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && isLoading) {
    return <div className="p-8 text-secondary-foreground/50">Carregando...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/admin")}
        className="text-secondary-foreground/60 hover:text-secondary-foreground mb-4"
      >
        <ArrowLeft size={18} className="mr-2" /> Voltar
      </Button>

      <h1 className="font-heading text-2xl uppercase text-secondary-foreground mb-6">
        {isEdit ? "Editar Produto" : "Novo Produto"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-secondary-foreground/70">Nome do Produto *</Label>
            <Input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
              placeholder="Cross Power 2T"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-secondary-foreground/70">Slug (URL)</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
              placeholder="cross-power-2t"
            />
          </div>
        </div>

        {/* Short description */}
        <div className="space-y-2">
          <Label className="text-secondary-foreground/70">Descrição Curta</Label>
          <Input
            value={form.short_description}
            onChange={(e) => setForm((p) => ({ ...p, short_description: e.target.value }))}
            className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
            placeholder="Óleo de motor sintético para 2 tempos"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-secondary-foreground/70">Descrição Completa</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground min-h-[120px]"
            placeholder="Descrição detalhada do produto..."
          />
        </div>

        {/* Price, Compare, Volume */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-secondary-foreground/70">Preço (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
              placeholder="89.90"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-secondary-foreground/70">Preço Comparativo (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.compare_price}
              onChange={(e) => setForm((p) => ({ ...p, compare_price: e.target.value }))}
              className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
              placeholder="109.90"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-secondary-foreground/70">Volume</Label>
            <Input
              value={form.volume}
              onChange={(e) => setForm((p) => ({ ...p, volume: e.target.value }))}
              className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
              placeholder="1L"
            />
          </div>
        </div>

        {/* Category, Badge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-secondary-foreground/70">Categoria</Label>
            <Select value={form.category_id} onValueChange={(v) => setForm((p) => ({ ...p, category_id: v }))}>
              <SelectTrigger className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-secondary-foreground/70">Badge / Selo</Label>
            <Input
              value={form.badge}
              onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
              className="bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground"
              placeholder="MAIS VENDIDO"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Switch checked={form.is_active} onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))} />
            <Label className="text-secondary-foreground/70">Produto ativo</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.is_featured} onCheckedChange={(v) => setForm((p) => ({ ...p, is_featured: v }))} />
            <Label className="text-secondary-foreground/70">Destaque na home</Label>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-3">
          <Label className="text-secondary-foreground/70">Imagens do Produto</Label>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-secondary-foreground/10">
                <img
                  src={getImageUrl(img.storage_path)}
                  alt={img.alt_text || ""}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {newFiles.map((file, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-primary/30 bg-primary/5">
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-primary/80 text-primary-foreground text-[9px] text-center py-0.5">
                  NOVO
                </div>
              </div>
            ))}

            <label className="aspect-square rounded-lg border-2 border-dashed border-secondary-foreground/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              <Upload size={20} className="text-secondary-foreground/30 mb-1" />
              <span className="text-secondary-foreground/30 text-[10px]">Adicionar</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" className="font-heading uppercase tracking-wider" disabled={saving}>
            {saving ? "Salvando..." : isEdit ? "Salvar Alterações" : "Criar Produto"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin")} className="text-secondary-foreground border-secondary-foreground/20">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
