import { useState } from 'react';
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
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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

export function MobileSidebar() {
  const { currentFirm } = useApp();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-sidebar">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-sidebar-foreground">BillBook</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-sidebar-foreground">
              <X className="h-5 w-5" />
            </Button>
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
                onClick={() => setOpen(false)}
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
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Sign out
            </Button>
          </div>

          {/* Footer GSTIN */}
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-xl bg-sidebar-accent/50 p-3">
              <p className="text-xs font-medium text-sidebar-foreground/80">
                {currentFirm?.name}
              </p>
              {currentFirm?.gstin && (
                <p className="mt-1 font-mono text-[10px] text-sidebar-foreground/50">
                  GSTIN: {currentFirm.gstin}
                </p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
