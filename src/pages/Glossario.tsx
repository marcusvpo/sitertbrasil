import SEO from "@/components/SEO";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { SITE_URL } from "@/lib/seo-config";
import { MX } from "@/lib/highlight-motorex";

const terms = [
  {
    term: "JASO MA / MA2",
    def: "Norma japonesa que classifica óleos para motores de moto com embreagem em banho de óleo. MA2 indica fricção mais alta, recomendada para motos de alta performance. Todo óleo MOTOREX para motor de moto possui certificação JASO MA2.",
  },
  {
    term: "API SP / SN / SL",
    def: "Classificação americana do American Petroleum Institute. Define o nível de proteção contra desgaste e oxidação. Em motos modernas, busque API SL ou SM (mais antigos, sem modificadores de fricção que comprometem a embreagem).",
  },
  {
    term: "Viscosidade SAE",
    def: "Sistema da Society of Automotive Engineers que mede a fluidez. Ex.: 10W40 — o 10W indica fluidez a frio (Winter), o 40 indica viscosidade na temperatura de operação (~100 °C). Maior número, mais espesso.",
  },
  {
    term: "Base sintética PAO",
    def: "Polialfaolefina — hidrocarboneto sintético produzido em laboratório a partir de gás natural. Excelente estabilidade térmica e baixa volatilidade. Base de óleos premium MOTOREX.",
  },
  {
    term: "Base Ester",
    def: "Ésteres sintéticos derivados de ácidos graxos. Forte aderência polar à superfície do metal — protege mesmo após o motor parar. Componente-chave da linha Cross Power.",
  },
  {
    term: "Óleo mineral",
    def: "Refinado diretamente do petróleo bruto. Custo baixo, mas oxida rápido em alta temperatura e tem vida útil curta. Indicado apenas para amaciamento ou motores antigos.",
  },
  {
    term: "Óleo semissintético",
    def: "Mistura de base mineral com base sintética (geralmente 30 % sintético). Custo-benefício para motos de uso recreativo moderado.",
  },
  {
    term: "ZDDP (Dialquilditiofosfato de Zinco)",
    def: "Aditivo antidesgaste que protege superfícies metálicas em condições de alta carga (came, balancim, engrenagens). Óleos automotivos modernos reduziram ZDDP por causa de catalisadores — óleos de moto MOTOREX mantêm níveis adequados.",
  },
  {
    term: "Ponto de fulgor (flash point)",
    def: "Temperatura mínima na qual os vapores do óleo se inflamam. Quanto mais alto, mais estável o óleo em altas temperaturas. Cross Power 4T 10W60 fica acima de 230 °C.",
  },
  {
    term: "TBN (Total Base Number)",
    def: "Mede a capacidade do óleo de neutralizar ácidos formados pela combustão. TBN alto = vida útil mais longa antes da troca.",
  },
  {
    term: "NLGI (graxa)",
    def: "Padrão de consistência de graxas do National Lubricating Grease Institute. Vai de 000 (líquida) a 6 (sólida). NLGI 2 é o padrão para rolamentos de roda e suspensão.",
  },
  {
    term: "DOT 4 / DOT 5.1",
    def: "Classificação de fluidos de freio (Department of Transportation). DOT 5.1 tem ponto de ebulição mais alto (270 °C seco), indicado para uso intenso. Não confunda com DOT 5 (silicone, incompatível).",
  },
  {
    term: "Coolant glicol",
    def: "Líquido de arrefecimento à base de etileno ou propileno glicol. Substitui água + aditivo comum. MOTOREX Coolant M3.0/M5.0 reduz temperatura do cabeçote em até 10 °C.",
  },
  {
    term: "Fork oil (óleo de suspensão)",
    def: "Óleo hidráulico calibrado para garfos invertidos e amortecedores. Viscosidade típica entre 2.5W e 10W. KYB, Showa e WP especificam viscosidades distintas — siga sempre o manual.",
  },
  {
    term: "Air filter oil",
    def: "Óleo aderente para filtros de ar de espuma. Captura partículas finas (areia, pó) que o filtro seco deixaria passar. Indispensável em motocross e enduro.",
  },
  {
    term: "Chain lube",
    def: "Lubrificante específico para corrente o-ring/x-ring. MOTOREX Chain Lube 622 Strong tem alta resistência à projeção (não voa) e protege contra água.",
  },
  {
    term: "Run-in (amaciamento)",
    def: "Período inicial de 5 a 10 horas após motor novo ou retífica. Use óleo mineral ou semissintético, evite RPM máximo, faça duas trocas curtas. Só depois entre na linha sintética.",
  },
];

const Glossario = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glossário Técnico de Lubrificantes para Motos",
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.def,
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Glossário", item: `${SITE_URL}/glossario` },
    ],
  };

  return (
    <div className="relative">
      <SEO
        title="Glossário Técnico de Óleos e Lubrificantes para Moto"
        description="JASO, API, SAE, ZDDP, Ester, DOT — o que cada termo técnico de lubrificação significa, explicado pela RT Brasil MOTOREX."
        path="/glossario"
        jsonLd={[schema, breadcrumb]}
      />
      <div aria-hidden className="ambient-canvas-page" />
      <div className="relative z-10">
        <section className="relative py-16 md:py-24 mesh-gradient">
          <div className="container relative z-10 text-center">
            <AnimateOnScroll animation="blur-in">
              <span className="font-heading uppercase text-motorex text-xs tracking-[0.3em]">Conhecimento</span>
              <h1 className="font-heading text-[clamp(2.25rem,5vw,4rem)] font-bold mt-3 mb-5 leading-[0.95]">
                Glossário <span className="text-motorex">Técnico</span>
              </h1>
              <p className="text-foreground/80 max-w-xl mx-auto">
                Os termos da engenharia de lubrificantes, explicados de forma direta. Da viscosidade SAE ao TBN —
                entenda o que está escrito no rótulo da sua{" "}
                <span className="text-motorex font-bold">MOTOREX</span>.
              </p>
              <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-motorex" />
            </AnimateOnScroll>
          </div>
        </section>

        <section className="container max-w-3xl py-12 md:py-16">
          <dl className="space-y-6">
            {terms.map((t) => (
              <div
                key={t.term}
                id={t.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                className="glass-card rounded-lg p-5 md:p-6 border border-foreground/[0.06] border-l-2 border-l-motorex/70 hover:border-l-motorex transition-colors scroll-mt-24"
              >
                <dt className="font-heading text-lg md:text-xl font-bold text-motorex mb-2">{t.term}</dt>
                <dd className="text-foreground/85 text-sm md:text-base leading-relaxed">
                  <MX>{t.def}</MX>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
};

export default Glossario;
