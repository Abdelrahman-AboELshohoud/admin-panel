import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLoadScript } from "@react-google-maps/api";
import { MyDialog } from "../../../components/common/dialogs/MyDialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Switch from "../../../components/common/form-elements/Switch";
import MapComponent from "../../../components/regions/MapComponent";
import { CreateRegionGQL } from "../../../graphql/requests";
import { toast } from "react-hot-toast";

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
  onSave: (region: any) => void;
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
  const [formData, setFormData] = useState<RegionForm>(defaultRegion);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing", "geometry"],
  });

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
    try {
      setIsSubmitting(true);
      if (formData.points.length < 3) {
        toast.error(t("regions.errors.invalidPoints"));
        return;
      }

      // Ensure polygon is closed by adding first point as last point if needed
      let points = [...formData.points];
      if (
        points[0].lat !== points[points.length - 1].lat ||
        points[0].lng !== points[points.length - 1].lng
      ) {
        points.push(points[0]);
      }

      const response = await CreateRegionGQL({
        input: {
          name: formData.name,
          currency: formData.currency,
          enabled: formData.enabled,
          location: [points],
        },
      });

      if (response.data?.createRegion) {
        toast.success(t("regions.createSuccess"));
        onSave(response.data.createRegion);
        setFormData(defaultRegion);
        onClose();
      }
    } catch (error) {
      console.error("Error creating region:", error);
      toast.error(t("regions.errors.createFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <MyDialog
      title={t("regions.createNew")}
      isOpen={isOpen}
      onOpenChange={onClose}
      showCloseButton={false}
      className="max-w-3xl"
    >
      <div className="flex flex-col max-h-[80vh]">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                >
                  {isEditing
                    ? t("common.stopEditing")
                    : t("common.startEditing")}
                </Button>
                <Button variant="destructive" size="sm" onClick={clearPolygon}>
                  {t("common.clear")}
                </Button>
              </div>

              <div className="h-[400px]">
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
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-700">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </div>
    </MyDialog>
  );
}
