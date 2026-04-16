import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/integrations/supabase/client";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const HomeCarousel = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage.from("carrossel").list("", {
        sortBy: { column: "name", order: "asc" },
      });
      if (error || !data) return;

      const urls = data
        .filter((f) => f.name.match(/\.(jpg|jpeg|png|webp|gif)$/i))
        .map((f) => supabase.storage.from("carrossel").getPublicUrl(f.name).data.publicUrl);

      setImages(urls);
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  if (images.length === 0) return null;

  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-background">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-motorex/8 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10">
        <AnimateOnScroll className="text-center mb-10">
          <span className="font-heading uppercase text-motorex text-xs tracking-[0.3em]">Galeria</span>
          <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2">
            Mundo <span className="text-motorex">MOTOREX</span>
          </h2>
        </AnimateOnScroll>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {images.map((url, i) => {
              const isActive = i === selectedIndex;
              return (
                <div
                  key={url}
                  className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[33.333%] pl-4 transition-all duration-500"
                >
                  <div
                    className={`relative rounded-xl overflow-hidden border-2 transition-all duration-500 ${
                      isActive
                        ? "border-motorex shadow-[0_0_30px_rgba(38,173,151,0.3)] scale-100"
                        : "border-motorex/20 scale-[0.92] opacity-60"
                    }`}
                  >
                    <div className="aspect-video">
                      <img
                        src={url}
                        alt={`MOTOREX galeria ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {/* Glow overlay on active */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-motorex/10 to-transparent pointer-events-none" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "bg-motorex w-6"
                  : "bg-foreground/20 hover:bg-foreground/40"
              }`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCarousel;
