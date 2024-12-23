import { createContext, useContext, useState } from "react";

export const AssetsContext = createContext<any>(null);

export const AssetsProvider = ({ children }: { children: React.ReactNode }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(false);
    console.log("openDialog", openDialog);
  };
  return (
    <AssetsContext.Provider value={{ openDialog, handleOpenDialog }}>
      {children}
    </AssetsContext.Provider>
  );
};

export const useAssets = () => {
  return useContext(AssetsContext);
};
