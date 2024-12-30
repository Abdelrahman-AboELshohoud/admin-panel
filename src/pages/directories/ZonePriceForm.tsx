import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "react-hot-toast";
import { GoogleMap, Polygon, useLoadScript } from "@react-google-maps/api";

interface Point {
  lat: number;
  lng: number;
}

interface TimeMultiplier {
  startTime: string;
  endTime: string;
  multiply: number;
}

interface ZonePriceFormData {
  name?: string;
  cost?: number;
  timeMultipliers?: TimeMultiplier[];
  from: Point[];
  to: Point[];
}

interface ZonePriceFormProps {
  zone: ZonePriceFormData | null;
  onSubmit: any;
  onCancel: () => void;
  isEditing: boolean;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 55.7887,
  lng: 49.1221, // Kazan coordinates
};

export default function ZonePriceForm({
  zone,
  onSubmit,
  onCancel,
  isEditing,
}: ZonePriceFormProps) {
  const { t } = useTranslation();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing", "geometry"],
  });

  const [formData, setFormData] = useState<ZonePriceFormData>({
    name: "",
    cost: 0,
    from: [],
    to: [],
    timeMultipliers: [],
  });
  const [selectedPoint, setSelectedPoint] = useState<"from" | "to">("from");

  useEffect(() => {
    if (zone) {
      setFormData({
        ...zone,
        timeMultipliers: zone.timeMultipliers || [],
        from: zone.from || [],
        to: zone.to || [],
      });
    }
  }, [zone]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng || !isEditing) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newPoint: Point = { lat, lng };

      setFormData((prev) => {
        const currentPoints = prev[selectedPoint];
        return {
          ...prev,
          [selectedPoint]: [...currentPoints, newPoint],
        };
      });
    },
    [isEditing, selectedPoint]
  );

  const handlePolygonComplete = useCallback(
    (type: "from" | "to") => (polygon: google.maps.Polygon) => {
      if (!isEditing) return;

      const path = polygon.getPath();
      const points: Point[] = [];

      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        points.push({ lat: point.lat(), lng: point.lng() });
      }

      setFormData((prev) => ({
        ...prev,
        [type]: points,
      }));
    },
    [isEditing]
  );

  const handlePolygonEdit = useCallback(
    (type: "from" | "to") => (polygon: google.maps.Polygon) => {
      if (!isEditing) return;

      const path = polygon.getPath();
      const points: Point[] = [];

      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        points.push({ lat: point.lat(), lng: point.lng() });
      }

      setFormData((prev) => ({
        ...prev,
        [type]: points,
      }));
    },
    [isEditing]
  );

  const clearPolygon = useCallback((type: "from" | "to") => {
    setFormData((prev) => ({
      ...prev,
      [type]: [],
    }));
  }, []);

  const handleAddTimeMultiplier = () => {
    setFormData((prev) => ({
      ...prev,
      timeMultipliers: [
        ...(prev.timeMultipliers || []),
        { startTime: "00:00", endTime: "00:00", multiply: 1 },
      ],
    }));
  };

  const handleRemoveTimeMultiplier = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeMultipliers: prev.timeMultipliers?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.cost) {
      toast.error(t("directories.zonePrices.messages.error.required"));
      return;
    }

    if (formData.from.length < 3 || formData.to.length < 3) {
      toast.error(t("directories.zonePrices.messages.error.invalidPoints"));
      return;
    }

    onSubmit(formData);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t("directories.zonePrices.fields.name")}
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              disabled={!isEditing}
              className="custom-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t("directories.zonePrices.fields.cost")}
            </label>
            <Input
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cost: parseFloat(e.target.value),
                }))
              }
              disabled={!isEditing}
              className="custom-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              {t("directories.zonePrices.timeMultiplier.title")}
            </label>
            {formData.timeMultipliers?.map((multiplier, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <Input
                  type="time"
                  value={multiplier.startTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeMultipliers: prev.timeMultipliers?.map((m, i) =>
                        i === index ? { ...m, startTime: e.target.value } : m
                      ),
                    }))
                  }
                  disabled={!isEditing}
                  className="custom-input"
                />
                <Input
                  type="time"
                  value={multiplier.endTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeMultipliers: prev.timeMultipliers?.map((m, i) =>
                        i === index ? { ...m, endTime: e.target.value } : m
                      ),
                    }))
                  }
                  disabled={!isEditing}
                  className="custom-input"
                />
                <Input
                  type="number"
                  value={multiplier.multiply}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeMultipliers: prev.timeMultipliers?.map((m, i) =>
                        i === index
                          ? { ...m, multiply: parseFloat(e.target.value) }
                          : m
                      ),
                    }))
                  }
                  disabled={!isEditing}
                  className="rounded w-8 p-1"
                />
                {isEditing && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveTimeMultiplier(index)}
                  >
                    {t("common.remove")}
                  </Button>
                )}
              </div>
            ))}
            {isEditing && (
              <Button
                className="text-gray-600"
                variant="outline"
                size="sm"
                onClick={handleAddTimeMultiplier}
              >
                {t("directories.zonePrices.timeMultiplier.add")}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2 mb-2">
            <Button
              variant={selectedPoint === "from" ? "default" : "outline"}
              onClick={() => setSelectedPoint("from")}
              disabled={!isEditing}
            >
              {t("directories.zonePrices.map.fromPoint")}
            </Button>
            <Button
              variant={selectedPoint === "to" ? "default" : "outline"}
              onClick={() => setSelectedPoint("to")}
              disabled={!isEditing}
            >
              {t("directories.zonePrices.map.toPoint")}
            </Button>
            {isEditing && (
              <Button
                variant="destructive"
                onClick={() => clearPolygon(selectedPoint)}
              >
                {t("directories.zonePrices.map.clear")}
              </Button>
            )}
          </div>

          <div className="h-[500px] relative">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={12}
              onClick={handleMapClick}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {formData.from.length > 0 && (
                <Polygon
                  paths={formData.from}
                  options={{
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                    strokeColor: "#FF0000",
                    strokeWeight: 2,
                  }}
                  editable={isEditing}
                  draggable={isEditing}
                  onLoad={handlePolygonComplete("from")}
                  onMouseUp={() => handlePolygonEdit("from")}
                />
              )}
              {formData.to.length > 0 && (
                <Polygon
                  paths={formData.to}
                  options={{
                    fillColor: "#0000FF",
                    fillOpacity: 0.35,
                    strokeColor: "#0000FF",
                    strokeWeight: 2,
                  }}
                  editable={isEditing}
                  draggable={isEditing}
                  onLoad={handlePolygonComplete("to")}
                  onMouseUp={() => handlePolygonEdit("to")}
                />
              )}
            </GoogleMap>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button className="text-gray-600" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        {isEditing && (
          <Button onClick={handleSubmit}>
            {zone ? t("common.save") : t("common.create")}
          </Button>
        )}
      </div>
    </div>
  );
}
