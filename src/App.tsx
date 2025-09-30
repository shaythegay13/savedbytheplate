
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WaitingList from "./pages/WaitingList";
import Index from "./pages/Index";
import Map from "./pages/Map";
import GardenPlan from "./pages/GardenPlan";
import Community from "./pages/Community";
import Education from "./pages/Education";

import Premium from "./pages/Premium";
import NotFound from "./pages/NotFound";
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
              {/* Main landing page redirects to waiting list */}
              <Route path="/" element={<Navigate to="/waiting-list" replace />} />
              
              {/* Waiting list page */}
              <Route path="/waiting-list" element={<WaitingList />} />
              
              {/* All other pages remain accessible for development */}
              <Route path="/index" element={<Index />} />
              <Route path="/map" element={<Map />} />
              <Route path="/garden-plan" element={<GardenPlan />} />
              <Route path="/community" element={<Community />} />
              <Route path="/education" element={<Education />} />
              
              <Route path="/premium" element={<Premium />} />
              
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
