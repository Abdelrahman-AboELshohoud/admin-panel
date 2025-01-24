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
  const [isVisible, setIsVisible] = useState(true);

  // Initialize form data and points when region changes or dialog opens
  useEffect(() => {
    if (region) {
      setFormData(region);
      // Set initial points from region location if available
      if (region.location?.[0]) {
        setPoints(region.location[0]);
      }
      setIsVisible(region.enabled);
    } else {
      // Reset form when dialog closes
      setFormData(null);
      setPoints([]);
      setIsVisible(true);
    }
  }, [region, isOpen]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newPoint: Point = { lat, lng };

    setPoints((prev) => [...prev, newPoint]);
  }, []);

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
    return null;
  }

  return (
    <MyDialog
      title={t("regions.edit")}
      isOpen={isOpen}
      onOpenChange={onClose}
      showCloseButton={false}
      className="max-w-3xl"
    >
      <div className="flex flex-col max-h-[80vh]">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex gap-2 justify-between">
                <Button variant="destructive" onClick={clearPolygon}>
                  {t("common.clear")}
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {t("regions.showOnMap")}
                  </span>
                  <Switch
                    disabled={false}
                    checked={isVisible}
                    onChange={() => setIsVisible(!isVisible)}
                  />
                </div>
              </div>

              <div className="h-[400px]">
                <MapComponent
                  points={points}
                  isEditing={true}
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
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-700">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit}>{t("common.save")}</Button>
        </div>
      </div>
    </MyDialog>
  );
}
