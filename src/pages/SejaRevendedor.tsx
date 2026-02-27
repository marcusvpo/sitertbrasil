const SejaRevendedor = () => (
  <>
    <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
      <img src="/images/banner-revendedor.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-secondary/50" />
      <div className="container relative z-10 text-center text-secondary-foreground py-16">
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase font-bold leading-[0.95]">
          Seja um<br /><span className="text-primary">Revendedor</span>
        </h1>
        <p className="text-secondary-foreground/80 text-lg mt-4">Confira o catálogo completo</p>
      </div>
    </section>
    <section className="bg-secondary text-secondary-foreground py-20">
      <div className="container text-center">
        <p className="text-secondary-foreground/60">Em breve — Formulário de cadastro.</p>
      </div>
    </section>
  </>
);
export default SejaRevendedor;
