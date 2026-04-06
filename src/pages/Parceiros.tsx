import { Link } from "react-router-dom";
import { Trophy, ChevronRight, Instagram } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const getPartnerImage = (path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/parceiros/${path}`;

interface Partner {
  name: string;
  slug: string;
  image: string;
  role: string;
  instagram: string;
  titles: number;
  topAchievement: string;
}

const partners: Partner[] = [
  {
    name: "Heitor Matos",
    slug: "heitor-matos",
    image: getPartnerImage("heitor/heitorcard.png"),
    role: "Piloto de Motocross & BMX",
    instagram: "@heitormatos300",
    titles: 5,
    topAchievement: "Campeão Brasileiro MX 2021",
  },
  {
    name: "Lorenzo Ricken",
    slug: "lorenzo-ricken",
    image: getPartnerImage("lorenzo/lorenzocard.png"),
    role: "Piloto de Motocross",
    instagram: "@lorenzorr16",
    titles: 8,
    topAchievement: "Bicampeão Brasileiro MX",
  },
  {
    name: "Rodrigo Galiotto",
    slug: "rodrigo-galiotto",
    image: getPartnerImage("rodrigo/rodrigocard.png"),
    role: "Piloto de Motocross & Velocross",
    instagram: "@galiotto.720",
    titles: 12,
    topAchievement: "4x Campeão Gaúcho MX",
  },
  {
    name: "Marcelo Galiotto",
    slug: "marcelo-galiotto",
    image: getPartnerImage("marcelo/marcelocard.png"),
    role: "Piloto de Motocross",
    instagram: "@tchelo110",
    titles: 12,
    topAchievement: "9x Campeão Regional",
  },
  {
    name: "Otavio Oliveira",
    slug: "otavio-oliveira",
    image: getPartnerImage("otavio/otaviocard.png"),
    role: "Piloto de Motocross & Trilhas",
    instagram: "@otaviooliveira05",
    titles: 1,
    topAchievement: "Guia Off-Road Ilicínea MG",
  },
];

const Parceiros = () => {
  return (
    <section className="bg-secondary text-secondary-foreground py-8 md:py-16 min-h-screen">
      <div className="container">
        {/* Header */}
        <AnimateOnScroll animation="fade-up">
          <h1 className="font-heading text-[42px] md:text-[64px] uppercase font-bold text-center leading-none mb-2">
            Nossos <span className="text-gradient">Parceiros</span>
          </h1>
          <p className="text-secondary-foreground/50 text-center mb-12 md:mb-16 max-w-lg mx-auto">
            Pilotos e revendedores que confiam na RT Brasil e MOTOREX para alcançar a máxima performance.
          </p>
        </AnimateOnScroll>

        {/* Partner Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {partners.map((partner, i) => (
            <AnimateOnScroll key={partner.slug} animation="scale-in" delay={i * 150}>
              <Link to={`/parceiros/${partner.slug}`} className="group block">
                <div className="relative glass-card rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_40px_hsl(197_100%_43.7%/0.25)]">
                  {/* Card image — natural aspect ratio */}
                  <div className="relative overflow-hidden">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="w-full h-auto block transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-heading uppercase tracking-wider px-3 py-1 rounded-sm">
                        Parceiro RT
                      </span>
                    </div>

                    {/* Glow line on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Card info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-primary text-xs font-heading uppercase tracking-wider">
                        {partner.titles}x Campeão
                      </span>
                    </div>
                    <h3 className="font-heading text-2xl uppercase font-bold text-white leading-tight">
                      {partner.name}
                    </h3>
                    <p className="text-white/60 text-sm mb-3">{partner.role}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-white/50 text-xs">
                        <Instagram className="w-3.5 h-3.5" />
                        <span>{partner.instagram}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary text-xs font-heading uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Ver perfil <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>

        {/* CTA to become a partner */}
        <AnimateOnScroll animation="fade-up" delay={400}>
          <div className="mt-16 text-center">
            <div className="liquid-glass inline-block px-5 md:px-8 py-6 rounded-lg">
              <h2 className="font-heading text-xl md:text-2xl uppercase font-bold mb-2">
                Quer ser um parceiro RT Brasil?
              </h2>
              <p className="text-secondary-foreground/60 text-sm mb-4">
                Pilotos e revendedores podem se inscrever para o nosso programa.
              </p>
              <Link
                to="/seja-revendedor"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-heading uppercase tracking-wider text-sm px-6 py-3 btn-clip hover-glow transition-all duration-300 min-h-[44px] w-full sm:w-auto justify-center"
              >
                Quero ser parceiro <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default Parceiros;
