
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import IdeasPage from "./pages/IdeasPage";
import IdeaDetailPage from "./pages/IdeaDetailPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InvestorsPage from "./pages/InvestorsPage";
import PostIdeaPage from "./pages/PostIdeaPage";
import IdeaGeneratorPage from "./pages/IdeaGeneratorPage";
import MessagesPage from "./pages/MessagesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/idea/:id" element={<IdeaDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/investors" element={<InvestorsPage />} />
          <Route path="/post-idea" element={<PostIdeaPage />} />
          <Route path="/idea-generator" element={<IdeaGeneratorPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
