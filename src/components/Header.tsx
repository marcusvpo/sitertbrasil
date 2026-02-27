import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Motorex", to: "/motorex" },
  { label: "Seja um Revendedor", to: "/seja-revendedor" },
  { label: "Quem Somos", to: "/quem-somos" },
  { label: "Parceiros", to: "/parceiros" },
  { label: "Indique sua Cidade", to: "/indique-cidade" },
  { label: "Depoimentos", to: "/depoimentos" },
  { label: "Central de Atendimento", to: "/central-atendimento" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-secondary border-b border-secondary/80">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex-shrink-0">
          <img
            src="/images/logo-rt-brasil.webp"
            alt="RT Brasil - Distribuidora Oficial MOTOREX"
            className="h-10 md:h-14 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "px-3 py-2 text-xs font-heading uppercase tracking-wider transition-colors",
                location.pathname === item.to
                  ? "text-primary"
                  : "text-secondary-foreground/80 hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-secondary-foreground p-2"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="lg:hidden bg-secondary border-t border-secondary/60 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-6 py-3 font-heading uppercase text-sm tracking-wider transition-colors",
                location.pathname === item.to
                  ? "text-primary bg-secondary/50"
                  : "text-secondary-foreground/80 hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
