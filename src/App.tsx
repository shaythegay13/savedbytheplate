
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Footer from "@/components/layout/Footer";

const LocalFood = lazy(() => import('./pages/LocalFood'));
const Map = lazy(() => import('./pages/Map'));
const GardenPlan = lazy(() => import('./pages/GardenPlan'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Education = lazy(() => import('./pages/Education'));
const Premium = lazy(() => import('./pages/Premium'));
const ForagingTest = lazy(() => import('./pages/ForagingTest'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Suspense fallback={null}>
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
            </Suspense>
            <Footer />
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
