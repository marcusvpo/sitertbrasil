import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Search, FileText, BookOpen, Image as ImageIcon,
  Users, Filter, Mail, Briefcase, Package, Grid3X3, BarChart3,
  Activity, ShoppingCart, Gauge, LogOut, Home, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PeriodProvider, usePeriod, PeriodPreset } from "@/contexts/PeriodContext";

type Item = { label: string; to: string; icon: any };
type Group = { title: string; items: Item[] };

const groups: Group[] = [
  {
    title: "Dashboard",
    items: [{ label: "Visão Geral", to: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Marketing & SEO",
    items: [
      { label: "SEO Center", to: "/admin/seo", icon: Search },
      { label: "Blog", to: "/admin/blog", icon: FileText },
      { label: "Vitrine", to: "/admin/vitrine", icon: Star },
    ],
  },
  {
    title: "Leads & Funil",
    items: [
      { label: "Leads (CRM)", to: "/admin/leads", icon: Users },
      { label: "Funil", to: "/admin/funil", icon: Filter },
    ],
  },
  {
    title: "Produtos",
    items: [
      { label: "Catálogo", to: "/admin/produtos", icon: Package },
      { label: "Categorias", to: "/admin/categories", icon: Grid3X3 },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Tempo Real", to: "/admin/realtime", icon: Activity },
      { label: "Tráfego (GA4)", to: "/admin/trafego", icon: BarChart3 },
      { label: "E-commerce", to: "/admin/ecommerce", icon: ShoppingCart },
    ],
  },
];

const PeriodSelector = () => {
  const { preset, setPreset, label } = usePeriod();
  const opts: { v: PeriodPreset; l: string }[] = [
    { v: "7d", l: "7d" },
    { v: "30d", l: "30d" },
    { v: "90d", l: "90d" },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="text-secondary-foreground/40 text-xs font-heading uppercase tracking-wider hidden md:inline">
        Período: {label}
      </span>
      <div className="flex bg-secondary-foreground/5 border border-secondary-foreground/10 rounded-md p-0.5">
        {opts.map((o) => (
          <button
            key={o.v}
            onClick={() => setPreset(o.v)}
            className={cn(
              "px-3 py-1 text-xs font-heading uppercase tracking-wider rounded transition-colors",
              preset === o.v
                ? "bg-primary text-primary-foreground"
                : "text-secondary-foreground/60 hover:text-secondary-foreground"
            )}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
};

const Inner = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-secondary flex">
      <aside className="w-64 bg-secondary border-r border-secondary-foreground/10 flex flex-col">
        <div className="p-4 border-b border-secondary-foreground/10">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo-motorex.png" alt="MOTOREX" className="h-8 w-auto" />
          </Link>
          <p className="text-secondary-foreground/40 text-xs mt-1 font-heading uppercase tracking-wider">
            Painel Admin
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="px-3 mb-1 text-[10px] font-heading uppercase tracking-wider text-secondary-foreground/30">
                {g.title}
              </p>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const active =
                    location.pathname === item.to ||
                    (item.to !== "/admin" && location.pathname.startsWith(item.to));
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary-foreground/5"
                      )}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-secondary-foreground/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary-foreground/5 transition-colors"
          >
            <Home size={16} />
            Ver site
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-secondary-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-secondary-foreground/10 px-6 flex items-center justify-between bg-secondary/95 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2 text-secondary-foreground/40 text-xs font-heading uppercase tracking-wider">
            <Gauge size={14} /> Plataforma de Gestão
          </div>
          <PeriodSelector />
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-secondary-foreground/50">Carregando...</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-foreground text-lg mb-4">
            Acesso negado. Você não tem permissão de admin.
          </p>
          <Button variant="outline" onClick={signOut}>Sair</Button>
        </div>
      </div>
    );
  }
  return (
    <PeriodProvider>
      <Inner />
    </PeriodProvider>
  );
};

export default AdminLayout;
