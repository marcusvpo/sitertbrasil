import { Link } from "react-router-dom";
import { Instagram, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo + about */}
          <div>
            <img
              src="/images/logo-motorex.png"
              alt="RT Brasil"
              className="h-12 w-auto mb-4"
            />
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              Distribuidora oficial MOTOREX no Brasil. Lubrificantes de alta
              performance para motocross, enduro e off-road.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="font-heading uppercase text-primary text-sm tracking-wider mb-4">
              Navegação
            </h4>
            <nav className="flex flex-col gap-2">
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
                  className="text-secondary-foreground/70 hover:text-primary text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading uppercase text-primary text-sm tracking-wider mb-4">
              Contato
            </h4>
            <div className="flex flex-col gap-3 text-sm text-secondary-foreground/70">
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone size={16} />
                WhatsApp
              </a>
              <a
                href="mailto:contato@rtbrasil.com.br"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail size={16} />
                contato@rtbrasil.com.br
              </a>
              <a
                href="https://instagram.com/rtbrasil"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Instagram size={16} />
                @rtbrasil
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-10 pt-6 text-center text-xs text-secondary-foreground/50">
          © {new Date().getFullYear()} RT Brasil. Todos os direitos reservados.
          Distribuidora oficial MOTOREX.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
