import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";

export function CompanyRequiredGuard({ children }: { children: JSX.Element }) {
  const { isCompanyRequired } = useApp();

  if (isCompanyRequired) {
    return <Navigate to="/companies" replace />;
  }

  return children;
}
