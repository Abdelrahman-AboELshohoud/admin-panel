import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  GetConfigurationGQL,
  CurrentConfigurationGQL,
  UpdatePurchaseCodeGQL,
  UpdateMapsApiKeyGQL,
  UpdateFirebaseGQL,
  DisableServerGQL,
  UpdateConfigStatus,
  UpdateConfigGQL,
  UsersListGQL,
} from "../../graphql/requests";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";

interface ConfigurationData {
  purchaseCode?: string | null;
  backendMapsAPIKey?: string | null;
  adminPanelAPIKey?: string | null;
  firebaseProjectPrivateKey?: string | null;
}

export default function Configuration() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [configData, setConfigData] = useState<ConfigurationData>({});
  const [formData, setFormData] = useState({
    purchaseCode: "",
    purchaseEmail: "",
    backendMapsKey: "",
    adminPanelMapsKey: "",
    firebaseKeyFile: "",
    serverIp: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<() => void>(() => {});
  const [timer, setTimer] = useState(5);
  const [hasAccess, setHasAccess] = useState(true);

  const fetchConfiguration = async () => {
    try {
      setIsLoading(true);
      const response = await CurrentConfigurationGQL({});
      const response2 = await GetConfigurationGQL({});
      const res3 = await UpdateConfigGQL({
        input: {
          backendMapsAPIKey: "123",
        },
      });
      const res4 = await UsersListGQL({});
      console.log(response);
      console.log(response2);
      console.log(res3);
      console.log(res4);
      if (response.data?.currentConfiguration) {
        setConfigData(response.data.currentConfiguration);
        setFormData((prev) => ({
          ...prev,
          purchaseCode: response.data.currentConfiguration.purchaseCode || "",
          backendMapsKey:
            response.data.currentConfiguration.backendMapsAPIKey || "",
          adminPanelMapsKey:
            response.data.currentConfiguration.adminPanelAPIKey || "",
          firebaseKeyFile:
            response.data.currentConfiguration.firebaseProjectPrivateKey || "",
        }));
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);
      toast.error(t("configuration.errors.fetchFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfiguration();
  }, []);

  const handleUpdatePurchaseCode = async () => {
    try {
      setIsLoading(true);
      const response = await UpdatePurchaseCodeGQL({
        code: formData.purchaseCode,
        email: formData.purchaseEmail || undefined,
      });

      if (response.data?.updatePurchaseCode.status === UpdateConfigStatus.Ok) {
        toast.success(t("configuration.success.purchaseCode"));
        fetchConfiguration();
        setDialogOpen(false);
      } else {
        toast.error(response.data?.updatePurchaseCode.message);
      }
    } catch (error) {
      console.error("Error updating purchase code:", error);
      toast.error(t("configuration.errors.purchaseCodeFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMapsApi = async () => {
    try {
      setIsLoading(true);
      const response = await UpdateMapsApiKeyGQL({
        backend: formData.backendMapsKey,
        adminPanel: formData.adminPanelMapsKey,
      });

      if (response.data?.updateMapsAPIKey.status === UpdateConfigStatus.Ok) {
        toast.success(t("configuration.success.mapsApi"));
        fetchConfiguration();
        setDialogOpen(false);
      } else {
        toast.error(response.data?.updateMapsAPIKey.message);
      }
    } catch (error) {
      console.error("Error updating maps API:", error);
      toast.error(t("configuration.errors.mapsApiFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFirebase = async () => {
    try {
      setIsLoading(true);
      const response = await UpdateFirebaseGQL({
        keyFileName: formData.firebaseKeyFile,
      });

      if (response.data?.updateFirebase.status === UpdateConfigStatus.Ok) {
        toast.success(t("configuration.success.firebase"));
        fetchConfiguration();
        setDialogOpen(false);
      } else {
        toast.error(response.data?.updateFirebase.message);
      }
    } catch (error) {
      console.error("Error updating Firebase:", error);
      toast.error(t("configuration.errors.firebaseFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableServer = async () => {
    try {
      setIsLoading(true);
      const response = await DisableServerGQL({
        ip: formData.serverIp,
      });

      if (
        response.data?.disablePreviousServer.status === UpdateConfigStatus.Ok
      ) {
        toast.success(t("configuration.success.serverDisabled"));
        setFormData((prev) => ({ ...prev, serverIp: "" }));
        setDialogOpen(false);
      } else {
        toast.error(response.data?.disablePreviousServer.message);
      }
    } catch (error) {
      console.error("Error disabling server:", error);
      toast.error(t("configuration.errors.serverDisableFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (action: () => void) => {
    setDialogAction(() => action);
    setDialogOpen(true);
    setTimer(5);
    const countdown = () => {
      setTimer((prev) => {
        if (prev <= 1) {
          return 0;
        }
        setTimeout(countdown, 1000);
        return prev - 1;
      });
    };
    setTimeout(countdown, 1000);
  };

  if (!hasAccess) {
    return (
      <div className="flex-1 p-6 flex flex-col h-[80vh] justify-center items-center">
        <div className="text-center text-zinc-100 text-4xl font-bold">
          {t("errors.noAccess")}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      <Card className="bg-gray-800 border-gray-700 w-1/2 card-shape">
        <CardHeader>
          <CardTitle className="text-3xl    text-gray-200">
            {t("configuration.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-200">
              {t("configuration.purchaseCode.title")}
            </h2>
            <div className="flex flex-col gap-2 mb-auto">
              <label className="text-gray-200">
                {t("configuration.purchaseCode.code")}
              </label>
              <Input
                type="password"
                placeholder={t("configuration.purchaseCode.code")}
                value={formData.purchaseCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    purchaseCode: e.target.value,
                  }))
                }
                className="bg-gray-700"
              />
              <label className="text-gray-200">
                {t("configuration.purchaseCode.email")}
              </label>
              <Input
                placeholder={t("configuration.purchaseCode.email")}
                value={formData.purchaseEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    purchaseEmail: e.target.value,
                  }))
                }
                className="bg-gray-700"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                className="w-fit ml-auto"
                onClick={() => openDialog(handleUpdatePurchaseCode)}
                disabled={isLoading || !formData.purchaseCode}
              >
                {t("common.update")}
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-200">
              {t("configuration.mapsApi.title")}
            </h2>
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <label className="text-gray-200">
                  {t("configuration.mapsApi.backend")}
                </label>
                <Input
                  type="password"
                  placeholder={t("configuration.mapsApi.backend")}
                  value={formData.backendMapsKey}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      backendMapsKey: e.target.value,
                    }))
                  }
                  className="bg-gray-700"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-200">
                  {t("configuration.mapsApi.adminPanel")}
                </label>
                <Input
                  type="password"
                  placeholder={t("configuration.mapsApi.adminPanel")}
                  value={formData.adminPanelMapsKey}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      adminPanelMapsKey: e.target.value,
                    }))
                  }
                  className="bg-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => openDialog(handleUpdateMapsApi)}
                disabled={
                  isLoading ||
                  !formData.backendMapsKey ||
                  !formData.adminPanelMapsKey
                }
              >
                {t("common.update")}
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-200">
              {t("configuration.firebase.title")}
            </h2>
            <div className="space-y-2">
              <label className="text-gray-200">
                {t("configuration.firebase.keyFile")}
              </label>
              <Input
                type="password"
                placeholder={t("configuration.firebase.keyFile")}
                value={formData.firebaseKeyFile}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firebaseKeyFile: e.target.value,
                  }))
                }
                className="bg-gray-700"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => openDialog(handleUpdateFirebase)}
                disabled={isLoading || !formData.firebaseKeyFile}
              >
                {t("common.update")}
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-200">
              {t("configuration.server.title")}
            </h2>
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => openDialog(handleDisableServer)}
                variant="destructive"
                className="w-fit ml-auto px-6"
              >
                {t("configuration.server.disable")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("common.confirmAction")}</DialogTitle>
          </DialogHeader>
          <div className=" text-black text-lg">
            {t("common.actionIn")}{" "}
            <span className="font-bold text-red-500">{timer}</span>{" "}
            {t("common.seconds")}
          </div>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={dialogAction}
              variant="default"
              disabled={timer > 0}
            >
              {t("common.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
