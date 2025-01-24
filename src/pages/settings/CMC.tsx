import { useTranslation } from "react-i18next";
import { useState, useEffect, memo } from "react";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { MyDialog } from "../../components/common/dialogs/MyDialog";
import {
  SmsProvidersQuery,
  SmsProviderType,
  SmsProvidersGQL,
  CreateSmsProviderGQL,
  UpdateSmsProviderGQL,
  MarkSmsProviderAsDefaultGQL,
  ViewSmsProviderGQL,
} from "../../graphql/requests";

interface SMSProviderForm {
  name: string;
  type: SmsProviderType;
  accountId?: string;
  authToken?: string;
  fromNumber?: string;
  verificationTemplate?: string;
}

const initialFormState: SMSProviderForm = {
  name: "",
  type: SmsProviderType.Twilio,
  accountId: "",
  authToken: "",
  fromNumber: "",
  verificationTemplate: "",
};

interface EditDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingProvider: {
    id: string;
    data: SMSProviderForm;
  } | null;
  handleInputChange: (field: keyof SMSProviderForm, value: string) => void;
  handleUpdateProvider: () => Promise<void>;
  isSubmitting: boolean;
}

const EditDialog = memo(
  ({
    dialogOpen,
    setDialogOpen,
    editingProvider,
    handleInputChange,
    handleUpdateProvider,
    isSubmitting,
  }: EditDialogProps) => (
    <MyDialog
      title="Edit SMS Provider"
      isOpen={dialogOpen}
      showCloseButton={false}
      onOpenChange={setDialogOpen}
      className="sm:max-w-[600px]"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Provider Type</label>
          <Select
            value={editingProvider?.data.type}
            onValueChange={(value) => handleInputChange("type", value)}
          >
            <SelectTrigger className="custom-input">
              <SelectValue placeholder="Select provider type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SmsProviderType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={editingProvider?.data.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Account ID</label>
          <Input
            value={editingProvider?.data.accountId}
            onChange={(e) => handleInputChange("accountId", e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Auth Token</label>
          <Input
            type="password"
            value={editingProvider?.data.authToken}
            onChange={(e) => handleInputChange("authToken", e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">From Number</label>
          <Input
            value={editingProvider?.data.fromNumber}
            onChange={(e) => handleInputChange("fromNumber", e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium">Verification Template</label>
          <textarea
            value={editingProvider?.data.verificationTemplate}
            onChange={(e) =>
              handleInputChange("verificationTemplate", e.target.value)
            }
            className="w-full h-32 px-3 py-2 bg-[#141414] border-transparent text-gray-200 placeholder:text-gray-600 rounded-md resize-none"
          />
        </div>

        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            onClick={() => setDialogOpen(false)}
            className="px-4 py-2 text-sm bg-gray-700 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateProvider}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </MyDialog>
  )
);

export default function CMCSettings() {
  const { t } = useTranslation();
  const [providers, setProviders] = useState<
    SmsProvidersQuery["smsProviders"]["nodes"]
  >([]);
  const [formData, setFormData] = useState<SMSProviderForm>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(true);
  const [editingProvider, setEditingProvider] = useState<{
    id: string;
    data: SMSProviderForm;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await SmsProvidersGQL({ paging: { limit: 100 } });
      setProviders(response.data.smsProviders.nodes);
      setHasAccess(true);
    } catch (err) {
      setError("Failed to fetch SMS providers");
      console.error("Error fetching providers:", err);
      setHasAccess(false);
    }
  };

  const handleInputChange = (field: keyof SMSProviderForm, value: string) => {
    if (editingProvider) {
      setEditingProvider((prev) => ({
        ...prev!,
        data: {
          ...prev!.data,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await CreateSmsProviderGQL({
        input: formData,
      });
      await fetchProviders();
      setFormData(initialFormState);
    } catch (err) {
      setError("Failed to save SMS provider");
      console.error("Error saving provider:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProvider = async () => {
    if (!editingProvider) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await UpdateSmsProviderGQL({
        id: editingProvider.id,
        input: editingProvider.data,
      });
      await fetchProviders();
      setEditingProvider(null);
      setDialogOpen(false);
    } catch (err) {
      setError("Failed to update SMS provider");
      console.error("Error updating provider:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (providerId: string) => {
    try {
      await MarkSmsProviderAsDefaultGQL({ id: providerId });
      await fetchProviders();
    } catch (err) {
      setError("Failed to set default provider");
      console.error("Error setting default:", err);
    }
  };

  const handleEditProvider = async (providerId: string) => {
    try {
      const response = await ViewSmsProviderGQL({ id: providerId });
      const provider = response.data.smsProvider;
      setEditingProvider({
        id: providerId,
        data: {
          name: provider.name,
          type: provider.type,
          accountId: provider.accountId || "",
          authToken: provider.authToken || "",
          fromNumber: provider.fromNumber || "",
          verificationTemplate: provider.verificationTemplate || "",
        },
      });
      setDialogOpen(true);
    } catch (err) {
      setError("Failed to load provider details");
      console.error("Error loading provider:", err);
    }
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
    <div className="min-h-screen bg-background p-4 flex items-start">
      <Card className="w-1/2 card-shape text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t("cmc.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {t("cmc.providerType.label")}
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger className="custom-input">
                <SelectValue placeholder={t("cmc.providerType.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SmsProviderType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {t("cmc.name.label")}
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder={t("cmc.name.placeholder")}
              className="bg-[#141414] border-transparent text-gray-200 placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {t("cmc.accountId.label")}
            </label>
            <Input
              value={formData.accountId || ""}
              onChange={(e) => handleInputChange("accountId", e.target.value)}
              placeholder={t("cmc.accountId.placeholder")}
              className="bg-[#141414] border-transparent text-gray-200 placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {t("cmc.authToken.label")}
            </label>
            <Input
              type="password"
              value={formData.authToken || ""}
              onChange={(e) => handleInputChange("authToken", e.target.value)}
              placeholder={t("cmc.authToken.placeholder")}
              className="bg-[#141414] border-transparent text-gray-200 placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {t("cmc.fromNumber.label")}
            </label>
            <Input
              value={formData.fromNumber || ""}
              onChange={(e) => handleInputChange("fromNumber", e.target.value)}
              placeholder={t("cmc.fromNumber.placeholder")}
              className="bg-[#141414] border-transparent text-gray-200 placeholder:text-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {t("cmc.verificationTemplate.label")}
            </label>
            <textarea
              value={formData.verificationTemplate || ""}
              onChange={(e) =>
                handleInputChange("verificationTemplate", e.target.value)
              }
              placeholder={t("cmc.verificationTemplate.placeholder")}
              className="w-full h-32 px-3 py-2 bg-[#141414] border-transparent text-gray-200 placeholder:text-gray-600 rounded-md resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting
              ? t("cmc.status.adding")
              : t("cmc.buttons.addProvider")}
          </button>

          {providers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                {t("cmc.configuredProviders")}
              </h3>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-4 bg-[#202020] rounded-md"
                  >
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-sm text-gray-400">{provider.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProvider(provider.id)}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        {t("cmc.buttons.edit")}
                      </button>
                      {!provider.isDefault && (
                        <button
                          onClick={() => handleSetDefault(provider.id)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          {t("cmc.buttons.setDefault")}
                        </button>
                      )}
                      {provider.isDefault && (
                        <span className="px-3 py-1 text-sm bg-green-500 text-white rounded-md">
                          {t("cmc.buttons.default")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <EditDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        editingProvider={editingProvider}
        handleInputChange={handleInputChange}
        handleUpdateProvider={handleUpdateProvider}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
