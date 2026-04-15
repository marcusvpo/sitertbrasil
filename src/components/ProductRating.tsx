import { Star, StarHalf } from "lucide-react";

/** Deterministic pseudo-random from product name */
function seedRandom(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const topSales: Record<string, number> = {
  "CROSS POWER 2T": 400,
  "FORK OIL 5W": 200,
  "RACING FORK OIL 5 W": 200,
  "FORK OIL 2,5W": 200,
  "RACING FORK OIL 2,5 W": 200,
  "CROSS POWER 4T 10W50": 100,
  "CROSS POWER 4T 10W60": 100,
};

export function getProductRating(name: string): number {
  const seed = seedRandom(name);
  // Range 4.6 to 5.0, one decimal
  return Math.round((4.6 + (seed % 5) * 0.1) * 10) / 10;
}

export function getProductSalesCount(name: string): number {
  const upper = name.toUpperCase();
  for (const [key, val] of Object.entries(topSales)) {
    if (upper.includes(key.toUpperCase()) || key.toUpperCase().includes(upper)) {
      return val;
    }
  }
  // Random between 20 and 90
  const seed = seedRandom(name);
  return 20 + (seed % 71);
}

interface ProductRatingProps {
  productName: string;
  size?: "sm" | "md";
}

const ProductRating = ({ productName, size = "md" }: ProductRatingProps) => {
  const rating = getProductRating(productName);
  const sales = getProductSalesCount(productName);
  const starSize = size === "sm" ? 12 : 14;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div className="flex items-center gap-px">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={i} size={starSize} className="fill-amber-400 text-amber-400" />
        ))}
        {hasHalf && <StarHalf size={starSize} className="fill-amber-400 text-amber-400" />}
        {Array.from({ length: 5 - fullStars - (hasHalf ? 1 : 0) }).map((_, i) => (
          <Star key={`e${i}`} size={starSize} className="text-foreground/20" />
        ))}
      </div>
      <span className={`text-muted-foreground ${size === "sm" ? "text-[10px]" : "text-xs"}`}>
        {rating}
      </span>
      <span className={`text-muted-foreground/60 ${size === "sm" ? "text-[10px]" : "text-xs"}`}>
        (+{sales} vendidos)
      </span>
    </div>
  );
};

export default ProductRating;
