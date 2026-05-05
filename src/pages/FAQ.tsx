import { ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { SITE_URL } from "@/lib/seo-config";
import { MX } from "@/lib/highlight-motorex";

const faqs = [
  {
    q: "A RT Brasil é distribuidora oficial MOTOREX no Brasil?",
    a: "Sim. A RT Brasil Import é a distribuidora oficial dos lubrificantes MOTOREX (Suíça) no Brasil, atendendo lojas, mecânicas, equipes e consumidores finais em todo o território nacional.",
  },
  {
    q: "Como me tornar revendedor MOTOREX?",
    a: "Acesse a página Seja Revendedor, preencha o formulário com os dados da sua loja/mecânica e nossa equipe comercial entrará em contato com a tabela de preços, condições e suporte.",
  },
  {
    q: "Vocês vendem para o consumidor final?",
    a: "Sim. Você pode comprar direto pelo nosso catálogo online. Para grandes quantidades ou parceria contínua, sugerimos se cadastrar como revendedor.",
  },
  {
    q: "Os produtos são originais e importados da Suíça?",
    a: "Todos os produtos são MOTOREX original, fabricados em Langenthal, Suíça, e importados pela RT Brasil com nota fiscal e procedência rastreável.",
  },
  {
    q: "Qual a forma de pagamento e entrega?",
    a: "Aceitamos cartão, Pix e boleto via checkout integrado. O frete é calculado automaticamente para todo o Brasil; revendedores cadastrados têm condições especiais.",
  },
  {
    q: "MOTOREX é o óleo oficial de quais equipes?",
    a: "MOTOREX é parceiro técnico oficial da Red Bull KTM Factory Racing no MXGP, MX2, AMA Supercross, Dakar e diversos campeonatos mundiais. No Brasil, abastece pilotos como Lorenzo Ricken, Otávio Oliveira, Rodrigo Galiotto e Marcelo Galiotto.",
  },
  {
    q: "Onde fica fisicamente a RT Brasil?",
    a: "Av. Alfeu Martini, 790 — Jaboticabal, SP. Atendimento comercial de segunda a sexta. Suporte via WhatsApp (16) 99796-4255 e e-mail vendas@rtbrasilimport.com.br.",
  },
  {
    q: "Como sei qual produto MOTOREX usar na minha moto?",
    a: "Consulte nosso Guia Definitivo e o Glossário Técnico, ou fale conosco pelo WhatsApp informando marca/modelo/ano da moto. Nossa equipe técnica indica o produto correto.",
  },
];

const FAQ = () => {
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
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq` },
    ],
  };

  return (
    <div className="relative">
      <SEO
        title="Perguntas Frequentes | RT Brasil MOTOREX"
        description="Tire suas dúvidas sobre revenda, produtos, entrega e suporte técnico MOTOREX no Brasil."
        path="/faq"
        jsonLd={[faqSchema, breadcrumb]}
      />
      <div aria-hidden className="ambient-canvas-page" />
      <div className="relative z-10">
        <section className="relative py-16 md:py-24 mesh-gradient">
          <div className="container relative z-10 text-center">
            <AnimateOnScroll animation="blur-in">
              <span className="font-heading uppercase text-motorex text-xs tracking-[0.3em]">Suporte</span>
              <h1 className="font-heading text-[clamp(2.25rem,5vw,4rem)] font-bold mt-3 mb-5 leading-[0.95]">
                Perguntas <span className="text-motorex">Frequentes</span>
              </h1>
              <p className="text-foreground/80 max-w-xl mx-auto">
                As dúvidas mais comuns sobre <span className="text-motorex font-semibold">RT Brasil</span>,{" "}
                <span className="text-motorex font-bold">MOTOREX</span> e nossos serviços.
              </p>
              <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-motorex" />
            </AnimateOnScroll>
          </div>
        </section>

        <section className="container max-w-3xl py-12 md:py-16">
          <div className="space-y-3">
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
                <p className="text-foreground/85 text-sm md:text-base mt-3 leading-relaxed">
                  <MX>{f.a}</MX>
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQ;
