import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AddAddress() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    city: "",
    placeName: "",
    street: "",
    houseNumber: "",
    lat: "",
    lon: "",
  });

  const [errors, setErrors] = useState({
    city: "",
    placeName: "",
    street: "",
    houseNumber: "",
    lat: "",
    lon: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors: typeof errors = {
      city: "",
      placeName: "",
      street: "",
      houseNumber: "",
      lat: "",
      lon: "",
    };
    if (!formData.city) newErrors.city = t("errors.cityRequired");
    if (!formData.placeName)
      newErrors.placeName = t("errors.placeNameRequired");
    if (!formData.street) newErrors.street = t("errors.streetRequired");
    if (!formData.houseNumber)
      newErrors.houseNumber = t("errors.houseNumberRequired");
    if (!formData.lat) {
      newErrors.lat = t("errors.latRequired");
    } else if (
      isNaN(parseFloat(formData.lat)) ||
      parseFloat(formData.lat) < -90 ||
      parseFloat(formData.lat) > 90
    ) {
      newErrors.lat = t("errors.latInvalid");
    }
    if (!formData.lon) {
      newErrors.lon = t("errors.lonRequired");
    } else if (
      isNaN(parseFloat(formData.lon)) ||
      parseFloat(formData.lon) < -180 ||
      parseFloat(formData.lon) > 180
    ) {
      newErrors.lon = t("errors.lonInvalid");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(t("formSubmitted"), formData);
      // Here you would typically send the data to your backend
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center p-4">
      <div className="w-full max-w-2xl card-shape rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          {t("addAddress")}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 grid-cols-2 md:grid-cols-4"
        >
          {[
            {
              label: t("fields.city"),
              id: "city",
              placeholder: t("placeholders.city"),
            },
            {
              label: t("fields.placeName"),
              id: "placeName",
              placeholder: t("placeholders.placeName"),
            },
            {
              label: t("fields.street"),
              id: "street",
              placeholder: t("placeholders.street"),
            },
            {
              label: t("fields.houseNumber"),
              id: "houseNumber",
              placeholder: t("placeholders.houseNumber"),
            },
            {
              label: t("fields.lat"),
              id: "lat",
              placeholder: t("placeholders.lat"),
            },
            {
              label: t("fields.lon"),
              id: "lon",
              placeholder: t("placeholders.lon"),
            },
          ].map(({ label, id, placeholder }) => (
            <div key={id} className="flex flex-col col-span-2">
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-300 mb-1 ml-2"
              >
                {label}
              </label>
              <input
                type="text"
                id={id}
                name={id}
                value={formData[id as keyof typeof formData]}
                onChange={handleChange}
                className="custom-input"
                placeholder={placeholder}
              />
              {errors[id as keyof typeof errors] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[id as keyof typeof errors]}
                </p>
              )}
            </div>
          ))}
          <div className="md:col-span-4 flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/80 focus:outline-none"
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

