import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Package, Users, Bell, Search, Building2, ChevronDown, Check, PlusIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Navigate, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './MobileSidebar';
import { useCompany } from '@/context/APiContext';
import { getCompanyLogo } from '../Helper/getCompanyLogo';

export function Header() {
  const navigate = useNavigate();
  const { companies } = useCompany();
  const {
    // firms, currentFirm, setCurrentFirm 
    currentCompany, setCurrentCompany
  } = useApp();
  const [searchValue, setSearchValue] = useState('');

  const companyLogoUrl = getCompanyLogo(currentCompany?.logo_1)

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4 border-b border-border bg-background/95 px-3 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile Menu */}
      <MobileSidebar />

      {/* Search - Hidden on mobile, shown as icon */}
      <div className="hidden sm:block relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products, clients, invoices..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-10 pl-9 bg-muted/50 border-transparent rounded-xl focus:border-primary focus:bg-background transition-all"
        />
      </div>

      {/* Mobile Search Button */}
      <Button variant="ghost" size="icon" className="sm:hidden">
        <Search className="h-5 w-5" />
      </Button>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Firm Switcher */}
        <DropdownMenu>
         <DropdownMenuTrigger asChild>
  <Button
    variant="outline"
    className="gap-1 sm:gap-2 rounded-xl h-9 sm:h-10 border-border/50 hover:border-primary/50 hover:bg-primary/5 px-2 sm:px-3"
  >
    {/* Logo / Icon */}
    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white ring-1 ring-border">
      {companyLogoUrl ? (
        <img
          src={companyLogoUrl}
          alt={currentCompany?.company_name || 'Company Logo'}
          className="max-h-5 max-w-5 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <Building2 className="h-4 w-4 text-primary" />
      )}
    </div>

    {/* Company name */}
    <span className="hidden sm:inline max-w-[120px] lg:max-w-[160px] truncate font-medium">
      {currentCompany?.company_name}
    </span>

    <ChevronDown className="h-4 w-4 text-muted-foreground" />
  </Button>
</DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 bg-popover rounded-xl shadow-lg border border-border/50 p-0"
          >
            {/* Header */}
            <div className="px-3 py-2 border-b">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Switch Firm
              </p>
            </div>

            {/* Firm List */}
          <div className="max-h-64 overflow-y-auto">
  {companies.length > 0 &&
    companies.map((firm) => {
      const logoUrl = getCompanyLogo(firm.logo_1);

      return (
        <DropdownMenuItem
          key={firm.id}
          onClick={() => setCurrentCompany(firm)}
          className={cn(
            "cursor-pointer flex items-center gap-3 py-3 px-3 rounded-none",
            currentCompany?.id === firm.id && "bg-primary/10"
          )}
        >
          {/* Logo / Fallback */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-border">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={firm.company_name}
                className="max-h-6 max-w-6 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Building2 className="h-4 w-4 text-primary" />
            )}
          </div>

          {/* Company info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {firm.company_name}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground truncate">
              {firm.gstin || 'GSTIN not available'}
            </p>
          </div>

          {/* Active check */}
          {currentCompany?.id === firm.id && (
            <Check className="h-4 w-4 text-primary shrink-0" />
          )}
        </DropdownMenuItem>
      );
    })}
</div>

          <DropdownMenuSeparator />
            {/* Footer Action */}
            <div className="border-t p-2">
              <Button
                onClick={() => navigate("/companies")}
                className="w-full "
              >
                <Plus /> Add New Company
              </Button>
            </div>

          </DropdownMenuContent>

        </DropdownMenu>

        {/* Create New */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-1 sm:gap-2 rounded-xl h-9 sm:h-10 shadow-primary px-2 sm:px-3">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover rounded-xl shadow-lg border border-border/50">
            <DropdownMenuItem onClick={() => navigate('/invoices/new')} className="cursor-pointer py-2.5 rounded-lg mx-1 my-0.5">
              <FileText className="mr-3 h-4 w-4 text-primary" />
              New Invoice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/products')} className="cursor-pointer py-2.5 rounded-lg mx-1 my-0.5">
              <Package className="mr-3 h-4 w-4 text-accent" />
              New Product
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/clients')} className="cursor-pointer py-2.5 rounded-lg mx-1 my-0.5">
              <Users className="mr-3 h-4 w-4 text-success" />
              New Client
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-destructive text-[9px] sm:text-[10px] font-bold text-destructive-foreground shadow-sm">
            3
          </span>
        </Button>
      </div>
    </header>
  );
}
