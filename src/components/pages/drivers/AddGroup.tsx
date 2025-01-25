import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { Input } from "../../ui/input";
import { useLoadScript } from "@react-google-maps/api";
import MapComponent from "../../regions/MapComponent";
import {
  CreateFleetGQL,
  CreateFleetMutationVariables,
} from "../../../graphql/requests";
import { toast } from "react-hot-toast";

interface Point {
  lat: number;
  lng: number;
}

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
  const [isEditing, setIsEditing] = useState(true);
  const [points, setPoints] = useState<Point[]>([]);

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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing", "geometry"],
  });

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng || !isEditing) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      console.log("Map clicked at:", { lat, lng });
      setPoints((prev) => [...prev, { lat, lng }]);
    },
    [isEditing]
  );

  const handlePolygonChange = useCallback((newPoints: Point[]) => {
    console.log("Polygon points updated:", newPoints);
    setPoints(newPoints);
  }, []);

  const clearPolygon = useCallback(() => {
    console.log("Clearing polygon points");
    setPoints([]);
  }, []);

  const validateForm = (): boolean => {
    console.log("Validating form data:", formData);
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
    } else if (!/^\d+$/.test(formData.input.accountNumber)) {
      newErrors.accountNumber = t("formErrors.invalidAccountNumber");
    }

    if (!formData.input.userName) {
      newErrors.userName = t("formErrors.usernameRequired");
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.input.userName)) {
      newErrors.userName = t("formErrors.invalidUsername");
    }

    if (!formData.input.password) {
      newErrors.password = t("formErrors.passwordRequired");
    } else if (formData.input.password.length < 8) {
      newErrors.password = t("formErrors.passwordTooShort");
    }

    console.log("Form validation errors:", newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      toast.error(t("messages.formValidationError"));
    }
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log("Input changed:", { id, value });
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
    console.log("Number input changed:", { id, value, numericValue });
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
    console.log("Form submission started");

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    if (points.length < 3) {
      console.log("Invalid area: not enough points", points);
      toast.error(t("messages.invalidArea"));
      return;
    }

    // Ensure polygon is closed
    let areaPoints = [...points];
    if (
      points.length >= 3 &&
      (points[0].lat !== points[points.length - 1].lat ||
        points[0].lng !== points[points.length - 1].lng)
    ) {
      console.log("Closing polygon by adding first point to end");
      areaPoints.push(points[0]);
    }

    try {
      // Generate unique identifiers using timestamp and random string
      const timestamp = new Date().getTime();
      const randomStr = Math.random().toString(36).substring(7);

      console.log("Submitting fleet data with unique identifiers:", {
        timestamp,
        randomStr,
      });

      const response = await CreateFleetGQL({
        input: {
          ...formData.input,
          userName: `${formData.input.userName}_${timestamp}`,
          accountNumber: `${formData.input.accountNumber}_${randomStr}`,
          exclusivityAreas: [areaPoints],
        },
      });

      console.log("CreateFleetGQL response:", response);

      if (response.data?.createFleet) {
        console.log("Fleet created successfully");
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
        setPoints([]);
        return;
      }
      console.log("Fleet creation failed without error");
      toast.error(t("messages.errorCreatingFleet"));
    } catch (error: any) {
      console.error("Error creating fleet:", error);
      if (error.message?.includes("ER_DUP_ENTRY")) {
        console.log("Duplicate entry error detected");
        toast.error(t("messages.duplicateEntry"));
      } else {
        console.log("Generic error occurred");
        toast.error(t("messages.errorCreatingFleet"));
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-2xl text-white mb-4">{t("addGroup.title")}</h3>
      <Card className="w-full bg-zinc-900 text-white card-shape border-none">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Map Section */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                    >
                      {isEditing
                        ? t("common.stopEditing")
                        : t("common.startEditing")}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={clearPolygon}
                    >
                      {t("common.clear")}
                    </Button>
                  </div>

                  <div className="h-[400px] bg-zinc-800 rounded-lg overflow-hidden">
                    {isLoaded && (
                      <MapComponent
                        points={points}
                        isEditing={isEditing}
                        onPolygonChange={handlePolygonChange}
                        onClick={handleMapClick}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Existing Form Fields */}
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
              </div>
            </div>
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
