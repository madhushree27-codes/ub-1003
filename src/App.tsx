import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import { IssueStoreProvider } from "@/lib/issueStore";
import Index from "./pages/Index";
import CitizenPortal from "./pages/CitizenPortal";
import AdminDashboard from "./pages/AdminDashboard";
import GovernanceDashboard from "./pages/GovernanceDashboard";
import PredictiveDashboard from "./pages/PredictiveDashboard";
import PublicPortal from "./pages/PublicPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <IssueStoreProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/citizen" element={<CitizenPortal />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/governance" element={<GovernanceDashboard />} />
              <Route path="/predictive" element={<PredictiveDashboard />} />
              <Route path="/public" element={<PublicPortal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </IssueStoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
