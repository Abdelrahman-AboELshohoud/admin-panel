import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";

interface FormData {
  title: string;
  branch: string;
  profession: string;
  carClass: string;
  tariff: string;
  orderClass: string;
  priority: string;
}

const DriverForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    branch: "",
    profession: "",
    carClass: "",
    tariff: "business-lite",
    orderClass: "",
    priority: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSelectChange = (id: string) => (value: string) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">{t("addDriver.title")}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <FormField
              label={t("addDriver.form.title")}
              id="title"
              value={formData.title}
              onChange={handleInputChange}
            />

            <FormSelect
              label={t("addDriver.form.branch")}
              id="branch"
              value={formData.branch}
              onValueChange={handleSelectChange("branch")}
              options={[
                { value: "kazan", label: t("addDriver.options.kazan") },
              ]}
            />

            <FormSelect
              label={t("addDriver.form.profession")}
              id="profession"
              value={formData.profession}
              onValueChange={handleSelectChange("profession")}
              options={[
                {
                  value: "taxi-driver",
                  label: t("addDriver.options.taxiDriver"),
                },
              ]}
            />

            <FormSelect
              label={t("addDriver.form.carClass")}
              id="carClass"
              value={formData.carClass}
              onValueChange={handleSelectChange("carClass")}
              options={[
                { value: "business", label: t("addDriver.options.business") },
              ]}
            />

            <div className="space-y-2">
              <label>{t("addDriver.form.tariffs")}</label>
              <RadioGroup
                value={formData.tariff}
                onValueChange={handleSelectChange("tariff")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business-lite" id="business-lite" />
                  <label htmlFor="business-lite">
                    {t("addDriver.options.businessLite")}
                  </label>
                </div>
              </RadioGroup>
            </div>

            <FormSelect
              label={t("addDriver.form.orderClass")}
              id="orderClass"
              value={formData.orderClass}
              onValueChange={handleSelectChange("orderClass")}
              options={[
                { value: "business", label: t("addDriver.options.business") },
              ]}
            />

            <FormField
              label={t("addDriver.form.priority")}
              id="priority"
              value={formData.priority}
              onChange={handleInputChange}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-[#B69C76] hover:bg-[#A38B65] text-white"
            >
              {t("addDriver.save")}
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
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <label htmlFor={id}>{label}</label>
    <Input
      id={id}
      value={value}
      onChange={onChange}
      className="bg-zinc-800 border-zinc-700"
    />
  </div>
);

interface FormSelectProps {
  label: string;
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  id,
  value,
  onValueChange,
  options,
}) => (
  <div className="space-y-2">
    <label>{label}</label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-zinc-800 border-zinc-700">
        <SelectValue placeholder={`Select ${id}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default DriverForm;
