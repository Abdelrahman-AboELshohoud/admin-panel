import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Switch from "../../components/common/form-elements/Switch";
import { MyDialog } from "../../components/common/dialogs/MyDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  UpdateOperatorGQL,
  ViewOperatorGQL,
  RolesGQL,
  type OperatorRole,
} from "../../graphql/requests";
import { toast } from "react-hot-toast";

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  roleId: string;
  isActive: boolean;
  role?: {
    id: string;
    title: string;
  };
}

export default function Employee() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roles, setRoles] = useState<OperatorRole[]>([]);
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    roleId: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [operatorResponse, rolesResponse] = await Promise.all([
          ViewOperatorGQL({ id: id! }),
          RolesGQL({}),
        ]);
        console.log(operatorResponse);

        if (rolesResponse.data?.operatorRoles) {
          setRoles(rolesResponse.data.operatorRoles);
        }

        if (operatorResponse.data?.operator) {
          const operator = operatorResponse.data.operator;
          const operatorRole = rolesResponse.data?.operatorRoles.find(
            (role: OperatorRole) => role.id === operator.role?.id
          );
          setFormData({
            firstName: operator.firstName,
            lastName: operator.lastName,
            email: operator.email,
            mobileNumber: operator.mobileNumber,
            roleId: operator.role?.id,
            role: operatorRole,
            isActive: operator.status === "ACTIVE",
          });
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error(t("employees.errors.fetchFailed"));
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleUpdate = async () => {
    console.log(formData);
    try {
      const res = await UpdateOperatorGQL({
        id: id!,
        update: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          roleId: formData.roleId,
        },
      });
      console.log(res);
      toast.success(t("employees.success.updated"));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error(t("employees.errors.updateFailed"));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container w-1/2 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("employees.details")}</h2>
      </div>

      <div className="card-shape">
        <div className="space-y-8 p-6">
          <div className="grid gap-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t("employees.firstName")}
                </label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="custom-input mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t("employees.lastName")}
                </label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="custom-input mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("employees.email")}
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className="custom-input mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("employees.phone")}
              </label>
              <Input
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className="custom-input mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("employees.role")}
              </label>
              <Select
                disabled={!isEditing}
                value={formData.roleId}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    roleId: value,
                    role: roles.find((role) => role.id === value),
                  }))
                }
              >
                <SelectTrigger className="custom-input mt-1">
                  <SelectValue
                    placeholder={
                      formData.role?.title || t("employees.selectRole")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {t("employees.status")}
              </label>
              <Switch
                checked={formData.isActive}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            {isEditing ? (
              <Button onClick={handleUpdate}>{t("common.save")}</Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                {t("common.edit")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <MyDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={t("employees.resetPassword.title")}
        description={t("employees.resetPassword.description")}
      >
        <div className="space-y-4">
          <Input
            type="password"
            placeholder={t("employees.resetPassword.newPassword")}
            className="custom-input"
          />
          <Input
            type="password"
            placeholder={t("employees.resetPassword.confirmPassword")}
            className="custom-input"
          />
        </div>
      </MyDialog>
    </div>
  );
}
