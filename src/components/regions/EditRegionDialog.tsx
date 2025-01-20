import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLoadScript } from "@react-google-maps/api";
import { MyDialog } from "../common/dialogs/MyDialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Switch from "../common/form-elements/Switch";
import MapComponent from "./MapComponent";

export interface Point {
  lat: number;
  lng: number;
}

export interface Region {
  name: string;
  currency: string;
  enabled: boolean;
  location: Point[][];
}
interface EditRegionDialogProps {
  region: Region | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (region: Region) => Promise<void>;
}

export default function EditRegionDialog({
  region,
  isOpen,
  onClose,
  onSave,
}: EditRegionDialogProps) {
  const { t } = useTranslation();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing", "geometry"],
  });

  const [formData, setFormData] = useState<Region | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (region) {
      setFormData(region);
      if (region.location?.[0]) {
        setPoints(region.location[0]);
      }
    }
  }, [region]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng || !isEditing) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newPoint: Point = { lat, lng };

      setPoints((prev) => [...prev, newPoint]);
    },
    [isEditing]
  );

  const handlePolygonChange = useCallback((newPoints: Point[]) => {
    setPoints(newPoints);
  }, []);

  const clearPolygon = useCallback(() => {
    setPoints([]);
  }, []);

  const handleSubmit = async () => {
    if (!formData) return;
    await onSave({
      ...formData,
      location: [points],
    });
    onClose();
  };

  if (!isLoaded || !formData) {
    return <div>Loading maps...</div>;
  }

  return (
    <MyDialog
      title={t("regions.edit")}
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
              points={points}
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
