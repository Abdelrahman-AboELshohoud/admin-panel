import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import Switch from "../../../components/common/form-elements/Switch";
import { useTranslation } from "react-i18next";
import { PaymentGatewayType } from "../../../graphql/requests";
import GatewayFields from "./GatewayFields";
import { PaymentGatewayForm } from "./Payment";

export default function AddGatewayDialog({
  createDialog,
  setCreateDialog,
  formData,
  setFormData,
  handleSubmit,
  resetForm,
}: {
  createDialog: { isOpen: boolean };
  setCreateDialog: (data: { isOpen: boolean }) => void;
  formData: PaymentGatewayForm;
  setFormData: (data: PaymentGatewayForm) => void;
  handleSubmit: () => void;
  resetForm: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={createDialog.isOpen}
      onOpenChange={(open) => setCreateDialog({ isOpen: open })}
    >
      <DialogContent className="card-shape max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-200">
            {t("payment.addGateway")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="space-y-2">
            <label className="text-gray-400 block">{t("payment.title")}</label>
            <Input
              value={formData.title}
              required
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 block">{t("payment.type")}</label>
            <Select
              value={formData.type}
              onValueChange={(value: PaymentGatewayType) =>
                setFormData({
                  ...formData,
                  type: value,
                })
              }
            >
              <SelectTrigger className="w-full custom-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PaymentGatewayType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <GatewayFields formData={formData} setFormData={setFormData} />

          <div className="flex items-center gap-2">
            <Switch
              disabled={false}
              checked={formData.enabled}
              onChange={(checked) =>
                setFormData({
                  ...formData,
                  enabled: checked,
                })
              }
            />
            <label className="text-gray-400">
              {t("payment.enableGateway")}
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              setCreateDialog({ isOpen: false });
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit}>{t("common.create")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
