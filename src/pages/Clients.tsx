import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  User,
  Phone,
  FileText,
  Eye
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { ClientFormDialog, FormData } from '@/components/clients/ClientFormDialog';
import { Client } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { deleteClint, fetchClint } from '@/components/Service/ClintAPI';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from '@/hooks/use-toast';
import Custom_Loader from '@/components/Helper/Loader';

export default function Clients() {
  // const { clients, setClients } = useApp();
    const queryClient = useQueryClient();
  const { currentCompany } = useApp();

//  const {
//     data: clients = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["clint"],
//     queryFn: () => fetchClint(currentCompany!.id),

//   });
const {
  data: clients = [],
  isLoading,
  isError,
} = useQuery({
  queryKey: ["clients", currentCompany?.id], 
  queryFn: () => fetchClint(currentCompany!.id),
  enabled: !!currentCompany?.id, 
});




  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<FormData| null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');

  const filteredClients =  Array.isArray(clients) ? clients?.filter(client => 
    client?.party_name.toLowerCase().includes(search.toLowerCase()) ||
    client?.Mobile_no?.includes(search) ||
    (client?.gstin && client?.gstin.includes(search.toUpperCase()))
  ): [];

  const handleOpenCreate = () => {
    setSelectedClient(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleOpenEdit = (client: FormData) => {
    setSelectedClient(client);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleOpenView = (client: FormData) => {
    setSelectedClient(client);
    setDialogMode('view');
    setDialogOpen(true);
  };

  // const handleSave = (client: Client) => {
  //   if (dialogMode === 'create') {
  //     setClients([...clients, client]);
  //   } else {
  //     setClients(clients.map(c => c.id === client.id ? client : c));
  //   }
  // };

  const deleteMutation = useMutation({
    mutationFn: deleteClint,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete product";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

    const handleDelete = (productId: number) => {
          deleteMutation.mutate(productId);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Clients</h1>
          <p className="mt-0.5 sm:mt-1 text-sm text-muted-foreground">{clients?.length} clients</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
            New Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, mobile or GSTIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-3 sm:hidden">

        {
        filteredClients.map((client) => (
          <Card key={client.id} className="overflow-hidden" onClick={() => handleOpenView(client)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{client.party_name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {client.Mobile_no}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenView(client)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenEdit(client)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(client.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">{client.shipping_state?.state_name}</Badge>
                {client.gstin && (
                  <code className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono">
                    {client.gstin}
                  </code>
                )}
                <span className={cn(
                  "ml-auto font-display text-sm font-semibold",
                  client?.opening_balance > 0 ? "text-warning" : "text-foreground"
                )}>
                  ₹{client?.opening_balance?.toLocaleString('en-IN')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block rounded-xl border bg-card shadow-card animate-fade-in overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden lg:table-cell">GSTIN</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex items-center justify-center">
                      <Custom_Loader />
                    </div>
                  </TableCell>
                </TableRow>
              )}

   {!isLoading && filteredClients.length === 0 && (
    <TableRow>
      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
          No products found
      </TableCell>
    </TableRow>
  )}


            {
         !isLoading &&   
            filteredClients.map((client) => (
              <TableRow key={client?.id} className="group cursor-pointer" onClick={() => handleOpenView(client)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{client?.party_name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[150px] lg:max-w-[200px]">
                        {client?.billing_address}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    {client?.Mobile_no}
                  </div>
                  {client?.email && (
                    <p className="text-sm text-muted-foreground truncate max-w-[150px]">{client?.email}</p>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {client?.gstin ? (
                    <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                      {client?.gstin}
                    </code>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{client?.shipping_state?.state_name}</Badge>
                </TableCell>

                <TableCell className="text-right">
                  <span className={cn(
                    "font-display font-semibold",
                    client?.opening_balance > 0 ? "text-warning" : "text-foreground"
                  )}>
                    ₹{client?.opening_balance?.toLocaleString('en-IN')}
                  </span>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenView(client)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        View Invoices
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenEdit(client)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(client.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </div>

      <ClientFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={selectedClient}
        // onSave={handleSave}
        mode={dialogMode}
      />
    </div>
  );
}
