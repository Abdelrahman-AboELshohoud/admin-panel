import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLoadScript } from "@react-google-maps/api";
import { MyDialog } from "../../../components/common/dialogs/MyDialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Switch from "../../../components/common/form-elements/Switch";
import MapComponent from "../../../components/regions/MapComponent";

export interface Point {
  lat: number;
  lng: number;
}

export interface RegionForm {
  name: string;
  currency: string;
  enabled: boolean;
  points: Point[];
}

interface AddRegionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: any;
}

const defaultRegion: RegionForm = {
  name: "",
  currency: "USD",
  enabled: true,
  points: [],
};

export default function AddRegionDialog({
  isOpen,
  onClose,
  onSave,
}: AddRegionDialogProps) {
  const { t } = useTranslation();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing", "geometry"],
  });

  const [formData, setFormData] = useState<RegionForm>(defaultRegion);
  const [isEditing, setIsEditing] = useState(true);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng || !isEditing) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setFormData((prev) => ({
        ...prev,
        points: [...prev.points, { lat, lng }],
      }));
    },
    [isEditing]
  );

  const handlePolygonChange = useCallback((newPoints: Point[]) => {
    setFormData((prev) => ({
      ...prev,
      points: newPoints,
    }));
  }, []);

  const clearPolygon = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      points: [],
    }));
  }, []);

  const handleSubmit = async () => {
    if (formData.points.length < 3) {
      alert(t("common.polygonError")); // Replace with a toast or localized alert
      return;
    }
    await onSave(formData);
    setFormData(defaultRegion);
    onClose();
  };

  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <MyDialog
      title={t("regions.add")}
      isOpen={isOpen}
      onOpenChange={onClose}
      showCloseButton={false}
      className="max-w-4xl"
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? t("common.stopEditing") : t("common.startEditing")}
            </Button>
            <Button variant="destructive" onClick={clearPolygon}>
              {t("common.clear")}
            </Button>
          </div>

          <div className="h-[500px]">
            <MapComponent
              points={formData.points}
              isEditing={isEditing}
              onPolygonChange={handlePolygonChange}
              onClick={handleMapClick}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t("regions.name")}
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t("regions.currency")}
            </label>
            <Input
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-400">
              {t("regions.enabled")}
            </label>
            <Switch
              disabled={false}
              checked={formData.enabled}
              onChange={(checked) =>
                setFormData({ ...formData, enabled: checked })
              }
            />
          </div>

          <div className="flex justify-end gap-2 mt-auto pt-6">
            <Button variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSubmit}>{t("common.save")}</Button>
          </div>
        </div>
      </div>
    </MyDialog>
  );
}
