import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export function Layout() {
//   const { isCompanyRequired , companyReady } = useApp();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const isCompaniesPage = location.pathname.startsWith("/companies");
  
//   if (!companyReady) return null; 

// const shouldBlock =
//               isCompanyRequired && !isCompaniesPage;

  return (

    <div className="min-h-screen bg-background relative">
      
      <Sidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header />

        {/* MAIN CONTENT */}
        <main
          className={`flex-1 p-3 sm:p-4 lg:p-6 transition-all`}>
          <Outlet />
        </main>
      </div>

      {/* 🔥 OVERLAY (only when NOT on companies page) */}
     {/* {shouldBlock && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
    <div className="bg-background rounded-2xl shadow-xl p-6 max-w-sm w-full text-center space-y-4">
      <h2 className="text-lg font-semibold">Company Required</h2>
      <p className="text-sm text-muted-foreground">
        Please select or create a company to continue.
      </p>
      <Button onClick={() => navigate("/companies")} className="w-full">
        Go to Companies
      </Button>
    </div>
  </div>
)} */}

    </div>
  );
}
