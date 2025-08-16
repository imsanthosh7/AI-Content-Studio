import React from "react";
import { Route, Switch } from "wouter"; // Import Switch to handle routes correctly
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Import your components
import Home from "@/pages/home";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/not-found";
import ProtectedRoute from "@/components/ProtectedRoute";
 

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />

          {/* Routing with ProtectedRoute */}
          <Switch>
            <Route path="/" component={LandingPage} />
            {/* Use ProtectedRoute to protect the /home route */}
            <Route path="/home">
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </Route>
            <Route path="/settings" component={NotFound} />
            {/* Optional: Add a catch-all route for 404 pages */}
            <Route path="/:rest*" component={NotFound} />
          </Switch>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
