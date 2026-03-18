import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <section className="bg-secondary text-secondary-foreground min-h-[80vh] flex items-center justify-center">
      <div className="container text-center">
        <span className="font-heading text-[80px] md:text-[160px] font-bold text-gradient leading-none block">
          404
        </span>
        <h1 className="font-heading text-[28px] md:text-[36px] uppercase font-bold mt-4 mb-2">
          Página não encontrada
        </h1>
        <p className="text-secondary-foreground/60 mb-8 max-w-md mx-auto">
          A página que você procura não existe ou foi movida.
        </p>
        <Button asChild size="lg" className="font-heading uppercase tracking-wider hover-glow">
          <Link to="/">
            <ArrowLeft className="mr-2" size={18} /> Voltar ao início
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default NotFound;
