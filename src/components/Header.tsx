import { useState, useEffect } from "react";
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
  { label: "Indique sua Cidade", to: "/indique-cidade" },
  { label: "Depoimentos", to: "/depoimentos" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "glass py-1 shadow-[0_4px_30px_hsl(var(--primary)/0.08)]"
          : "bg-secondary/95 backdrop-blur-md py-0"
      )}
    >
      <div className="container flex items-center gap-4 h-14 md:h-16">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
          <img
            src="/images/logo-motorex.png"
            alt="MOTOREX"
            className="h-8 md:h-12 w-auto"
          />
        </Link>

        {/* Pill-shaped nav */}
        <div className="hidden lg:flex items-center flex-1 glass-card rounded-full px-2 py-1.5">
          <nav className="flex items-center justify-center flex-1 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative px-3 py-1.5 text-xs font-heading uppercase tracking-wider transition-all duration-300 group",
                  location.pathname === item.to
                    ? "text-primary"
                    : "text-secondary-foreground/80 hover:text-primary-foreground"
                )}
              >
                <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300",
                    location.pathname === item.to ? "w-3/4" : "w-0 group-hover:w-1/2"
                  )}
                />
              </Link>
            ))}
          </nav>

          <CartIcon />
          <Link
            to="/central-atendimento"
            className="flex items-center bg-primary text-primary-foreground font-heading uppercase text-xs tracking-wider px-5 py-2 btn-clip hover:shadow-[0_0_20px_hsl(197_100%_43.7%/0.3)] transition-all duration-300"
          >
            Central de Atendimento
          </Link>
        </div>

        {/* Mobile cart + hamburger */}
        <div className="lg:hidden ml-auto flex items-center gap-1">
          <CartIcon />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-secondary-foreground p-2 transition-transform duration-300 hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-14 z-40 glass lg:hidden">
          <nav className="flex flex-col items-center justify-center gap-1 pt-12">
            {navItems.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-heading uppercase text-lg tracking-wider py-3 transition-all duration-300 animate-fade-up min-h-[44px] flex items-center",
                  location.pathname === item.to
                    ? "text-primary"
                    : "text-secondary-foreground/80 hover:text-primary"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/central-atendimento"
              onClick={() => setMobileOpen(false)}
              className="mt-6 bg-primary text-primary-foreground font-heading uppercase text-sm tracking-wider px-8 py-3 btn-clip hover:shadow-[0_0_20px_hsl(197_100%_43.7%/0.3)] transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${navItems.length * 50}ms` }}
            >
              Central de Atendimento
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
