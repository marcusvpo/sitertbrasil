import { Link } from "react-router-dom";
import { ChevronRight, Droplet, Gauge, Shield, Wrench, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { SITE_URL } from "@/lib/seo-config";
import { Button } from "@/components/ui/button";
import { MX } from "@/lib/highlight-motorex";

const faqs = [
  {
    q: "Qual a diferença entre óleo 4T e 2T?",
    a: "Motores 4 tempos (4T) têm cárter separado e o óleo apenas lubrifica. Motores 2 tempos (2T) queimam o óleo junto com a mistura ar-combustível, então o lubrificante precisa ser de baixa fumaça e baixa cinza. MOTOREX Cross Power 4T e Cross Power 2T são formulados especificamente para cada arquitetura.",
  },
  {
    q: "O que significa SAE 10W40 ou 10W50?",
    a: "SAE indica a viscosidade. O número antes do W (Winter) é a fluidez a frio; o número depois é a viscosidade na temperatura de operação. 10W40 é o padrão mais usado em motocross 4T moderno; 10W50 e 15W60 são indicados para motores muito quentes ou alta carga (enduro extremo, areia).",
  },
  {
    q: "Por que JASO MA2 é importante na moto?",
    a: "Motos com embreagem banhada em óleo precisam de aditivos com fricção controlada. Óleos automotivos modernos (API SP, dexos) levam modificadores que fazem a embreagem patinar. JASO MA2 garante a fricção correta para embreagens em banho de óleo.",
  },
  {
    q: "Posso usar óleo de carro na minha moto de trilha?",
    a: "Não recomendamos. Além do problema de embreagem (JASO), motores de moto giram em RPMs muito mais altas e operam em temperaturas extremas. Óleos MOTOREX são desenvolvidos para essas condições.",
  },
  {
    q: "De quanto em quanto tempo trocar o óleo?",
    a: "Para motocross competitivo: a cada 5 a 10 horas de pista. Trilha/enduro recreativo: a cada 15 a 20 horas ou conforme manual da moto. Sempre troque o filtro junto. Motores 2T: misture na proporção indicada pelo fabricante (geralmente 1:50 a 1:40).",
  },
  {
    q: "Qual óleo MOTOREX para minha KTM/Husqvarna 4T?",
    a: "KTM e Husqvarna 4T modernas (250/350/450 SX-F, FC, EXC-F, FE) usam tipicamente MOTOREX Cross Power 4T 10W50 ou 10W60, conforme manual. Esse é o óleo de fábrica das equipes Red Bull KTM no Mundial de Motocross.",
  },
  {
    q: "Qual a diferença entre óleo mineral, semissintético e sintético?",
    a: "Mineral: derivado direto do petróleo, mais barato, vida útil curta. Semissintético: mistura de mineral + sintético, custo-benefício. Sintético (PAO/Ester): moléculas projetadas em laboratório, máxima estabilidade térmica e proteção. MOTOREX Cross Power é 100% sintético.",
  },
];

const Guia = () => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guia Definitivo: Qual Óleo Usar em Motocross, Trilha e Enduro",
    description:
      "Guia técnico completo para escolher o óleo MOTOREX certo para sua moto off-road: 4T vs 2T, viscosidade, JASO, tabelas por marca.",
    image: `${SITE_URL}/images/og-default.jpg`,
    author: { "@type": "Organization", name: "RT Brasil MOTOREX" },
    publisher: {
      "@type": "Organization",
      name: "RT Brasil MOTOREX",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo-motorex.png` },
    },
    datePublished: "2026-05-05",
    mainEntityOfPage: `${SITE_URL}/guia/qual-oleo-motocross-trilha-enduro`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guia", item: `${SITE_URL}/guia/qual-oleo-motocross-trilha-enduro` },
    ],
  };

  return (
    <div className="relative">
      <SEO
        title="Guia Definitivo: Qual Óleo Usar em Motocross e Trilha"
        description="Como escolher o óleo certo para sua moto off-road: 4T vs 2T, viscosidade, JASO MA2 e tabelas por marca (KTM, Honda, Yamaha, Husqvarna)."
        path="/guia/qual-oleo-motocross-trilha-enduro"
        type="article"
        jsonLd={[articleSchema, faqSchema, breadcrumb]}
      />
      <div aria-hidden className="ambient-canvas-page" />
      <div className="relative z-10">
        {/* Hero */}
        <section className="relative py-16 md:py-24 mesh-gradient">
          <div className="container relative z-10 max-w-4xl">
            <AnimateOnScroll animation="blur-in">
              <span className="font-heading uppercase text-motorex text-xs tracking-[0.3em]">
                Guia Técnico <span className="font-bold">MOTOREX</span>
              </span>
              <h1 className="font-heading text-[clamp(2rem,5.5vw,4rem)] font-bold mt-3 mb-5 leading-[0.95]">
                Qual <span className="text-motorex">Óleo</span> Usar em Motocross, Trilha e Enduro
              </h1>
              <div className="h-1 w-20 rounded-full bg-motorex mb-6" />
              <p className="text-foreground/85 text-base md:text-lg leading-relaxed max-w-2xl">
                A escolha do <span className="text-motorex font-semibold">lubrificante</span> é a decisão técnica que
                mais impacta a vida útil e a performance do seu motor. Este guia traz o que você precisa saber para
                acertar — direto da engenharia <span className="text-motorex font-bold">MOTOREX</span>, marca oficial
                dos campeonatos mundiais FIM.
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Index */}
        <section className="py-8 border-y border-motorex/20">
          <div className="container max-w-4xl">
            <p className="font-heading uppercase text-xs tracking-wider text-motorex mb-4">Neste guia</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {[
                ["#diferenca", "1. Diferença entre 4T e 2T"],
                ["#viscosidade", "2. Viscosidade SAE explicada"],
                ["#jaso", "3. Norma JASO e embreagem em banho de óleo"],
                ["#bases", "4. Mineral, semissintético e sintético"],
                ["#por-marca", "5. Tabela por marca de moto"],
                ["#troca", "6. Quando trocar o óleo"],
                ["#suspensao-corrente", "7. Suspensão, corrente e fluidos"],
                ["#faq", "8. Perguntas frequentes"],
              ].map(([h, t]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="flex items-center gap-2 py-2 text-foreground/85 hover:text-motorex transition-colors"
                  >
                    <ChevronRight size={14} className="text-motorex" />
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sections */}
        <article className="container max-w-3xl py-16 prose-content">
          <Section id="diferenca" icon={Droplet} title="1. Diferença entre motores 4T e 2T">
            <p>
              Motores <strong>4 tempos (4T)</strong> — como KTM SX-F, Honda CRF, Yamaha YZ-F, Kawasaki KX-F — têm cárter
              separado: o óleo fica em um reservatório e apenas lubrifica componentes (motor + embreagem + transmissão,
              normalmente em um único banho). Você troca o óleo periodicamente.
            </p>
            <p>
              Motores <strong>2 tempos (2T)</strong> — KTM SX, Yamaha YZ, GasGas MC — queimam o óleo junto com a mistura
              ar-combustível. O lubrificante precisa ter <em>baixa fumaça, baixa cinza e queima limpa</em> para não
              entupir a vela e o pistão. MOTOREX <strong>Cross Power 2T</strong> é o referencial mundial nesta categoria.
            </p>
            <p>
              Em 2T você não “troca” o óleo do motor: você mistura na proporção do fabricante (geralmente 1:50 a 1:40 para
              competição) e abastece o tanque. Mas ainda existe o <strong>óleo da caixa de marchas</strong> (gear oil),
              que é separado — para isso, use <strong>MOTOREX Gear Oil GP</strong> 75W ou 80W.
            </p>
          </Section>

          <Section id="viscosidade" icon={Gauge} title="2. Viscosidade SAE — o que significa 10W40, 10W50, 10W60">
            <p>
              SAE (Society of Automotive Engineers) define a fluidez do óleo. O número antes do <strong>W</strong>{" "}
              (Winter) mede o quão fluido o óleo continua a frio; o número depois mede a viscosidade na temperatura de
              operação (~100 °C).
            </p>
            <ul>
              <li>
                <strong>10W40</strong>: padrão para a maioria das motos 4T modernas em uso recreativo e competição leve.
              </li>
              <li>
                <strong>10W50 / 10W60</strong>: indicado por KTM, Husqvarna e Honda para motores 4T de competição
                operando em alta temperatura. <em>Padrão Red Bull KTM Factory.</em>
              </li>
              <li>
                <strong>15W50 / 15W60</strong>: clima muito quente, areia, enduro extremo, trilhas longas a baixa
                velocidade onde o motor superaquece.
              </li>
              <li>
                <strong>5W40</strong>: motos de estrada e adventure modernas, partidas a frio frequentes.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground italic">
              Sempre consulte o manual da sua moto. A viscosidade errada pode reduzir a vida útil do motor mesmo com um
              óleo de alta qualidade.
            </p>
          </Section>

          <Section id="jaso" icon={Shield} title="3. JASO MA2 e a embreagem em banho de óleo">
            <p>
              Quase toda moto off-road tem <strong>embreagem em banho de óleo</strong> — o mesmo óleo do motor lubrifica
              o disco da embreagem. Aí entra o problema: óleos automotivos modernos (API SP, dexos2, ILSAC GF-6) levam{" "}
              <strong>modificadores de fricção</strong> para reduzir consumo de combustível. Esses modificadores fazem a
              embreagem da moto patinar.
            </p>
            <p>
              A norma <strong>JASO MA / MA2</strong> garante o coeficiente de fricção correto. Todo óleo MOTOREX para
              moto carrega essa certificação. <strong>Nunca use óleo de carro</strong> em motor de moto com embreagem em
              banho de óleo — o dano à embreagem é rápido e irreversível.
            </p>
          </Section>

          <Section id="bases" icon={Zap} title="4. Mineral, semissintético ou sintético — qual escolher">
            <p>
              A <strong>base</strong> do óleo determina sua estabilidade térmica e vida útil:
            </p>
            <ul>
              <li>
                <strong>Mineral:</strong> destilado direto do petróleo. Barato, mas oxida rápido em alta temperatura.
                Indicado para amaciamento (run-in) ou motos antigas de baixa exigência.
              </li>
              <li>
                <strong>Semissintético:</strong> mistura mineral + sintético. Bom custo-benefício para uso recreativo
                moderado.
              </li>
              <li>
                <strong>100% sintético (PAO/Ester):</strong> moléculas projetadas em laboratório. Estabilidade térmica
                superior, proteção máxima em RPMs altos, intervalos de troca mais longos. Toda a linha{" "}
                <strong>MOTOREX Cross Power</strong> e <strong>Top Speed</strong> é sintética.
              </li>
            </ul>
          </Section>

          <Section id="por-marca" icon={Wrench} title="5. Tabela rápida por marca de moto">
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-foreground/10">
                    <th className="text-left py-2 px-3 font-heading uppercase text-xs">Marca / Modelo</th>
                    <th className="text-left py-2 px-3 font-heading uppercase text-xs">Tipo</th>
                    <th className="text-left py-2 px-3 font-heading uppercase text-xs">MOTOREX recomendado</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/80">
                  {[
                    ["KTM SX-F / Husqvarna FC 250-450", "4T competição", "Cross Power 4T 10W50 ou 10W60"],
                    ["KTM EXC-F / Husqvarna FE", "4T enduro", "Cross Power 4T 10W50"],
                    ["KTM SX / Husqvarna TC 2T", "2T competição", "Cross Power 2T (mistura) + Gear Oil GP 10W30"],
                    ["Honda CRF 250R / 450R", "4T competição", "Cross Power 4T 10W40 ou 10W50"],
                    ["Honda CRF 250F / 230F (trilha)", "4T trilha", "Top Speed 4T 10W40"],
                    ["Yamaha YZ250F / YZ450F", "4T competição", "Cross Power 4T 10W40"],
                    ["Yamaha YZ125 / YZ250 (2T)", "2T competição", "Cross Power 2T + Gear Oil GP"],
                    ["Yamaha WR250F / WR450F", "4T enduro", "Cross Power 4T 10W50"],
                    ["Kawasaki KX 250 / 450", "4T competição", "Cross Power 4T 10W50"],
                    ["GasGas MC / EX / EC", "4T e 2T", "Cross Power 4T ou Cross Power 2T (idêntico KTM)"],
                    ["Beta RR / X-Trainer", "4T e 2T enduro", "Cross Power 4T 10W50 / Cross Power 2T"],
                    ["Sherco SE / SEF", "4T e 2T enduro", "Cross Power 4T 10W50 / Cross Power 2T"],
                  ].map(([m, t, r]) => (
                    <tr key={m} className="border-b border-foreground/[0.06]">
                      <td className="py-2 px-3 text-foreground/90"><MX>{m}</MX></td>
                      <td className="py-2 px-3 text-foreground/70">{t}</td>
                      <td className="py-2 px-3 text-motorex font-semibold"><MX>{r}</MX></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-foreground/60 italic mt-3">
              Tabela orientativa. Confirme sempre a viscosidade no manual oficial da sua moto e ano de fabricação.
            </p>
          </Section>

          <Section id="troca" icon={Wrench} title="6. Quando trocar o óleo">
            <ul>
              <li>
                <strong>Motocross competitivo:</strong> a cada 5 a 10 horas de pista (algumas equipes trocam após cada
                fim de semana de prova).
              </li>
              <li>
                <strong>Trilha / enduro recreativo:</strong> a cada 15 a 20 horas, ou conforme manual.
              </li>
              <li>
                <strong>Filtro de óleo:</strong> sempre troque junto com o óleo. Filtro saturado neutraliza qualquer
                lubrificante de qualidade.
              </li>
              <li>
                <strong>Troca após lavagem agressiva:</strong> se entrou água no motor (rio, jato de pressão no
                respiro), troque imediatamente.
              </li>
            </ul>
          </Section>

          <Section id="suspensao-corrente" icon={Droplet} title="7. Suspensão, corrente e demais fluidos">
            <ul>
              <li>
                <strong>Óleo de suspensão (fork oil):</strong> MOTOREX Racing Fork Oil 2.5W, 4W, 5W, 7.5W, 10W —
                viscosidade conforme manual da suspensão (KYB, Showa, WP).
              </li>
              <li>
                <strong>Lubrificante de corrente:</strong> Chain Lube 622 Strong (off-road extremo) ou Chain Lube Road
                Strong (estrada/adventure).
              </li>
              <li>
                <strong>Fluido de freio:</strong> Brake Fluid DOT 5.1 — ponto de ebulição alto para uso intenso.
              </li>
              <li>
                <strong>Líquido de arrefecimento:</strong> Coolant M3.0 ou M5.0 (pré-misturado), reduz a temperatura do
                cabeçote em até 10 °C vs água+aditivo comum.
              </li>
              <li>
                <strong>Filtro de ar:</strong> Air Filter Oil — adesão superior em arena com pó fino.
              </li>
            </ul>
          </Section>

          <section id="faq" className="not-prose mt-16">
            <h2 className="font-heading uppercase text-2xl md:text-3xl font-bold mb-6">
              Perguntas <span className="text-motorex">frequentes</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group glass-card rounded-lg p-4 md:p-5 border border-foreground/[0.06] open:border-motorex/40 transition-colors"
                >
                  <summary className="cursor-pointer font-heading text-base md:text-lg font-semibold list-none flex items-center justify-between gap-4 text-foreground">
                    <span>{f.q}</span>
                    <ChevronRight
                      size={18}
                      className="text-motorex transition-transform group-open:rotate-90 flex-shrink-0"
                    />
                  </summary>
                  <p className="text-foreground/85 text-sm mt-3 leading-relaxed">
                    <MX>{f.a}</MX>
                  </p>
                </details>
              ))}
            </div>
          </section>

          <div className="not-prose mt-16 text-center glass-card rounded-lg p-8 border border-motorex/30">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">
              Pronto para escolher o <span className="text-motorex">óleo certo</span>?
            </h2>
            <p className="text-foreground/80 mb-6 max-w-md mx-auto">
              Veja a linha completa <span className="text-motorex font-bold">MOTOREX</span> disponível na distribuidora
              oficial RT Brasil.
            </p>
            <Button asChild size="lg" className="btn-clip">
              <Link to="/motorex">
                Ver catálogo MOTOREX <ChevronRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

const Section = ({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24 mt-12 first:mt-0">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon size={20} className="text-primary" />
      </div>
      <h2 className="font-heading text-xl md:text-2xl font-bold m-0">{title}</h2>
    </div>
    <div className="space-y-3 text-foreground/80 leading-relaxed [&_strong]:text-foreground [&_a]:text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
      {children}
    </div>
  </section>
);

export default Guia;
