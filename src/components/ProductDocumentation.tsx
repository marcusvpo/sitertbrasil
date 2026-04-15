import { FileText, Shield } from "lucide-react";
import { findProductDocs } from "@/data/product-docs";

interface ProductDocumentationProps {
  productName: string;
}

const ProductDocumentation = ({ productName }: ProductDocumentationProps) => {
  const docs = findProductDocs(productName);

  if (!docs) return null;

  const hasAnyDoc = docs.msds || docs.techInfo;
  if (!hasAnyDoc) return null;

  return (
    <div className="gradient-border rounded-lg p-4 sm:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <FileText size={20} className="text-motorex" />
        <h3 className="font-heading text-lg font-bold uppercase tracking-wider">
          Documentação Oficial
        </h3>
      </div>
      <p className="text-muted-foreground text-sm">
        Acesse as fichas técnicas e de segurança oficiais da <span className="text-motorex font-semibold">MOTOREX</span> para este produto.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {docs.msds && (
          <a
            href={docs.msds}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border border-motorex/20 bg-motorex/5 px-4 py-3 text-sm font-heading uppercase tracking-wider text-motorex transition-colors hover:bg-motorex/15"
          >
            <Shield size={16} />
            FISPQ / MSDS
          </a>
        )}
        {docs.techInfo && (
          <a
            href={docs.techInfo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border border-motorex/20 bg-motorex/5 px-4 py-3 text-sm font-heading uppercase tracking-wider text-motorex transition-colors hover:bg-motorex/15"
          >
            <FileText size={16} />
            Ficha Técnica
          </a>
        )}
      </div>
    </div>
  );
};

export default ProductDocumentation;
