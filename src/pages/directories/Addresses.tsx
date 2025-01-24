import { Button } from "../../components/ui/button";
import { Pencil, Plus, X } from "lucide-react";
import MyTable from "../../components/common/table-components/MyTable";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Address {
  id: string;
  name: string;
  address: string;
}

export default function Addresses() {
  const { t } = useTranslation();
  const addresses: Address[] = [
    { id: "1", name: "John Doe", address: "123 Main St" },
    { id: "2", name: "Jane Smith", address: "456 Elm St" },
  ];
  const navigate = useNavigate();

  const headers = [t("addresses.name"), t("addresses.address"), ""];

  const rows = addresses.map((address) => ({
    id: address.id,
    data: [
      address.name,
      address.address,
      <div key={address.id} className="flex gap-2 justify-end">
        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-3xl">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-white hover:text-black bg-red-500 hover:bg-red-600 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>,
    ],
  }));

  return (
    <div className="p-6 space-y-6 bg-background text-foreground">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t("addresses.title")}</h1>
        <Button
          variant="outline"
          onClick={() => {
            navigate("/control-panel/directories/add-address");
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("addresses.addAddress")}
        </Button>
      </div>

      <MyTable headers={headers} rows={rows} />
    </div>
  );
}
