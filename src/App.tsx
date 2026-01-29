import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PedidosProvider } from "@/context/PedidosContext";
import Dashboard from "./pages/Dashboard";
import PortalMedico from "./pages/PortalMedico";
import PortalFarmacia from "./pages/PortalFarmacia";
import PortalCFT from "./pages/PortalCFT";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PedidosProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medico" element={<PortalMedico />} />
            <Route path="/farmacia" element={<PortalFarmacia />} />
            <Route path="/cft" element={<PortalCFT />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PedidosProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
