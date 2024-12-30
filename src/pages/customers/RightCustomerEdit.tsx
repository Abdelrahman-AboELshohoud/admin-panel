import { Textarea } from "../../components/ui/textarea";

import { useTranslation } from "react-i18next";
import { type Service as ServiceType } from "../../graphql/requests";
import { Input } from "../../components/ui/input";

import { FaImage, FaTimes, FaUpload } from "react-icons/fa";

interface RightCustomerEditProps {
  editing: boolean;
  service: ServiceType;
  setService: (service: ServiceType) => void;
}

export default function RightCustomerEdit({
  editing,
  service,
  setService,
}: RightCustomerEditProps) {
  const { t } = useTranslation();

  const handleInputChange = (key: keyof ServiceType, value: any) => {
    setService({
      ...service,
      [key]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange("media", { address: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    handleInputChange("media", null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <label className="text-lg font-medium">
          {t("rightCustomerEdit.media")}
        </label>
        <div className="relative flex justify-end">
          {service.media ? (
            <div className="relative">
              <img
                src={service?.media?.address || "/placeholder-image.jpg"}
                alt={service.name}
                className="w-64 h-64 object-cover rounded-xl shadow-lg"
              />
              {editing && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-3 -right-3 bg-red-500 rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                >
                  <FaTimes className="text-white w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="w-64 h-64 bg-[#242424] rounded-xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-600">
              <FaImage className="w-16 h-16 text-gray-500" />
              <span className="text-gray-500 text-sm">No image uploaded</span>
            </div>
          )}
        </div>
        {editing && (
          <div className="relative  flex justify-end">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden "
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#242424] hover:bg-[#2a2a2a] transition-colors duration-200 rounded-xl w-64 cursor-pointer border border-gray-700 text-gray-100"
            >
              <FaUpload className="w-4 h-4" />
              <span>Upload Image</span>
            </label>
          </div>
        )}
      </div>

      <div>
        <label className="block mb-2">
          {t("rightCustomerEdit.description")}
        </label>
        <Textarea
          value={service.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          readOnly={!editing}
          className="h-32 border-transparent resize-none bg-[#242424] text-gray-100"
        />
      </div>

      <div className="flex flex-row justify-between">
        <label className="flex items-center w-1/3">
          {t("rightCustomerEdit.searchRadius")}
        </label>
        <Input
          type="number"
          value={service.searchRadius || 0}
          onChange={(e) =>
            handleInputChange("searchRadius", Number(e.target.value))
          }
          readOnly={!editing}
          className="px-4 w-1/2 rounded-full custom-input text-gray-100"
        />
      </div>

      <div className="flex flex-row justify-between">
        <label className="flex items-center w-1/3">
          {t("rightCustomerEdit.maximumDistance")}
        </label>
        <Input
          type="number"
          value={service.maximumDestinationDistance || 0}
          onChange={(e) =>
            handleInputChange(
              "maximumDestinationDistance",
              Number(e.target.value)
            )
          }
          readOnly={!editing}
          className="px-4 w-1/2 rounded-full custom-input text-gray-100"
        />
      </div>

      <div className="flex flex-row justify-between">
        <label className="flex items-center">
          {t("rightCustomerEdit.providerShareFlat")}
        </label>
        <Input
          type="number"
          value={service.providerShareFlat || 0}
          onChange={(e) =>
            handleInputChange("providerShareFlat", Number(e.target.value))
          }
          readOnly={!editing}
          className="px-4 w-1/2 rounded-full custom-input text-gray-100"
        />
      </div>

      <div className="flex flex-row justify-between">
        <label className="flex items-center w-1/3">
          {t("rightCustomerEdit.providerSharePercent")}
        </label>
        <Input
          type="number"
          value={service.providerSharePercent || 0}
          onChange={(e) =>
            handleInputChange("providerSharePercent", Number(e.target.value))
          }
          readOnly={!editing}
          className="px-4 w-1/2 rounded-full custom-input text-gray-100"
        />
      </div>

      <div className="flex flex-row justify-between">
        <label className="flex items-center w-1/3">
          {t("rightCustomerEdit.prepayPercent")}
        </label>
        <Input
          type="number"
          value={service.prepayPercent || 0}
          onChange={(e) =>
            handleInputChange("prepayPercent", Number(e.target.value))
          }
          readOnly={!editing}
          className="px-4 w-1/2 rounded-full custom-input text-gray-100"
        />
      </div>
    </div>
  );
}
