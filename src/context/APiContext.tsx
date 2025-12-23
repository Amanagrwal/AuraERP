import {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanies } from "@/components/Service/companyApi";
import { Company } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface CompanyContextType {
  companies: Company[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
    const { auth, loading } = useAuth();
   const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
    enabled: !!auth && !loading,
});

  return (
    <CompanyContext.Provider
      value={{
        companies: data || [],
        isLoading,
        isError,
        refetch,
      }}
    >
      {children}
    </CompanyContext.Provider>
  ); 
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used inside CompanyProvider");
  }
  return context;
}
