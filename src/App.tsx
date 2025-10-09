
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WaitingList from "./pages/WaitingList";
import Index from "./pages/Index";
import LocalFood from "./pages/LocalFood";
import Map from "./pages/Map";
import GardenPlan from "./pages/GardenPlan";
import Community from "./pages/Community";
import Education from "./pages/Education";
import Premium from "./pages/Premium";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ForumCategory from "./pages/ForumCategory";
import ForumDiscussion from "./pages/ForumDiscussion";
import NewDiscussion from "./pages/NewDiscussion";
import Auth from "./pages/Auth";
import Calendar from "./pages/Calendar";
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
              
              {/* Authentication page */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Calendar page */}
              <Route path="/calendar" element={<Calendar />} />
              
              {/* Waiting list page */}
              <Route path="/waiting-list" element={<WaitingList />} />
              
              {/* All other pages remain accessible for development */}
              <Route path="/index" element={<Index />} />
              <Route path="/local-food" element={<LocalFood />} />
              <Route path="/local-food/map" element={<Map />} />
              <Route path="/local-food/garden-planner" element={<GardenPlan />} />
              <Route path="/community" element={<Community />} />
              <Route path="/education" element={<Education />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              
              <Route path="/forum" element={<Navigate to="/community" replace />} />
              <Route path="/forum/category/:slug" element={<ForumCategory />} />
              <Route path="/forum/discussion/:id" element={<ForumDiscussion />} />
              <Route path="/forum/new" element={<NewDiscussion />} />
              
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
