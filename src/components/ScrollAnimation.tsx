import { useEffect, useRef, useState, useCallback } from "react";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const BUCKET = "animation";
const TOTAL_FRAMES = 81;

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;
const FRAME_STEP = IS_MOBILE ? 4 : 1;
const ACTIVE_FRAMES = IS_MOBILE
  ? Array.from({ length: Math.ceil(TOTAL_FRAMES / FRAME_STEP) }, (_, i) => i * FRAME_STEP + 1)
  : Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1);

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
  const [isVisible, setIsVisible] = useState(false);

  // Only start loading when near viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Load frames only when visible
  useEffect(() => {
    if (!isVisible) return;

    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (const frameNum of ACTIVE_FRAMES) {
      const img = new Image();
      img.src = getFrameUrl(frameNum);
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      images.push(img);
    }

    imagesRef.current = images;
  }, [isVisible]);

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
      drawW = canvasW;
      drawH = canvasW / imgRatio;
      drawX = 0;
      drawY = (canvasH - drawH) / 2;
    } else {
      drawH = canvasH;
      drawW = canvasH * imgRatio;
      drawX = (canvasW - drawW) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const totalActive = ACTIVE_FRAMES.length;

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
          totalActive - 1,
          Math.floor(scrollProgress * totalActive)
        );

        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }
      });
    };

    if (loadedCount >= 1) {
      drawFrame(0);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loadedCount, drawFrame, totalActive]);

  const progress = Math.round((loadedCount / totalActive) * 100);

  return (
    <div
      ref={containerRef}
      className="relative bg-secondary"
      style={{ height: `${totalActive * (IS_MOBILE ? 8 : 2.5)}vh` }}
    >
      <div className="sticky top-16 md:top-20 w-full overflow-hidden" style={{ height: "calc(100vh - 5rem)" }}>
        <div className="container h-full py-4">
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl border border-secondary-foreground/10">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ display: loadedCount > 0 ? "block" : "none" }}
            />
            {loadedCount < totalActive && (
              <div className="absolute inset-0 bg-secondary flex flex-col items-center justify-center z-10">
                <div className="w-48 h-1 bg-secondary-foreground/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-secondary-foreground/50 text-sm mt-3 font-heading uppercase tracking-wider">
                  Carregando… {progress}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimation;
