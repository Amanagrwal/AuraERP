import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
  Send,
  FileText,
  Calendar,
  Trash2
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { InvoiceDetailDialog } from '@/components/invoices/InvoiceDetailDialog';
import { Invoice } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteInvoice, fetchinvoice } from '@/components/Service/InvoiceApi';
import { mapInvoiceApiToInvoice } from '@/components/Helper/mapInvoiceApiToInvoice';
import { formatDate } from '@/components/Helper/formatDate';
import { getGrandTotal } from '@/components/Helper/GrandTotal';
import { amountInWords } from '@/components/Helper/AmountInWords';
import { getSalesMode } from '@/components/Helper/GetSalesMode';
import { mapApiProductToProduct } from '@/components/Mapper';
import { OrderStatus } from '@/components/Helper/orderstatus';
import Custom_Loader from '@/components/Helper/Loader';
import { toast } from '@/hooks/use-toast';

const statusStyles = {
  // draft: 'bg-muted text-muted-foreground border-muted',
  pending: 'bg-warning/10 text-warning border-warning/30',
  paid: 'bg-success/10 text-success border-success/30',
  // cancelled: 'bg-destructive/10 text-destructive border-destructive/30',
};

const statusLabels = {
  // draft: 'Draft',
  pending: 'Pending',
  paid: 'Paid',
  // cancelled: 'Cancelled',
};

export default function Invoices() {
  const { currentCompany } = useApp();
  const queryClient = useQueryClient();

  // const { data: invoices = [] } = useQuery({
  //   queryKey: ['invoice'],
  //   queryFn: fetchinvoice,
  // });

  const {
    data: invoices = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["invoice", currentCompany?.id],
    queryFn: () => fetchinvoice(currentCompany!.id),
    enabled: !!currentCompany?.id,
  });

  // console.log("invoices",invoices)
  // select: (res) => res.map(mapInvoiceApiToInvoice),
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [search, setSearch] = useState('');
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState();
  const navigate = useNavigate();

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice?.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
      invoice?.billing_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.payment_Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenView = (invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };


  const handleEditInvoice = (invoice, e) => {
    e.stopPropagation();
    navigate(`/invoices/${invoice.id}`);
  };


  const deleteMutation = useMutation({
    mutationFn: (invoiceId: number) =>
      deleteInvoice(invoiceId, currentCompany!.id),

    onSuccess: (data) => {
      toast({
        title: "Invoice Deleted ✅",
        description: data?.message || "Invoice deleted successfully",
      });

      setInvoiceToDelete(null); // ✅ close dialog AFTER success

      queryClient.invalidateQueries({
        queryKey: ["invoice", currentCompany?.id],
      });
    },

    onError: (error: any) => {
      toast({
        title: "Delete Failed ❌",
        description:
          error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });


  const handleDeleteInvoice = (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setInvoiceToDelete(invoice); // open dialog
  };



  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Invoices</h1>
          <p className="mt-0.5 sm:mt-1 text-sm text-muted-foreground">{invoices.length} invoices</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => navigate('/invoices/new')}>
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by invoice or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      {/* Mobile Cards */}

      <div className="grid gap-3 sm:hidden">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} className="overflow-hidden" onClick={() => handleOpenView(invoice)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-medium">{invoice.invoice_no}</p>
                    <p className="text-sm text-muted-foreground truncate">{invoice.billing_name}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">

                    <DropdownMenuItem onClick={() => handleOpenView(invoice)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={(e) => handleEditInvoice(invoice, e)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => handleDeleteInvoice(invoice, e)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenView(invoice)}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => handleOpenView(invoice)}>
                      <Send className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(invoice.date)}
                  </div>
                  {/* <Badge variant={invoice.salesMode === 'GST' ? 'default' : 'secondary'} className="text-xs">
                    {invoice.salesMode}
                  </Badge> */}
                </div>
                {/* <Badge variant="outline" className={cn(statusStyles[OrderStatus(invoice.order_status)], "text-xs")}>
                  {statusLabels[OrderStatus(invoice.order_status)]}
                </Badge> */}
              </div>
              <div className="mt-2 text-right">
                <span className="font-display text-lg font-bold">
                  {amountInWords(invoice?.net_amt)}
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
              <TableHead>Invoice</TableHead>
              <TableHead className="hidden md:table-cell">Client</TableHead>
              <TableHead>Date</TableHead>
              {/* <TableHead className="hidden lg:table-cell">Mode</TableHead> */}
              <TableHead className="text-center">Amount</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              isLoading ? (<Custom_Loader />) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="group cursor-pointer" onClick={() => handleOpenView(invoice)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-mono font-medium">{invoice.invoice_no}</span>
                          <p className="text-sm text-muted-foreground md:hidden truncate max-w-[100px]">{invoice.billing_name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="font-medium">{invoice.billing_name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(invoice.date)}
                      </div>
                    </TableCell>
                    {/* <TableCell className="hidden lg:table-cell">
                 <Badge variant={getSalesMode(invoice) === "GST" ? "default" : "secondary"}>
                    {getSalesMode(invoice)}
                         </Badge>

                </TableCell> */}
                    <TableCell className="text-right">
                      <span className="font-display text-base lg:text-lg font-bold">
                        <p>{amountInWords(invoice?.net_amt)}</p>

                      </span>
                    </TableCell>
                    {/* <TableCell>
                    <Badge variant="outline" className={cn(statusStyles[OrderStatus(invoice.order_status)])}>
                      {statusLabels[OrderStatus(invoice.order_status)]}
                    </Badge>
                </TableCell> */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenView(invoice)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          {/* {invoice.status === 'draft' && ( */}
                          <DropdownMenuItem onClick={(e) => handleEditInvoice(invoice, e)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={(e) => handleDeleteInvoice(invoice, e)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>


                          {/* )} */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenView(invoice)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenView(invoice)}>
                            <Send className="mr-2 h-4 w-4" />
                            Send via WhatsApp
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )
            }
          </TableBody>
        </Table>
      </div>

      {selectedInvoice && (
        <InvoiceDetailDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          invoice={selectedInvoice}
        />
      )}


      <AlertDialog
        open={!!invoiceToDelete}
        onOpenChange={(open) => !open && setInvoiceToDelete(null)}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Invoice
            </AlertDialogTitle>

            <AlertDialogDescription className="space-y-2">
              <p>You are about to permanently delete the following invoice:</p>

              <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                <p>
                  <span className="text-muted-foreground">Invoice No:</span>{" "}
                  <span className="font-medium">
                    {invoiceToDelete?.invoice_no}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">Client:</span>{" "}
                  <span className="font-medium">
                    {invoiceToDelete?.billing_name}
                  </span>
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                This action{" "}
                <span className="font-medium text-destructive">
                  cannot be undone
                </span>.
                All related invoice data will be permanently removed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 flex items-center gap-2"
              disabled={deleteMutation.isPending || !invoiceToDelete}
              onClick={() => {
                if (!invoiceToDelete) return;
                deleteMutation.mutate(invoiceToDelete.id);
              }}
            >
              {deleteMutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Invoice
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  );
}
