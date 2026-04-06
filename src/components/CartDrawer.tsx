import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, ExternalLink } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getProductImageUrl } from "@/lib/image-utils";

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const buildYampiUrl = (items: { slug: string; qty: number }[]) => {
  const param = items.map((i) => `${i.slug}:${i.qty}`).join(",");
  return `https://rtbrasil.yampi.com.br/checkout?items=${param}`;
};

const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount, isOpen, setIsOpen } = useCart();

  const total = getTotal();
  const count = getItemCount();

  const handleCheckout = () => {
    const yampiItems = items.map((i) => ({ slug: i.product.slug, qty: i.quantity }));
    const url = buildYampiUrl(yampiItems);
    window.open(url, "_blank");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg glass border-l border-primary/10 flex flex-col p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-primary/10">
          <SheetTitle className="font-heading uppercase text-secondary-foreground flex items-center gap-2">
            <ShoppingCart size={20} className="text-primary" />
            Meu Carrinho
            {count > 0 && (
              <span className="text-xs font-normal text-secondary-foreground/50">
                ({count} {count === 1 ? "item" : "itens"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-5 gap-4">
            <div className="w-20 h-20 rounded-full bg-secondary-foreground/5 flex items-center justify-center">
              <ShoppingCart size={32} className="text-secondary-foreground/20" />
            </div>
            <p className="text-secondary-foreground/50 font-heading uppercase text-sm">Carrinho vazio</p>
            <Button asChild className="font-heading uppercase tracking-wider" onClick={() => setIsOpen(false)}>
              <Link to="/motorex">Ver produtos</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-5">
              <div className="space-y-3 pb-4 pt-3">
                {items.map((item) => {
                  const img = item.product.images?.[0];
                  const price = Number(item.product.price) || 0;
                  const subtotal = price * item.quantity;

                  return (
                    <div key={item.product.id} className="glass-card rounded-lg p-3 flex gap-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary-foreground/10 flex-shrink-0">
                        {img ? (
                          <img
                            src={getProductImageUrl(img)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-secondary-foreground/20 text-xs font-heading uppercase">
                            {item.product.name.substring(0, 3)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-xs uppercase font-semibold text-secondary-foreground truncate">
                          {item.product.name}
                        </h4>
                        {item.product.volume && (
                          <span className="text-[10px] text-secondary-foreground/40">{item.product.volume}</span>
                        )}
                        <p className="text-primary font-heading font-bold text-sm mt-1">
                          {formatBRL(subtotal)}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 rounded bg-secondary-foreground/10 flex items-center justify-center text-secondary-foreground/60 hover:bg-secondary-foreground/20 disabled:opacity-30 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-heading text-xs text-secondary-foreground w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-secondary-foreground/10 flex items-center justify-center text-secondary-foreground/60 hover:bg-secondary-foreground/20 transition-colors"
                          >
                            <Plus size={12} />
                          </button>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-auto w-6 h-6 rounded flex items-center justify-center text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="border-t border-primary/10 px-5 py-4 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-secondary-foreground/60">
                  <span>Frete</span>
                  <span className="italic text-xs">Calculado no checkout</span>
                </div>
                <Separator className="bg-secondary-foreground/10" />
                <div className="flex justify-between items-baseline">
                  <span className="font-heading uppercase text-secondary-foreground text-sm">Total</span>
                  <span className="font-heading text-primary font-bold text-xl">{formatBRL(total)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full font-heading uppercase tracking-wider hover-glow"
              >
                Finalizar Compra <ExternalLink size={16} className="ml-2" />
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 text-xs font-heading uppercase text-secondary-foreground/50 hover:text-secondary-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Continuar Comprando
                </Button>
                <Button
                  variant="ghost"
                  className="text-xs font-heading uppercase text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                  onClick={clearCart}
                >
                  Limpar
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
