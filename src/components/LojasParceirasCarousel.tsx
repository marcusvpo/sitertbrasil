import AnimateOnScroll from "@/components/AnimateOnScroll";

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const getLogoUrl = (file: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/parceiros/lojas-logos/${file}`;

interface Loja {
  nome: string;
  cidade: string;
  uf: string;
  url: string;
  logo: string;
}

const lojas: Loja[] = [
  { nome: "América Sports", cidade: "São Paulo", uf: "SP", url: "https://www.americasports.com.br/", logo: "logo-americasports.webp" },
  { nome: "Dika Bike World", cidade: "São Paulo", uf: "SP", url: "https://www.dicabikeworld.com.br/", logo: "logo-dikabikeworld.png" },
  { nome: "Zelão Racing", cidade: "Jundiaí", uf: "SP", url: "https://www.zelao.com.br/", logo: "logo-zelaoracing.png" },
  { nome: "Moto Fuoristrada", cidade: "Jundiaí", uf: "SP", url: "https://motofuoristrada.com.br/", logo: "logo-motofuoristrada.png" },
  { nome: "ArtMoto", cidade: "São José dos Campos", uf: "SP", url: "https://www.artmotoracing.com.br/", logo: "logo-artmoto.png" },
  { nome: "Trilha Race", cidade: "Franca", uf: "SP", url: "https://www.trilharace.com.br/", logo: "logo-trilharace.png" },
  { nome: "MRP Racing", cidade: "Campinas", uf: "SP", url: "https://www.mrpracing.com/", logo: "logo-mrpracing.png" },
  { nome: "JP Racing", cidade: "Pederneiras", uf: "SP", url: "https://www.instagram.com/jpracingpederneiras/", logo: "logo-jpracing.png" },
  { nome: "Fama Motos", cidade: "Socorro", uf: "SP", url: "https://www.instagram.com/fama.motos/", logo: "logo-famamotos.png" },
  { nome: "Mercado MX", cidade: "São Paulo", uf: "SP", url: "https://www.mercadomx.com.br/", logo: "logo-mercadomx.png" },
  { nome: "MotoX MX1", cidade: "Itapecerica da Serra", uf: "SP", url: "https://www.mercadomx.com.br/", logo: "logo-motoxmx1.jpg" },
  { nome: "Menta Motos", cidade: "Belo Horizonte", uf: "MG", url: "https://www.mentamotos.com.br/", logo: "logo-mentamotos.webp" },
  { nome: "BR Motos", cidade: "Belo Horizonte", uf: "MG", url: "https://www.brenduroparts.com.br/", logo: "logo-brmotos.jpeg" },
  { nome: "Evolution Pro Part", cidade: "Belo Horizonte", uf: "MG", url: "https://www.instagram.com/evolutionproparts/", logo: "logo-evolutionpro.jpg" },
  { nome: "Spinelli Off Road", cidade: "Porto Alegre", uf: "RS", url: "https://www.spinellimotos.com.br/", logo: "logo-spinellioffroad.png" },
  { nome: "Bamba Racing", cidade: "Chapecó", uf: "SC", url: "https://www.bambaracing.com.br/", logo: "logo-bambaracing.png" },
  { nome: "Moto A", cidade: "Chapecó", uf: "SC", url: "https://www.motoa.com.br/", logo: "logo-motoa.png" },
  { nome: "Eriton Motos", cidade: "Maringá", uf: "PR", url: "https://eritonmotos.com.br/", logo: "logo-eritonmotos.webp" },
  { nome: "Weblama Suspensões", cidade: "Guarapari", uf: "ES", url: "https://www.instagram.com/web_lama_suspension/", logo: "logo-weblamasuspensoes.png" },
  { nome: "Balau Racing", cidade: "Palmas", uf: "TO", url: "https://balauracing.com.br/", logo: "logo-balauracing.jpg" },
  { nome: "Raposão Racing", cidade: "Goiânia", uf: "GO", url: "https://www.instagram.com/rapozaoracing/", logo: "logo-rapozaoracing.jpg" },
  { nome: "Off Rush", cidade: "Jacareí", uf: "SP", url: "https://offrush.com", logo: "logo-offrush.png" },
];

const LojasParceirasCarousel = () => {
  const loop = [...lojas, ...lojas];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-background">
      <div className="container mb-10">
        <AnimateOnScroll className="text-center">
          <span className="font-heading uppercase text-primary text-xs tracking-[0.3em]">
            Rede de Revendedores
          </span>
          <h2 className="font-heading text-[clamp(1.75rem,4.5vw,3rem)] font-bold mt-2 uppercase">
            Lojas que confiam na <span className="text-gradient">RT Brasil</span>
          </h2>
          <p className="text-foreground/60 mt-3 max-w-xl mx-auto text-sm md:text-base">
            Revendedores oficiais MOTOREX em todo o Brasil
          </p>
        </AnimateOnScroll>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee gap-6 py-4">
          {loop.map((loja, i) => (
            <a
              key={`${loja.nome}-${i}`}
              href={loja.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${loja.nome} — ${loja.cidade}/${loja.uf}`}
              className="group shrink-0 w-[180px] h-[100px] bg-white rounded-lg border border-motorex/20 p-4 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[0_0_25px_hsl(197_100%_43.7%/0.35)]"
            >
              <img
                src={getLogoUrl(loja.logo)}
                alt={`Logo ${loja.nome}`}
                loading="lazy"
                className="max-w-full max-h-full object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LojasParceirasCarousel;
