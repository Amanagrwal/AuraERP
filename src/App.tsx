import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import InvoiceBuilder from "./pages/InvoiceBuilder";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Companies from "./pages/Companies";
import UserProfile from "./pages/UserProfile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";
import { CompanyProvider } from "./context/APiContext";
import { CompaniesLayout } from "./components/layout/CompaniesLayout";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { auth , loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!auth) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
  <Routes>
  <Route path="/auth" element={<Auth />} />

  {/* Companies – ALWAYS ACCESSIBLE */}
  <Route element={<ProtectedRoute><CompaniesLayout /></ProtectedRoute>}>
    <Route path="/companies" element={<Companies />} />
  </Route>

  {/* App – BLOCKED UNTIL COMPANY */}
  <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
    <Route index element={<Index />} />
    <Route path="products" element={<Products />} />
    <Route path="clients" element={<Clients />} />
    <Route path="invoices" element={<Invoices />} />
    <Route path="invoices/new" element={<InvoiceBuilder />} />
    <Route path="invoices/:id" element={<InvoiceBuilder />} />
    <Route path="reports" element={<Reports />} />
    <Route path="settings" element={<Settings />} />
    <Route path="profile" element={<UserProfile />} />
  </Route>
</Routes>

  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <CompanyProvider>
            <AppProvider>
            <Toaster />
              <Sonner />
              <AppRoutes />
          </AppProvider>
          </CompanyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
