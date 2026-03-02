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
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-secondary">
      <div className="container flex items-center gap-4 h-16 md:h-20">
        {/* Logo outside the pill */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="/images/logo-motorex.png"
            alt="MOTOREX"
            className="h-10 md:h-14 w-auto"
          />
        </Link>

        {/* Pill-shaped nav */}
        <div className="hidden lg:flex items-center flex-1 bg-secondary-foreground/10 border border-secondary-foreground/20 rounded-full px-2 py-1.5">
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
              </Link>
            ))}
          </nav>

          {/* CTA pill */}
          <Link
            to="/central-atendimento"
            className="flex items-center bg-primary-foreground text-secondary font-heading uppercase text-xs tracking-wider px-5 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
          >
            Central de Atendimento
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-secondary-foreground p-2 ml-auto"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-secondary/95 backdrop-blur-sm lg:hidden animate-fade-in">
          <nav className="flex flex-col items-center justify-center gap-2 pt-12">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-heading uppercase text-lg tracking-wider py-3 transition-colors duration-300",
                  location.pathname === item.to
                    ? "text-primary"
                    : "text-secondary-foreground/80 hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/central-atendimento"
              onClick={() => setMobileOpen(false)}
              className="mt-4 bg-primary-foreground text-secondary font-heading uppercase text-sm tracking-wider px-8 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
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
