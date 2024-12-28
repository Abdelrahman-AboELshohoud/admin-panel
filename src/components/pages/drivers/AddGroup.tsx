import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { Input } from "../../ui/input";
import {
  CreateFleetGQL,
  CreateFleetMutationVariables,
} from "../../../graphql/requests";
import { toast } from "react-hot-toast";

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  address?: string;
  commissionSharePercent?: string;
  commissionShareFlat?: string;
  mobileNumber?: string;
  accountNumber?: string;
  userName?: string;
  password?: string;
}

const DriverForm: React.FC = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<CreateFleetMutationVariables>({
    input: {
      name: "",
      phoneNumber: "",
      address: "",
      commissionSharePercent: 0,
      commissionShareFlat: 0,
      exclusivityAreas: [],
      accountNumber: "",
      mobileNumber: "",
      password: "",
      userName: "",
    },
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.input.name) {
      newErrors.name = t("formErrors.nameRequired");
    }

    if (!formData.input.phoneNumber) {
      newErrors.phoneNumber = t("formErrors.phoneRequired");
    } else if (!/^\+?[\d\s-]+$/.test(formData.input.phoneNumber)) {
      newErrors.phoneNumber = t("formErrors.invalidPhone");
    }

    if (!formData.input.address) {
      newErrors.address = t("formErrors.addressRequired");
    }

    if (
      formData.input.commissionSharePercent < 0 ||
      formData.input.commissionSharePercent > 100
    ) {
      newErrors.commissionSharePercent = t(
        "formErrors.invalidCommissionPercent"
      );
    }

    if (formData.input.commissionShareFlat < 0) {
      newErrors.commissionShareFlat = t("formErrors.invalidCommissionFlat");
    }

    if (!formData.input.mobileNumber) {
      newErrors.mobileNumber = t("formErrors.mobileRequired");
    } else if (!/^\+?[\d\s-]+$/.test(formData.input.mobileNumber)) {
      newErrors.mobileNumber = t("formErrors.invalidMobile");
    }

    if (!formData.input.accountNumber) {
      newErrors.accountNumber = t("formErrors.accountRequired");
    }

    if (!formData.input.userName) {
      newErrors.userName = t("formErrors.usernameRequired");
    }

    if (!formData.input.password) {
      newErrors.password = t("formErrors.passwordRequired");
    } else if (formData.input.password.length < 8) {
      newErrors.password = t("formErrors.passwordTooShort");
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      toast.error(t("messages.formValidationError"));
    }
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      input: {
        ...prevData.input,
        [id]: value,
      },
    }));
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const numericValue = value.replace(/[^\d.]/g, "");
    setFormData((prevData) => ({
      ...prevData,
      input: {
        ...prevData.input,
        [id]: parseFloat(numericValue) || 0,
      },
    }));
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await CreateFleetGQL({
        input: formData.input,
      });
      if (response.statusCode === 200) {
        toast.success(t("messages.successCreatingFleet"));
        // Reset form
        setFormData({
          input: {
            name: "",
            phoneNumber: "",
            address: "",
            commissionSharePercent: 0,
            commissionShareFlat: 0,
            exclusivityAreas: [],
            accountNumber: "",
            mobileNumber: "",
            password: "",
            userName: "",
          },
        });
        return;
      }
      toast.error(t("messages.errorCreatingFleet"));
    } catch (error) {
      console.error("Error creating fleet:", error);
      toast.error(t("messages.errorCreatingFleet"));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-2xl text-white mb-4">{t("addGroup.title")}</h3>
      <Card className="w-1/2 bg-zinc-900 text-white card-shape border-none">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <FormField
              label={t("formFields.name")}
              id="name"
              value={formData.input.name}
              onChange={handleInputChange}
              placeholder=" John Smith"
              error={errors.name}
            />

            <FormField
              label={t("formFields.phoneNumber")}
              id="phoneNumber"
              value={formData.input.phoneNumber}
              onChange={handleInputChange}
              placeholder=" +1 234 567 8900"
              error={errors.phoneNumber}
            />

            <FormField
              label={t("formFields.address")}
              id="address"
              value={formData.input.address || ""}
              onChange={handleInputChange}
              placeholder=" 123 Main St, City, Country"
              error={errors.address}
            />

            <FormField
              label={t("formFields.commissionSharePercent")}
              id="commissionSharePercent"
              value={formData.input.commissionSharePercent.toString()}
              onChange={handleNumberChange}
              type="number"
              placeholder=" 15"
              error={errors.commissionSharePercent}
              suffix="%"
            />

            <FormField
              label={t("formFields.commissionShareFlat")}
              id="commissionShareFlat"
              value={formData.input.commissionShareFlat.toString()}
              onChange={handleNumberChange}
              type="number"
              placeholder=" 5.00"
              error={errors.commissionShareFlat}
            />

            <FormField
              label={t("formFields.mobileNumber")}
              id="mobileNumber"
              value={formData.input.mobileNumber}
              onChange={handleInputChange}
              type="number"
              placeholder=" +1 234 567 8900"
              error={errors.mobileNumber}
            />

            <FormField
              label={t("formFields.accountNumber")}
              id="accountNumber"
              value={formData.input.accountNumber}
              onChange={handleInputChange}
              placeholder=" 1234567890"
              type="number"
              error={errors.accountNumber}
            />

            <FormField
              label={t("formFields.userName")}
              id="userName"
              value={formData.input.userName}
              onChange={handleInputChange}
              placeholder=" johnsmith123"
              error={errors.userName}
            />

            <FormField
              label={t("formFields.password")}
              id="password"
              value={formData.input.password}
              onChange={handleInputChange}
              type="password"
              placeholder=" StrongP@ssw0rd"
              error={errors.password}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="ml-auto bg-[#B69C76] hover:bg-[#A38B65] text-gray-800"
            >
              {t("buttons.save")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  suffix?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  suffix,
}) => (
  <div className="space-y-2">
    <label htmlFor={id}>{label}</label>
    <div className="relative">
      <Input
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={`bg-zinc-800 border-zinc-700 ${
          error ? "border-red-500" : ""
        }`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {suffix}
        </span>
      )}
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default DriverForm;
