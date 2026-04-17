import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/integrations/supabase/client";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const BUCKET = "carrossel";
const IMAGE_NAMES = Array.from({ length: 12 }, (_, i) => `motorex${i + 1}.jpg`);

const HomeCarousel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const images = IMAGE_NAMES.map(
    (name) => supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden section-motorex-glow">
      <div className="container relative z-10">
        <AnimateOnScroll className="text-center mb-10">
          <span className="font-heading uppercase text-white/80 text-xs tracking-[0.3em]">Galeria</span>
          <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold mt-2 text-white">
            Mundo <span className="text-white">MOTOREX</span>
          </h2>
        </AnimateOnScroll>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-5">
            {images.map((url, i) => {
              const isActive = i === selectedIndex;
              return (
                <div
                  key={i}
                  className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[36%] pl-5 transition-all duration-500"
                >
                  <div
                    className={`relative rounded-xl overflow-hidden border-2 transition-all duration-700 bg-background ${
                      isActive
                        ? "border-white shadow-[0_0_30px_rgba(0,0,0,0.45)] scale-100"
                        : "border-white/20 scale-[0.93] opacity-60"
                    }`}
                  >
                    <div className="aspect-[4/5]">
                      <img
                        src={url}
                        alt={`MOTOREX galeria ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "bg-white w-7"
                  : "bg-white/30 w-2 hover:bg-white/60"
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
