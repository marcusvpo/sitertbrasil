import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Index from "./pages/Index";

// Lazy-loaded routes for code splitting
const Motorex = lazy(() => import("./pages/Motorex"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const SejaRevendedor = lazy(() => import("./pages/SejaRevendedor"));
const QuemSomos = lazy(() => import("./pages/QuemSomos"));
const Parceiros = lazy(() => import("./pages/Parceiros"));
const HeitorMatos = lazy(() => import("./pages/parceiros/HeitorMatos"));
const LorenzoRicken = lazy(() => import("./pages/parceiros/LorenzoRicken"));
const RodrigoGaliotto = lazy(() => import("./pages/parceiros/RodrigoGaliotto"));
const MarceloGaliotto = lazy(() => import("./pages/parceiros/MarceloGaliotto"));
const OtavioOliveira = lazy(() => import("./pages/parceiros/OtavioOliveira"));

const Depoimentos = lazy(() => import("./pages/Depoimentos"));
const Blog = lazy(() => import("./pages/Blog"));
const CentralAtendimento = lazy(() => import("./pages/CentralAtendimento"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductForm = lazy(() => import("./pages/admin/AdminProductForm"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminVitrine = lazy(() => import("./pages/admin/AdminVitrine"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminBlogForm = lazy(() => import("./pages/admin/AdminBlogForm"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartDrawer />
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/motorex" element={<Motorex />} />
              <Route path="/motorex/:slug" element={<ProductDetail />} />
              <Route path="/seja-revendedor" element={<SejaRevendedor />} />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/parceiros" element={<Parceiros />} />
              <Route path="/parceiros/heitor-matos" element={<HeitorMatos />} />
              <Route path="/parceiros/lorenzo-ricken" element={<LorenzoRicken />} />
              <Route path="/parceiros/rodrigo-galiotto" element={<RodrigoGaliotto />} />
              <Route path="/parceiros/marcelo-galiotto" element={<MarceloGaliotto />} />
              <Route path="/parceiros/otavio-oliveira" element={<OtavioOliveira />} />
              
              <Route path="/depoimentos" element={<Depoimentos />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/central-atendimento" element={<CentralAtendimento />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products/:id" element={<AdminProductForm />} />
              <Route path="/admin/vitrine" element={<AdminVitrine />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/blog/new" element={<AdminBlogForm />} />
              <Route path="/admin/blog/:id" element={<AdminBlogForm />} />
              <Route path="/admin/leads" element={<AdminLeads />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
