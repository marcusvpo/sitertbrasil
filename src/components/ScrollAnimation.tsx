import { useEffect, useRef, useState, useCallback } from "react";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const BUCKET = "animation";
const TOTAL_FRAMES = 81;

const getFrameUrl = (index: number) => {
  const num = String(index).padStart(3, "0");
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/ezgif-frame-${num}.png`;
};

const ScrollAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>();

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      images.push(img);
    }

    imagesRef.current = images;
  }, []);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[frameIndex];
    if (!canvas || !ctx || !img || !img.complete) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const canvasW = canvas.offsetWidth;
    const canvasH = canvas.offsetHeight;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasW / canvasH;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgRatio > canvasRatio) {
      drawH = canvasH;
      drawW = canvasH * imgRatio;
      drawX = (canvasW - drawW) / 2;
      drawY = 0;
    } else {
      drawW = canvasW;
      drawH = canvasW / imgRatio;
      drawX = 0;
      drawY = (canvasH - drawH) / 2;
    }

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollableHeight = container.offsetHeight - window.innerHeight;
        const scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(scrollProgress * TOTAL_FRAMES)
        );

        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }
      });
    };

    // Draw first frame
    if (loadedCount >= 1) {
      drawFrame(0);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loadedCount, drawFrame]);

  const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${TOTAL_FRAMES * 6}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: loadedCount > 0 ? "block" : "none" }}
        />
        {/* Loading overlay */}
        {loadedCount < TOTAL_FRAMES && (
          <div className="absolute inset-0 bg-secondary flex flex-col items-center justify-center z-10">
            <div className="w-48 h-1 bg-secondary-foreground/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-secondary-foreground/50 text-sm mt-3 font-heading uppercase tracking-wider">
              Carregando animação… {progress}%
            </span>
          </div>
        )}
        {/* Hero content overlay */}
        <div className="absolute inset-0 bg-secondary/50 pointer-events-none" />
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="container">
            <div className="max-w-3xl text-center md:text-left pointer-events-auto">
              <span className="inline-block font-heading uppercase text-primary text-sm tracking-[0.2em] mb-4">
                Distribuidora Oficial MOTOREX no Brasil
              </span>
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] mb-6 text-secondary-foreground">
                Performance Máxima Para Quem Vive o{" "}
                <span className="text-primary">Motocross</span>
              </h1>
              <p className="text-secondary-foreground/70 text-lg md:text-xl max-w-xl mb-8">
                Lubrificantes e produtos de alta tecnologia suíça para quem exige o
                melhor da sua máquina.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimation;
