import { useEffect, useRef, useState, type ReactNode } from "react";

type Animation =
  | "fade-up"
  | "fade-in-left"
  | "fade-in-right"
  | "scale-in"
  | "blur-in"
  | "slide-up";

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  threshold?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const animationClasses: Record<Animation, string> = {
  "fade-up": "animate-fade-up",
  "fade-in-left": "animate-fade-in-left",
  "fade-in-right": "animate-fade-in-right",
  "scale-in": "animate-scale-in",
  "blur-in": "animate-blur-in",
  "slide-up": "animate-slide-up",
};

const AnimateOnScroll = ({
  children,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
  className = "",
  as: Tag = "div",
}: AnimateOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref as any}
      className={`${className} ${
        isVisible ? animationClasses[animation] : "opacity-0"
      }`}
      style={{ animationDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  );
};

export default AnimateOnScroll;
