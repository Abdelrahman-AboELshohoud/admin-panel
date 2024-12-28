import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rider, ViewRiderGQL, DeleteRiderGQL } from "../../graphql/requests";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useTranslation } from "react-i18next";
import ClientProfile from "./ClientProfile";
import ClientWallet from "./ClientWallet";
import ClientOrders from "./ClientOrders";
import { Button } from "../../components/ui/button";
import DeletionDialog from "../../components/common/DeletionDialog";

export default function Client() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [client, setClient] = useState<Rider | null>(null);
  const [formData, setFormData] = useState<Partial<Rider> | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(5);
  const [_isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      const response = await ViewRiderGQL({
        id: id!,
      });
      if (response.data.rider) {
        setClient(response.data.rider);
        setFormData(response.data.rider);
      }
    };
    fetchClient();
  }, [id]);

  useEffect(() => {
    let timer: any;
    if (showDeleteDialog && deleteCountdown > 0) {
      timer = setInterval(() => {
        setDeleteCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showDeleteDialog, deleteCountdown]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await DeleteRiderGQL({
        id: id!,
      });
      setShowDeleteDialog(false);
      navigate("/control-panel/clients/active");
    } catch (error) {
      console.error("Error deleting rider:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-semibold text-gray-400">
            {t("clients.noClient")}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {client.firstName} {client.lastName}
        </h2>
        <Button
          variant="destructive"
          onClick={() => {
            setShowDeleteDialog(true);
            setDeleteCountdown(5);
          }}
        >
          {t("common.delete")}
        </Button>
      </div>

      <DeletionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        countdownSeconds={5}
        onConfirm={handleDelete}
        title={t("clients.deleteConfirmation")}
        description={t("clients.deleteWarning")}
      />
      <Tabs defaultValue="profile">
        <TabsList className="bg-transparent">
          <TabsTrigger value="profile" className="custom-tabs ">
            {t("clients.profile")}
          </TabsTrigger>
          <TabsTrigger value="orders" className="custom-tabs ">
            {t("clients.orders")}
          </TabsTrigger>
          <TabsTrigger value="wallets" className="custom-tabs ">
            {t("clients.wallets")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ClientProfile
            client={client}
            formData={formData}
            setFormData={setFormData}
          />
        </TabsContent>
        <TabsContent value="orders">
          <ClientOrders riderId={client.id} />
        </TabsContent>
        <TabsContent value="wallets">
          <ClientWallet riderId={client.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
