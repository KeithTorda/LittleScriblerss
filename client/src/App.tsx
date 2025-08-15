import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProgressProvider } from "@/hooks/use-progress";
import Header from "@/components/header";
import Home from "@/pages/home";
import Alphabets from "@/pages/alphabets";
import Numbers from "@/pages/numbers";
import Shapes from "@/pages/shapes";
import Animals from "@/pages/animals";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/alphabets" component={Alphabets} />
        <Route path="/numbers" component={Numbers} />
        <Route path="/shapes" component={Shapes} />
        <Route path="/animals" component={Animals} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProgressProvider>
          <Toaster />
          <Router />
        </ProgressProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
