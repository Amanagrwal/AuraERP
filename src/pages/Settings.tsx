import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  FileText, 
  Settings2, 
  Users, 
  Download,
  Upload
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  const { currentFirm } = useApp();

  const settingsSections = [
    {
      id: 'firm',
      title: 'Firm Profile',
      description: 'Business info',
      icon: Building2,
    },
    {
      id: 'invoice',
      title: 'Invoice Template',
      description: 'Design & format',
      icon: FileText,
    },
    {
      id: 'tax',
      title: 'GST / Tax',
      description: 'Tax settings',
      icon: Settings2,
    },
    {
      id: 'users',
      title: 'Team',
      description: 'User access',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-xl sm:text-2xl font-bold">Settings</h1>
        <p className="mt-0.5 sm:mt-1 text-sm text-muted-foreground">Manage firm and app settings</p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Settings Navigation */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-2 lg:col-span-1">
          {settingsSections.map((section, index) => (
            <button
              key={section.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 rounded-lg border bg-card p-3 sm:p-4 text-left transition-all hover:border-primary/50 hover:shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10">
                <section.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-medium">{section.title}</p>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{section.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Firm Profile */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="font-display text-lg sm:text-xl">Firm Profile</CardTitle>
              <CardDescription className="text-sm">Basic information about your business</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm">Firm Name</Label>
                  <Input defaultValue={currentFirm?.name} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">GSTIN</Label>
                  <Input defaultValue={currentFirm?.gstin} placeholder="22AAAAA0000A1Z5" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Address</Label>
                <Textarea defaultValue={currentFirm?.address} rows={3} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm">State</Label>
                  <Input defaultValue={currentFirm?.state} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Pincode</Label>
                  <Input placeholder="110001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-lg border-2 border-dashed">
                    <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="font-display text-lg sm:text-xl">Preferences</CardTitle>
              <CardDescription className="text-sm">Application settings</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base">Auto Print</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Print invoice after saving</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base">Low Stock Alert</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Notify when stock is low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base">Auto Backup</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Daily data backup</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Export */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="font-display text-lg sm:text-xl">Data Export</CardTitle>
              <CardDescription className="text-sm">Download data in CSV/Excel</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                <Button variant="outline" className="gap-2 text-sm justify-start">
                  <Download className="h-4 w-4" />
                  Products
                </Button>
                <Button variant="outline" className="gap-2 text-sm justify-start">
                  <Download className="h-4 w-4" />
                  Clients
                </Button>
                <Button variant="outline" className="gap-2 text-sm justify-start">
                  <Download className="h-4 w-4" />
                  Invoices
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex justify-end">
            <Button className="w-full sm:w-auto sm:px-8">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
