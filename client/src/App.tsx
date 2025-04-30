import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navbar";
import Home from "@/pages/home";
import History from "@/pages/history";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/30">
          <Navbar />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
            <div className="fade-in">
              <Router />
            </div>
          </main>
          <footer className="py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground border-t">
            <div className="max-w-7xl mx-auto">
              <p>© {new Date().getFullYear()} MediSearch Pharmacy System. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
