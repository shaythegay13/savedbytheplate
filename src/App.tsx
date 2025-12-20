
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LocalFood from "./pages/LocalFood";
import Map from "./pages/Map";
import GardenPlan from "./pages/GardenPlan";
import ComingSoon from "./pages/ComingSoon";
import Education from "./pages/Education";
import Premium from "./pages/Premium";
import ForagingTest from "./pages/ForagingTest";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Footer from "@/components/layout/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              {/* Main landing page */}
              <Route path="/" element={<Index />} />
              
              {/* Authentication page */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Profile page */}
              <Route path="/profile" element={<Profile />} />
              
              {/* All other pages */}
              <Route path="/index" element={<Index />} />
              <Route path="/local-food" element={<LocalFood />} />
              <Route path="/local-food/map" element={<Map />} />
              <Route path="/local-food/garden-planner" element={<GardenPlan />} />
              <Route path="/education" element={<Education />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              
              <Route path="/premium" element={<Premium />} />
              <Route path="/foraging-test" element={<ForagingTest />} />
              
              {/* 404 page for truly unknown routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
