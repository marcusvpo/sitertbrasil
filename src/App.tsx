import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Motorex from "./pages/Motorex";
import SejaRevendedor from "./pages/SejaRevendedor";
import QuemSomos from "./pages/QuemSomos";
import Parceiros from "./pages/Parceiros";
import IndiqueCidade from "./pages/IndiqueCidade";
import Depoimentos from "./pages/Depoimentos";
import CentralAtendimento from "./pages/CentralAtendimento";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/motorex" element={<Motorex />} />
            <Route path="/seja-revendedor" element={<SejaRevendedor />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/parceiros" element={<Parceiros />} />
            <Route path="/indique-cidade" element={<IndiqueCidade />} />
            <Route path="/depoimentos" element={<Depoimentos />} />
            <Route path="/central-atendimento" element={<CentralAtendimento />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
