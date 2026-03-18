import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";

const CartIcon = () => {
  const { getItemCount, setIsOpen } = useCart();
  const count = getItemCount();
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 300);
      return () => clearTimeout(t);
    }
  }, [count]);

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative p-2 text-secondary-foreground/80 hover:text-primary transition-colors duration-300"
      aria-label="Carrinho"
    >
      <ShoppingCart size={22} />
      {count > 0 && (
        <span
          className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1 ${
            bounce ? "animate-scale-in" : ""
          }`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
