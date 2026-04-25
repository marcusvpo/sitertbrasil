import { Link } from "react-router-dom";
import { Instagram, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-white/10">
      {/* Subtle mesh gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div className="container relative py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo + about */}
          <div>
            <img
              src="/images/logo-motorex.png"
              alt="RT Brasil"
              className="h-14 w-auto mb-4"
            />
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Distribuidora oficial <span className="text-white font-semibold">MOTOREX</span> no Brasil. Lubrificantes de alta
              performance para motocross, enduro e off-road.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="font-heading uppercase text-white text-xs tracking-[0.2em] mb-4">
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
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300 w-fit group"
                >
                  <span className="relative">
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading uppercase text-white text-xs tracking-[0.2em] mb-4">
              Contato
            </h4>
            <div className="flex flex-col gap-3 text-sm text-white/60">
              <a
                href="https://wa.me/5516997964255"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors duration-300"
              >
                <Phone size={14} className="text-white/40" />
                (16) 99796-4255
              </a>
              <a
                href="mailto:vendas@rtbrasilimport.com.br"
                className="flex items-center gap-2.5 hover:text-white transition-colors duration-300"
              >
                <Mail size={14} className="text-white/40" />
                vendas@rtbrasilimport.com.br
              </a>
              <a
                href="https://instagram.com/rtbrasil.motorex"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors duration-300"
              >
                <Instagram size={14} className="text-white/40" />
                @rtbrasil.motorex
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-white/40" />
                <span>Av. Alfeu Martini, 790 - Distrito Industrial II, Jaboticabal - SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-5 text-center text-xs text-white/50 space-y-1">
          <p>Rt Brasil Importação e Comércio — CNPJ: 00.913.926/0001-78</p>
          <p>© {new Date().getFullYear()} RT Brasil. Todos os direitos reservados.
          Distribuidora oficial <span className="text-white">MOTOREX</span>.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
