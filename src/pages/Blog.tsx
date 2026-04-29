import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, ArrowUpRight } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import GlareCard from "@/components/GlareCard";
import type { BlogPost } from "@/types/database";
import { getBlogCoverUrl } from "@/lib/image-utils";
import NewsletterPopup from "@/components/NewsletterPopup";

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const PostSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-muted/30 border border-foreground/[0.04]">
    <div
      className="aspect-square"
      style={{
        background: "linear-gradient(-90deg, hsl(0 0% 10%) 0%, hsl(0 0% 14%) 50%, hsl(0 0% 10%) 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer-loading 1.5s ease-in-out infinite",
      }}
    />
    <div className="p-4 space-y-3">
      <div className="h-3 w-16 rounded bg-foreground/5" />
      <div className="h-4 w-3/4 rounded bg-foreground/5" />
      <div className="h-4 w-1/3 rounded bg-foreground/5" />
    </div>
  </div>
);

const Blog = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const categories = [...new Set(posts.map((p) => p.category))];

  const filtered = posts.filter((post) => {
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Banner */}
      <section className="relative w-full overflow-hidden">
        <img
          src="/images/banner-motorex.jpg"
          alt="Blog RT Brasil"
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Filter Bar ── */}
      <section className="md:sticky md:top-12 z-30 border-b border-foreground/[0.06] bg-background/90 backdrop-blur-xl">
        <div className="container py-3">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1 max-w-sm neon-focus rounded-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Buscar post..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/30 border-foreground/10 text-foreground h-9 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3.5 py-1.5 text-[11px] font-heading uppercase tracking-wider rounded-full transition-all duration-300 ${
                  !activeCategory
                    ? "bg-motorex/15 border border-motorex text-motorex shadow-[0_0_12px_hsl(var(--motorex)/0.2)]"
                    : "bg-foreground/5 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/20"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-3.5 py-1.5 text-[11px] font-heading uppercase tracking-wider rounded-full transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-motorex/15 border border-motorex text-motorex shadow-[0_0_12px_hsl(var(--motorex)/0.2)]"
                      : "bg-foreground/5 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Posts Grid ── */}
      <section className="relative py-10 md:py-16 min-h-[50vh] mesh-gradient">
        <div className="container relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-heading uppercase">Nenhum post encontrado</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Tente outro filtro ou busca.</p>
            </div>
          ) : !activeCategory && !search ? (
            <div className="space-y-14 md:space-y-20">
              {categories.map((cat) => {
                const catPosts = filtered.filter((p) => p.category === cat);
                if (catPosts.length === 0) return null;
                return (
                  <div key={cat}>
                    <AnimateOnScroll animation="fade-up">
                      <div className="flex items-end justify-between mb-5 md:mb-7 gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-motorex/60" />
                          <h2 className="font-heading uppercase text-xl md:text-3xl tracking-wider text-foreground whitespace-nowrap">
                            {cat}
                          </h2>
                          <span className="text-motorex/70 text-xs font-heading tracking-widest">
                            {String(catPosts.length).padStart(2, "0")}
                          </span>
                        </div>
                        <button
                          onClick={() => setActiveCategory(cat)}
                          className="text-[10px] md:text-xs font-heading uppercase tracking-wider text-muted-foreground hover:text-motorex transition-colors whitespace-nowrap"
                        >
                          Ver tudo →
                        </button>
                      </div>
                    </AnimateOnScroll>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                      {catPosts.map((post, i) => (
                        <AnimateOnScroll key={post.id} animation="fade-up" delay={(i % 4) * 80}>
                          <BlogCard post={post} />
                        </AnimateOnScroll>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {filtered.map((post, i) => (
                <AnimateOnScroll key={post.id} animation="fade-up" delay={(i % 4) * 80}>
                  <BlogCard post={post} />
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      <NewsletterPopup />
    </>
  );
};

const BlogCard = ({ post }: { post: BlogPost }) => {
  const coverUrl = getBlogCoverUrl(post.cover_image_path);
  return (
    <GlareCard>
      <a
        href={post.external_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block glass-card rounded-lg overflow-hidden transition-all duration-500 h-full"
      >
        <div className="relative aspect-square overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-1/2 h-1/2 rounded-full bg-primary/8 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={post.title}
              className="relative z-[1] w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={36} className="text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500 z-[2]" />

          <div className="absolute bottom-0 inset-x-0 z-[3] bg-primary/90 backdrop-blur-sm text-primary-foreground py-2.5 flex items-center justify-center gap-2 font-heading uppercase text-xs tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <BookOpen size={14} /> Ler agora <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="p-3 md:p-4">
          <span className="text-primary text-[10px] font-heading uppercase tracking-wider">
            {post.category}
          </span>
          <h3 className="font-heading text-sm md:text-base font-semibold mt-0.5 leading-tight">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 mt-3">
            <span className="font-heading text-motorex font-bold text-xs md:text-sm">
              {formatDate(post.created_at)}
            </span>
            <Badge variant="secondary" className="text-[9px] bg-foreground/5 text-muted-foreground border-0 ml-auto">
              <ArrowUpRight size={10} className="mr-0.5" /> Externo
            </Badge>
          </div>
        </div>
      </a>
    </GlareCard>
  );
};

export default Blog;
