import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { CreateRiderGQL, Gender, Rider } from "../../../graphql/requests";
import { useNavigate } from "react-router-dom";
import SelectsWithLabel from "../../../components/common/form-elements/SelectsWithLabel";
import { useTranslation } from "react-i18next";

import Switch from "../../../components/common/form-elements/Switch";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
}

export default function AddClient() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [gender, setGender] = useState<Gender>(Gender.Male);
  const [formData, setFormData] = useState<Partial<Rider> | null>({
    gender: gender,
  });

  const validateForm = () => {
    const newErrors: FormErrors = {};

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    value?: string
  ) => {
    setFormData((prev) => {
      if (!prev) {
        return { [e.target.name]: value };
      }
      return {
        ...prev,
        [e.target.name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await CreateRiderGQL({
        input: {
          firstName: formData?.firstName || "",
          lastName: formData?.lastName || "",
          mobileNumber: formData?.mobileNumber || "",
          email: formData?.email || "",
          idNumber: formData?.idNumber || "",
          gender: gender,
          isResident: formData?.isResident || false,
        },
      });
      if (res.data) {
        navigate("/control-panel/clients/active");
      }
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto text-gray-100 card-shape">
      <div>
        <h3 className="text-lg font-medium">{t("clients.add.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("clients.add.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("clients.add.form.firstName.label")}
          </label>
          <Input
            name="firstName"
            placeholder={t("clients.add.form.firstName.placeholder")}
            value={formData?.firstName || ""}
            onChange={(e) => handleChange(e, e.target.value)}
          />
          {errors.firstName && (
            <span className="text-sm text-red-500">{errors.firstName}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("clients.add.form.lastName.label")}
          </label>
          <Input
            name="lastName"
            placeholder={t("clients.add.form.lastName.placeholder")}
            value={formData?.lastName || ""}
            onChange={(e) => handleChange(e, e.target.value)}
          />
          {errors.lastName && (
            <span className="text-sm text-red-500">{errors.lastName}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("clients.add.form.mobileNumber.label")}
          </label>
          <Input
            name="mobileNumber"
            placeholder={t("clients.add.form.mobileNumber.placeholder")}
            value={formData?.mobileNumber || ""}
            onChange={(e) => handleChange(e, e.target.value)}
          />
          {errors.mobileNumber && (
            <span className="text-sm text-red-500">{errors.mobileNumber}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("clients.add.form.email.label")}
          </label>
          <Input
            name="email"
            type="email"
            placeholder={t("clients.add.form.email.placeholder")}
            value={formData?.email || ""}
            onChange={(e) => handleChange(e, e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("clients.add.form.idNumber.label")}
          </label>
          <Input
            name="idNumber"
            placeholder={t("clients.add.form.idNumber.placeholder")}
            value={formData?.idNumber || ""}
            onChange={(e) => handleChange(e, e.target.value)}
          />
        </div>

        <div>
          <SelectsWithLabel
            options={[Gender.Male, Gender.Female, Gender.Unknown]}
            placeholder={t("clients.add.form.gender.label")}
            isEditing={true}
            label={t("clients.add.form.gender.label")}
            value={gender}
            onChange={(e) => setGender(e as Gender)}
          />
        </div>

        <div className="flex items-center w-full gap-4">
          <label className="text-lg font-medium">
            {t("clients.add.form.isResident.label")}
          </label>
          <Switch
            disabled={false}
            checked={formData?.isResident || false}
            onChange={(e) => handleChange(e, e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">{t("clients.add.form.submit")}</Button>
        </div>
      </form>
    </div>
  );
}
