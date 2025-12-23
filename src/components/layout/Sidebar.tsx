import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Zap,
  Building2,
  UserCircle,
  LogOut
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/companies', icon: Building2, label: 'Companies' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
];

export function Sidebar() {
  const { currentCompany } = useApp();
  const { signOut } = useAuth();

  const logoUrl = currentCompany?.logo_1
  ? `${import.meta.env.VITE_API_BASE_URL}${currentCompany.logo_1}`
  : null;

  
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 bg-sidebar lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        {/* <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-sidebar-foreground">BillBook</span>
          </div>
        </div> */}

        {/* <div className="flex h-16 items-center border-b border-sidebar-border px-5">
  <div className="flex items-center gap-3">
    <img
      src={`${import.meta.env.VITE_API_BASE_UR}${currentCompany?.logo_1}`} 
      alt="Auratech"
      className="h-9 w-auto sm:h-10 md:h-11"
    />

    <span className="font-display text-lg font-bold text-sidebar-foreground sm:text-xl">
     {currentCompany?.company_name}
    </span>
  </div>
</div> */}
<div className="flex h-16 items-center border-b border-sidebar-border bg-background px-5">
 <div className="flex items-center gap-4">
  
  {/* Logo / Fallback */}
  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-border">
    {logoUrl ? (
      <img
        src={logoUrl}
        alt={currentCompany?.company_name || 'Company Logo'}
        className="max-h-10 max-w-10 object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    ) : (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <Building2 className="h-4 w-4 text-primary" />
      </div>
    )}
  </div>

  {/* Company name */}
  <div className="flex flex-col leading-tight">
    <span className="font-display text-sm font-medium sm:text-base">
      {currentCompany?.company_name}
    </span>
    <span className="text-[11px] text-muted-foreground">
      Business Dashboard
    </span>
  </div>

</div>

</div>






        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeClassName="bg-primary text-primary-foreground shadow-primary hover:bg-primary hover:text-primary-foreground"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </Button>
        </div>

        {/* Footer GSTIN */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-xl bg-sidebar-accent/50 p-3">
            <p className="text-xs font-medium text-sidebar-foreground/80">
              {currentCompany?.company_name}
            </p>
            {currentCompany?.gstin && (
              <p className="mt-1 font-mono text-[10px] text-sidebar-foreground/50">
                GSTIN: {currentCompany.gstin}
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
