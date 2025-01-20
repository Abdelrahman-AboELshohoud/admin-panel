import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MyDialog } from "../../components/common/dialogs/MyDialog";
import Switch from "../../components/common/form-elements/Switch";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { CreateOperatorGQL } from "../../graphql/requests";
import { toast } from "react-hot-toast";

export default function AddEmployee() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    phoneNumber: "",
    email: "",
    roleId: "",
    isActive: true,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await CreateOperatorGQL({
        input: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          userName: formData.userName,
          password: formData.password,
          mobileNumber: formData.phoneNumber,
          email: formData.email,
          roleId: formData.roleId,
        },
      });
      toast.success(t("employees.addSuccess"));
      navigate("/control-panel/directories/employees");
    } catch (error) {
      toast.error(t("employees.addError"));
      console.error(error);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-zinc-100">{t("employees.addNew")}</h1>
      </div>

      <div className="card-shape max-w-3xl">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input
            placeholder={t("employees.form.firstName")}
            className="custom-input"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
          <Input
            placeholder={t("employees.form.lastName")}
            className="custom-input"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input
            placeholder={t("employees.form.username")}
            className="custom-input"
            value={formData.userName}
            onChange={(e) => handleInputChange("userName", e.target.value)}
          />
          <Input
            type="password"
            placeholder={t("employees.form.password")}
            className="custom-input"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input
            placeholder={t("employees.form.phone")}
            className="custom-input"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
          <Input
            type="email"
            placeholder={t("employees.form.email")}
            className="custom-input"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Select
            value={formData.roleId}
            onValueChange={(value) => handleInputChange("roleId", value)}
          >
            <SelectTrigger className="custom-input">
              <SelectValue placeholder={t("employees.form.role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                {t("employees.roles.admin")}
              </SelectItem>
              <SelectItem value="operator">
                {t("employees.roles.operator")}
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <span className="text-zinc-100">{t("employees.form.active")}</span>
            <Switch
              checked={formData.isActive}
              disabled={false}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/control-panel/directories/employees")}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            {t("common.save")}
          </Button>
        </div>
      </div>

      <MyDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={t("employees.confirm.title")}
        description={t("employees.confirm.description")}
      >
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit}>{t("common.confirm")}</Button>
        </div>
      </MyDialog>
    </div>
  );
}
