import React, { createContext, useContext, useState, ReactNode } from "react";
import { ClientFormDialog, FormData } from "@/components/clients/ClientFormDialog";

type Mode = "create" | "edit" | "view";

interface ClientDialogContextType {
  openCreate: () => void;
  openEdit: (client: FormData) => void;
  openView: (client: FormData) => void;
}

const ClientDialogContext = createContext<ClientDialogContextType | undefined>(undefined);

export const ClientDialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<FormData| null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');

  const handleOpenCreate = () => {
    setSelectedClient(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleOpenEdit = (c: FormData) => {
    setSelectedClient(c);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleOpenView = (c: FormData) => {
    setSelectedClient(c);
     setDialogMode("view");
    setDialogOpen(true);
  };

  return (
    <ClientDialogContext.Provider value={{ dialogOpen , selectedClient , dialogMode , handleOpenCreate , handleOpenEdit , handleOpenView }}>
      {children}

      {/* <ClientFormDialog
        open={open}
        onOpenChange={setOpen}
        client={client}
        mode={mode}
      /> */}


    </ClientDialogContext.Provider>
  );
};

// Custom hook for using context
export const useClientDialog = () => {
  const context = useContext(ClientDialogContext);
  if (!context) throw new Error("useClientDialog must be used inside ClientDialogProvider");
  return context;
};
