import { Construction } from "lucide-react";

const AdminPlaceholder = ({ title, phase }: { title: string; phase: string }) => (
  <div className="p-6 md:p-8">
    <div className="max-w-md mx-auto text-center mt-20 bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-lg p-10">
      <Construction size={40} className="mx-auto text-primary mb-4" />
      <h1 className="font-heading text-2xl uppercase text-secondary-foreground mb-2">{title}</h1>
      <p className="text-secondary-foreground/50 text-sm mb-1">Em construção</p>
      <p className="text-primary font-heading uppercase tracking-wider text-xs">{phase}</p>
    </div>
  </div>
);

export default AdminPlaceholder;
