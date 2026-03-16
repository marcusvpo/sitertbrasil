import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Index from "./pages/Index";
import Motorex from "./pages/Motorex";
import ProductDetail from "./pages/ProductDetail";
import SejaRevendedor from "./pages/SejaRevendedor";
import QuemSomos from "./pages/QuemSomos";
import Parceiros from "./pages/Parceiros";
import IndiqueCidade from "./pages/IndiqueCidade";
import Depoimentos from "./pages/Depoimentos";
import CentralAtendimento from "./pages/CentralAtendimento";
import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/motorex" element={<Motorex />} />
              <Route path="/motorex/:slug" element={<ProductDetail />} />
              <Route path="/seja-revendedor" element={<SejaRevendedor />} />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/parceiros" element={<Parceiros />} />
              <Route path="/indique-cidade" element={<IndiqueCidade />} />
              <Route path="/depoimentos" element={<Depoimentos />} />
              <Route path="/central-atendimento" element={<CentralAtendimento />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products/:id" element={<AdminProductForm />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
