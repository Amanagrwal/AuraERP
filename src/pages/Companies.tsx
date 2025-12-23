import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Firm } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Company } from "@/types";

import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Building2,
  MapPin,
  Phone
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FirmFormDialog } from '@/components/firms/FirmFormDialog';
import { toast } from '@/hooks/use-toast';
import { useCompany } from '@/context/APiContext';
import { deleteCompany } from '@/components/Service/companyApi';
import { useQueryClient } from "@tanstack/react-query";
import Custom_Loader from '@/components/Helper/Loader';
import { useNavigation } from 'react-router-dom';

export default function Companies() {
  const { companies, isLoading, isError, } = useCompany();
  const { currentCompany, setCurrentCompany  } = useApp();
 console.log("companies",companies)
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('view');
  const [selectedFirm, setSelectedFirm] = useState<Company | null>(null);
  const queryClient = useQueryClient();


  const filteredFirms = (companies || []).filter((firm) => {
    const name = firm.company_name?.toLowerCase() || "";
    const gstin = firm.gstin || "";

    return (
      name.includes(search.toLowerCase()) ||
      gstin.includes(search.toUpperCase())
    );
  });


  const handleView = (firm: Company) => {
    setSelectedFirm(firm);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEdit = (firm: Company) => {
    setSelectedFirm(firm);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedFirm(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleDelete = async (firm: Company) => {
    if (firm.id === currentCompany?.id) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete the currently active company",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteCompany(firm.id);

      toast({
        title: "Company Deleted",
        description: `${firm.company_name} has been deleted`,
      });

      // 🔥 AUTO REFRESH LIST
      queryClient.invalidateQueries({ queryKey: ["companies"] });

    } catch (err) {
      toast({
        title: "Error",
        description: "Could not delete company",
        variant: "destructive",
      });
    }
  };

  const handleSetActive = (firm: Company) => {
    setCurrentCompany(firm);
    toast({ title: 'Firm Switched', description: `Now working with ${firm.company_name}` });
      
  };

  return (
    <>
    {/* {companies.length === 0 && (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <Building2 className="h-12 w-12 text-muted-foreground" />
    <h2 className="mt-4 text-xl font-semibold">
      Create your first company
    </h2>
    <p className="text-muted-foreground mt-1">
      You must create a company to continue
    </p>

    <Button className="mt-6" onClick={handleCreate}>
      <Plus /> Add Company
    </Button>
  </div>
)} */}

    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Companies</h1>
          <p className="mt-1 text-muted-foreground">{companies.length} companies registered</p>
        </div>
        <Button className="gap-2" onClick={handleCreate}>
          <Plus className="h-4 w-4" />
             Add Company
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or GSTIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card animate-fade-in" >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Company Type</TableHead>
              <TableHead>GSTIN</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >

            {
              isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    <Custom_Loader />
                  </TableCell>
                </TableRow>
              ):  filteredFirms.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No companies found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFirms.map((firm) => (
                  <TableRow key={firm.id} className="group" >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div> */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 overflow-hidden">
                          {firm.logo_1 ? (
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL}${firm.logo_1}`}
                              alt={firm.company_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-5 w-5 text-primary" />
                          )}
                        </div>

                        <div>
                          <p className="font-medium">{firm.company_name}</p>
                          {firm.phone && (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {firm.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        {/* <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> */}
                        {firm?.company_type?.company_type || "Not Available"}
                      </div>
                    </TableCell>


                    <TableCell>
                      {firm.gstin ? (
                        <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                          {firm.gstin}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {firm?.state?.state_code || "Not specified"} - {firm?.state?.state_name}
                      </div>
                    </TableCell>

                    <TableCell>
                      {firm.id === currentCompany?.id ? (
                        <Badge className="bg-success/10 text-success border-success/30">
                          Active
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetActive(firm)}
                          className="text-xs"
                        >
                          Set Active
                        </Button>
                      )}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(firm)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(firm)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(firm)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>

        </Table>
      </div>

      <FirmFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        firm={selectedFirm}
        mode={dialogMode}
      />


    </div>
    
    </>
  );
}
