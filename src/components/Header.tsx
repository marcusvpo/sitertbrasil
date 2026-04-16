import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import CartIcon from "@/components/CartIcon";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Motorex", to: "/motorex" },
  { label: "Seja um Revendedor", to: "/seja-revendedor" },
  { label: "Quem Somos", to: "/quem-somos" },
  { label: "Parceiros", to: "/parceiros" },
  
  { label: "Depoimentos", to: "/depoimentos" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Refs for animated pill indicator
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update pill position when route changes
  useEffect(() => {
    const activeIdx = navItems.findIndex((item) => item.to === location.pathname);
    const el = navRefs.current[activeIdx];
    const container = navContainerRef.current;
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setPillStyle({
        left: elRect.left - containerRect.left,
        width: elRect.width,
      });
    }
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Floating Dynamic Island */}
      <div className="flex justify-center px-4 py-2">
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border transition-all duration-500",
            "bg-motorex/95 backdrop-blur-2xl border-white/10",
            "shadow-[0_4px_30px_hsl(0_0%_0%/0.4)]",
            scrolled ? "px-3 py-1" : "px-4 py-1.5"
          )}
        >
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-105 mr-1">
            <picture>
            <source srcSet="/images/logo-motorex.webp" type="image/webp" />
            <img
              src="/images/logo-motorex.png"
              alt="MOTOREX"
              width={120}
              height={32}
              fetchPriority="high"
              className={cn("w-auto transition-all duration-500", scrolled ? "h-8" : "h-10")}
            />
            </picture>
          </Link>

          {/* Desktop nav with animated pill */}
          <nav ref={navContainerRef} className="hidden lg:flex items-center relative">
            {/* Animated pill behind active item */}
            <div
              className="absolute h-7 rounded-full bg-white/15 border border-white/20 transition-all duration-300 ease-out"
              style={{
                left: pillStyle.left,
                width: pillStyle.width,
                opacity: navItems.some((item) => item.to === location.pathname) ? 1 : 0,
              }}
            />

            {navItems.map((item, i) => (
              <Link
                key={item.to}
                ref={(el) => { navRefs.current[i] = el; }}
                to={item.to}
                className={cn(
                  "relative px-3 py-1.5 text-[11px] font-heading uppercase tracking-wider transition-colors duration-300 whitespace-nowrap",
                  location.pathname === item.to
                    ? "text-white font-semibold"
                    : "text-white/70 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-1 ml-1">
            <CartIcon />
            <Link
              to="/central-atendimento"
              className="relative flex items-center font-heading uppercase text-[11px] tracking-wider px-4 py-1.5 rounded-full border-beam text-motorex bg-white btn-clip hover:bg-white/90 transition-all duration-300"
            >
              Central de Atendimento
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden ml-auto flex items-center gap-1">
            <CartIcon />
            <button
          onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white p-2 transition-transform duration-300 hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 top-0 z-40 lg:hidden transition-all duration-500",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-2xl" />
        <nav className="relative flex flex-col items-center justify-center h-full gap-2">
          {navItems.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "font-heading uppercase text-xl tracking-wider py-3 transition-all duration-300 min-h-[44px] flex items-center",
                mobileOpen ? "animate-fade-up" : "",
                location.pathname === item.to
                  ? "text-motorex"
                  : "text-foreground/60 hover:text-motorex"
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/central-atendimento"
            onClick={() => setMobileOpen(false)}
            className="mt-8 bg-primary text-primary-foreground font-heading uppercase text-sm tracking-wider px-8 py-3 btn-clip hover:shadow-[0_0_20px_hsl(197_100%_43.7%/0.3)] transition-all duration-300 animate-fade-up"
            style={{ animationDelay: `${navItems.length * 60}ms` }}
          >
            Central de Atendimento
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
