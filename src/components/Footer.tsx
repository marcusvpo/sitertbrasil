import { Link } from "react-router-dom";
import { Instagram, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-foreground/[0.06]">
      {/* Subtle mesh gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container relative py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo + about */}
          <div>
            <img
              src="/images/logo-motorex.png"
              alt="RT Brasil"
              className="h-10 w-auto mb-4"
            />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Distribuidora oficial MOTOREX no Brasil. Lubrificantes de alta
              performance para motocross, enduro e off-road.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="font-heading uppercase text-primary text-xs tracking-[0.2em] mb-4">
              Navegação
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "Motorex", to: "/motorex" },
                { label: "Seja um Revendedor", to: "/seja-revendedor" },
                { label: "Quem Somos", to: "/quem-somos" },
                { label: "Parceiros", to: "/parceiros" },
                { label: "Depoimentos", to: "/depoimentos" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-muted-foreground hover:text-primary text-sm transition-colors duration-300 w-fit group"
                >
                  <span className="relative">
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading uppercase text-primary text-xs tracking-[0.2em] mb-4">
              Contato
            </h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-primary transition-colors duration-300"
              >
                <Phone size={14} className="text-primary/60" />
                WhatsApp
              </a>
              <a
                href="mailto:contato@rtbrasil.com.br"
                className="flex items-center gap-2.5 hover:text-primary transition-colors duration-300"
              >
                <Mail size={14} className="text-primary/60" />
                contato@rtbrasil.com.br
              </a>
              <a
                href="https://instagram.com/rtbrasil"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-primary transition-colors duration-300"
              >
                <Instagram size={14} className="text-primary/60" />
                @rtbrasil
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-primary/60" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/[0.06] mt-10 pt-5 text-center text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} RT Brasil. Todos os direitos reservados.
          Distribuidora oficial MOTOREX.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
