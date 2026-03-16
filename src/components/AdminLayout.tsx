import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Package, Grid3X3, LogOut, Home, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Produtos", to: "/admin", icon: Package },
  { label: "Categorias", to: "/admin/categories", icon: Grid3X3 },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

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
          <p className="text-secondary-foreground text-lg mb-4">Acesso negado. Você não tem permissão de admin.</p>
          <Button variant="outline" onClick={signOut}>Sair</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary border-r border-secondary-foreground/10 flex flex-col">
        <div className="p-4 border-b border-secondary-foreground/10">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo-motorex.png" alt="MOTOREX" className="h-8 w-auto" />
          </Link>
          <p className="text-secondary-foreground/40 text-xs mt-1 font-heading uppercase tracking-wider">Painel Admin</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                location.pathname === item.to
                  ? "bg-primary/10 text-primary"
                  : "text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary-foreground/5"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-secondary-foreground/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary-foreground/5 transition-colors"
          >
            <Home size={18} />
            Ver site
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-secondary-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
