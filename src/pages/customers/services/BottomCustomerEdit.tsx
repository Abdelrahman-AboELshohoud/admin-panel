import { Button } from "../../../components/ui/button";
import { FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { type Service as ServiceType } from "../../../graphql/requests";
import { Input } from "../../../components/ui/input";
import Map from "../../../components/common/rare-using/Map";
import Switch from "../../../components/common/form-elements/Switch";
import { useMemo, useState } from "react";

interface BottomCustomerEditProps {
  editing: boolean;
  service: ServiceType;
  type?: "add" | "edit";
  setService: (service: ServiceType) => void;
}

export default function BottomCustomerEdit({
  editing,
  service,
  setService,
  type = "edit",
}: BottomCustomerEditProps) {
  const { t } = useTranslation();
  const [visibleRegions, setVisibleRegions] = useState<{
    [key: string]: boolean;
  }>({});

  const handleInputChange = (key: keyof ServiceType, value: any) => {
    setService({
      ...service,
      [key]: value,
    });
  };

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath();
    const coordinates = [];

    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push({
        lat: point.lat(),
        lng: point.lng(),
      });
    }

    const newRegions = [...(service.regions || [])];
    const newRegionId = `new_${Date.now()}`;
    newRegions.push({
      id: newRegionId,
      name: `Region ${newRegions.length + 1}`,
      enabled: true,
      location: [coordinates],
      currency: "USD",
    });

    setVisibleRegions((prev) => ({
      ...prev,
      [newRegionId]: true,
    }));

    handleInputChange("regions", newRegions);
    polygon.setMap(null);
  };

  const handlePolygonUpdate = (
    id: string,
    coordinates: { lat: number; lng: number }[]
  ) => {
    const newRegions = service.regions?.map((region) => {
      if (region.id === id) {
        return {
          ...region,
          location: [coordinates],
        };
      }
      return region;
    });
    handleInputChange("regions", newRegions);
  };

  const mapPolygons = useMemo(() => {
    return (
      service.regions?.map((region) => ({
        id: region.id,
        coordinates: region.location[0],
        options: {
          fillColor: "#B69F7D",
          fillOpacity: 0.4,
          strokeColor: "#B69F7D",
          strokeWeight: 2,
          editable: editing,
          draggable: editing,
          visible: visibleRegions[region.id] || false,
        },
        onUpdate: (coords: { lat: number; lng: number }[]) =>
          handlePolygonUpdate(region.id, coords),
      })) || []
    );
  }, [service.regions, editing, visibleRegions]);

  return (
    <div className="mt-8">
      <h3 className="text-xl mb-4 font-bold">{t("calculationOfDelivery")}</h3>

      {/* Basic Options */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold">{t("basicOptions")}</h4>
        <div className="grid grid-cols-3 gap-4">
          {/* Cancellation Fee */}
          <div>
            <label className="block text-sm mb-1">
              {t("bottomCustomerEdit.cancellationFee")}
            </label>
            <Input
              type="number"
              value={service.cancellationTotalFee || 0}
              onChange={(e) =>
                handleInputChange(
                  "cancellationTotalFee",
                  Number(e.target.value)
                )
              }
              readOnly={!editing}
              className="bg-[#282828] text-gray-100"
            />
          </div>

          {/* Driver Share */}
          <div>
            <label className="block text-sm mb-1">
              {t("bottomCustomerEdit.driverShare")}
            </label>
            <Input
              type="number"
              value={service.cancellationDriverShare || 0}
              onChange={(e) =>
                handleInputChange(
                  "cancellationDriverShare",
                  Number(e.target.value)
                )
              }
              readOnly={!editing}
              className="bg-[#282828] text-gray-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm mb-1">
              {t("bottomCustomerEdit.category")}
            </label>
            <Input
              type="text"
              value={service.categoryId || ""}
              onChange={(e) => handleInputChange("categoryId", e.target.value)}
              readOnly={!editing}
              className="bg-[#282828] text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Regions Section */}
      {type === "edit" && (
        <div className="mt-8">
          <h4 className="text-lg font-bold mb-4">
            {t("bottomCustomerEdit.regions")}
          </h4>

          {/* Map */}
          <div className="space-y-4 mb-6">
            <div className="h-[400px] w-full">
              <Map
                showDrawingTools={editing}
                onPolygonComplete={handlePolygonComplete}
                polygons={mapPolygons}
                center={{ lat: 55.7887, lng: 49.1221 }} // Kazan coordinates
                zoom={11}
              />
            </div>
          </div>

          {/* Region Controls */}
          <div className="flex flex-col items-center gap-4 bg-transparent mt-36">
            {service.regions &&
              service.regions.length > 0 &&
              service.regions.map((region, index) => (
                <div
                  className={`grid gap-4 w-full ${
                    editing
                      ? "grid-cols-[3fr_1fr_0.2fr_0.2fr_0.2fr]"
                      : "grid-cols-[3fr_1fr_0.2fr_0.2fr]"
                  }`}
                  key={region.id}
                >
                  <label className="text-sm text-gray-400 mb-1 flex flex-col gap-2">
                    {t("bottomCustomerEdit.regionName")}

                    <Input
                      value={region.name}
                      onChange={(e) => {
                        const newRegions = [...(service.regions || [])];
                        newRegions[index] = {
                          ...newRegions[index],
                          name: e.target.value,
                        };
                        handleInputChange("regions", newRegions);
                      }}
                      readOnly={!editing}
                      className="custom-input w-full"
                    />
                  </label>
                  <label className="text-sm text-gray-400 mb-1 flex flex-col gap-2">
                    {t("bottomCustomerEdit.currency")}

                    <Input
                      value={region.currency}
                      onChange={(e) => {
                        const newRegions = [...(service.regions || [])];
                        newRegions[index] = {
                          ...newRegions[index],
                          currency: e.target.value,
                        };
                        handleInputChange("regions", newRegions);
                      }}
                      readOnly={!editing}
                      className="custom-input"
                    />
                  </label>
                  <label className="text-sm text-gray-400 mb-1 flex flex-col gap-3">
                    {t("bottomCustomerEdit.status")}
                    <Switch
                      checked={region.enabled}
                      disabled={!editing}
                      onChange={(checked) => {
                        const newRegions = [...(service.regions || [])];
                        newRegions[index] = {
                          ...newRegions[index],
                          enabled: checked,
                        };
                        handleInputChange("regions", newRegions);
                      }}
                    />
                  </label>
                  <label className="text-sm text-gray-400 mb-1 flex flex-col gap-3">
                    {t("bottomCustomerEdit.showOnMap")}
                    <Switch
                      disabled={false}
                      checked={visibleRegions[region.id] || false}
                      onChange={() => {
                        setVisibleRegions((prev) => ({
                          ...prev,
                          [region.id]: !prev[region.id],
                        }));
                      }}
                    />
                  </label>

                  {editing && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="mt-auto mb-2"
                        onClick={() => {
                          const newRegions = service.regions?.filter(
                            (_, i) => i !== index
                          );
                          handleInputChange("regions", newRegions);
                          const newVisibleRegions = { ...visibleRegions };
                          delete newVisibleRegions[region.id];
                          setVisibleRegions(newVisibleRegions);
                        }}
                      >
                        {t("common.remove")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Multipliers Section */}
      <div className="mt-6">
        <h4 className="text-lg font-bold mb-4">
          {t("bottomCustomerEdit.multipliers")}
        </h4>

        {/* Distance Multipliers */}
        <div className="space-y-4 mb-6">
          <h5 className="font-medium">
            {t("bottomCustomerEdit.distanceMultipliers")}
          </h5>
          {service.distanceMultipliers &&
            service.distanceMultipliers.length > 0 &&
            service.distanceMultipliers.map((multiplier, index) => (
              <div
                key={index}
                className={`grid  gap-4 ${
                  editing
                    ? "grid-cols-[1fr_1fr_1fr_0.2fr]"
                    : "grid-cols-[1fr_1fr_1fr]"
                }`}
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {t("bottomCustomerEdit.from")}
                  </label>
                  <Input
                    type="number"
                    value={multiplier.distanceFrom}
                    onChange={(e) => {
                      const newMultipliers = [
                        ...(service.distanceMultipliers || []),
                      ];
                      newMultipliers[index] = {
                        ...newMultipliers[index],
                        distanceFrom: Number(e.target.value),
                      };
                      handleInputChange("distanceMultipliers", newMultipliers);
                    }}
                    readOnly={!editing}
                    className="bg-[#282828] text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {t("bottomCustomerEdit.to")}
                  </label>
                  <Input
                    type="number"
                    value={multiplier.distanceTo}
                    onChange={(e) => {
                      const newMultipliers = [
                        ...(service.distanceMultipliers || []),
                      ];
                      newMultipliers[index] = {
                        ...newMultipliers[index],
                        distanceTo: Number(e.target.value),
                      };
                      handleInputChange("distanceMultipliers", newMultipliers);
                    }}
                    readOnly={!editing}
                    className="bg-[#282828] text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {t("bottomCustomerEdit.multiplier")}
                  </label>
                  <Input
                    type="number"
                    value={multiplier.multiply}
                    onChange={(e) => {
                      const newMultipliers = [
                        ...(service.distanceMultipliers || []),
                      ];
                      newMultipliers[index] = {
                        ...newMultipliers[index],
                        multiply: Number(e.target.value),
                      };
                      handleInputChange("distanceMultipliers", newMultipliers);
                    }}
                    readOnly={!editing}
                    className="bg-[#282828] text-gray-100"
                  />
                </div>
                {editing && (
                  <div className="flex items-end gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newMultipliers =
                          service.distanceMultipliers?.filter(
                            (_, i) => i !== index
                          );
                        handleInputChange(
                          "distanceMultipliers",
                          newMultipliers
                        );
                      }}
                    >
                      {t("common.remove")}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          {editing && (
            <Button
              onClick={() => {
                const newMultipliers = [...(service.distanceMultipliers || [])];
                newMultipliers.push({
                  distanceFrom: 0,
                  distanceTo: 0,
                  multiply: 1,
                });
                handleInputChange("distanceMultipliers", newMultipliers);
              }}
              className="mt-2"
            >
              <FaPlus className="mr-2" />
              {t("bottomCustomerEdit.addDistanceMultiplier")}
            </Button>
          )}
        </div>

        {/* Time Multipliers */}
        <div className="space-y-4 mb-6">
          <h5 className="font-medium">
            {t("bottomCustomerEdit.timeMultipliers")}
          </h5>
          {service.timeMultipliers &&
            service.timeMultipliers.length > 0 &&
            service.timeMultipliers.map((multiplier, index) => (
              <div
                key={index}
                className={`grid gap-4 ${
                  editing
                    ? "grid-cols-[1fr_1fr_1fr_0.2fr]"
                    : "grid-cols-[1fr_1fr_1fr]"
                }`}
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {t("bottomCustomerEdit.startTime")}
                  </label>
                  <Input
                    type="time"
                    value={multiplier.startTime}
                    onChange={(e) => {
                      const newMultipliers = [
                        ...(service.timeMultipliers || []),
                      ];
                      newMultipliers[index] = {
                        ...newMultipliers[index],
                        startTime: e.target.value,
                      };
                      handleInputChange("timeMultipliers", newMultipliers);
                    }}
                    readOnly={!editing}
                    className="bg-[#282828] text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {t("bottomCustomerEdit.endTime")}
                  </label>
                  <Input
                    type="time"
                    value={multiplier.endTime}
                    onChange={(e) => {
                      const newMultipliers = [
                        ...(service.timeMultipliers || []),
                      ];
                      newMultipliers[index] = {
                        ...newMultipliers[index],
                        endTime: e.target.value,
                      };
                      handleInputChange("timeMultipliers", newMultipliers);
                    }}
                    readOnly={!editing}
                    className="bg-[#282828] text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    {t("bottomCustomerEdit.multiplier")}
                  </label>
                  <Input
                    type="number"
                    value={multiplier.multiply}
                    onChange={(e) => {
                      const newMultipliers = [
                        ...(service.timeMultipliers || []),
                      ];
                      newMultipliers[index] = {
                        ...newMultipliers[index],
                        multiply: Number(e.target.value),
                      };
                      handleInputChange("timeMultipliers", newMultipliers);
                    }}
                    readOnly={!editing}
                    className="bg-[#282828] text-gray-100"
                  />
                </div>
                {editing && (
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newMultipliers = service.timeMultipliers?.filter(
                          (_, i) => i !== index
                        );
                        handleInputChange("timeMultipliers", newMultipliers);
                      }}
                    >
                      {t("common.remove")}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          {editing && (
            <Button
              onClick={() => {
                const newMultipliers = [...(service.timeMultipliers || [])];
                newMultipliers.push({
                  startTime: "00:00",
                  endTime: "00:00",
                  multiply: 1,
                });
                handleInputChange("timeMultipliers", newMultipliers);
              }}
              className="mt-2"
            >
              <FaPlus className="mr-2" />
              {t("bottomCustomerEdit.addTimeMultiplier")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
