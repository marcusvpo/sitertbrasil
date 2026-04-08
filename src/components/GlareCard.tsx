import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface GlareCardProps {
  children: ReactNode;
  className?: string;
}

const GlareCard = ({ children, className }: GlareCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mx", `${x}%`);
    ref.current.style.setProperty("--my", `${y}%`);
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--mx", "50%");
    ref.current.style.setProperty("--my", "50%");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("card-glare", className)}
    >
      {children}
    </div>
  );
};

export default GlareCard;
