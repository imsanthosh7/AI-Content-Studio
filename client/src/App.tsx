import React from "react";
import { Route } from "wouter"; // Only import Route
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Nav from "@/components/Nav";
import Home from "@/pages/home";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        {/* Routing */}
        <div className="">
          <Route path="/" component={LandingPage} />
          <Route path="/home" component={Home} />
          <Route path="/settings" component={NotFound} />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
