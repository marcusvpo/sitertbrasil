const Motorex = () => (
  <>
    <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
      <img src="/images/banner-motorex.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-secondary/50" />
      <div className="container relative z-10 text-center text-secondary-foreground py-16">
        <img src="/images/logo-motorex.png" alt="MOTOREX" className="h-12 md:h-16 mx-auto mb-4" />
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase font-bold">Distribuidor Oficial</h1>
        <p className="text-secondary-foreground/80 text-lg mt-3">Óleos | Lubrificantes | Aditivos</p>
      </div>
    </section>
    <section className="bg-secondary text-secondary-foreground py-20">
      <div className="container text-center">
        <p className="text-secondary-foreground/60">Em breve — Vitrine completa de produtos.</p>
      </div>
    </section>
  </>
);
export default Motorex;
