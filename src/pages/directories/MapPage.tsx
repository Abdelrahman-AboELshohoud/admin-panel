import { useState, useCallback, useEffect } from "react";
import Switch from "../../components/common/Switch";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { GoogleMap, Polygon, useLoadScript } from "@react-google-maps/api";
import {
  RegionListGQL,
  UpdateRegionGQL,
  type Region,
} from "../../graphql/requests";
import EditRegionDialog from "../../components/regions/EditRegionDialog";
import AddInMap from "./AddInMap";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 55.7887,
  lng: 49.1221,
};

const libraries: ("drawing" | "geometry" | "places" | "visualization")[] = [
  "drawing",
  "geometry",
];

export default function MapPage() {
  const { t } = useTranslation();
  const [regions, setRegions] = useState<Region[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddInMap, setShowAddInMap] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [_map, setMap] = useState<google.maps.Map | null>(null);
  const [visibleRegions, setVisibleRegions] = useState<Set<string>>(new Set());
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Initialize visible regions
  useEffect(() => {
    const initialVisible = new Set(regions.map((r) => r.id));
    setVisibleRegions(initialVisible);
  }, [regions]);

  const fetchRegions = useCallback(async () => {
    try {
      const response = await RegionListGQL({});
      if (response.data?.regions) {
        setRegions(response.data.regions);
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
      toast.error(t("regions.errors.fetchFailed"));
    }
  }, [t]);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  const handleToggleVisibility = (regionId: string) => {
    setVisibleRegions((prev) => {
      const next = new Set(prev);
      if (next.has(regionId)) {
        next.delete(regionId);
      } else {
        next.add(regionId);
      }
      return next;
    });
  };

  const handleToggleEnabled = async (regionId: string) => {
    try {
      const region = regions.find((r) => r.id === regionId);
      if (!region) return;

      await UpdateRegionGQL({
        id: regionId,
        update: {
          enabled: region.enabled,
          name: region.name,
          currency: region.currency,
          location: region.location,
        },
      });

      setRegions((prev) =>
        prev.map((r) => (r.id === regionId ? { ...r, enabled: !r.enabled } : r))
      );
    } catch (error) {
      console.error("Error updating region:", error);
      toast.error(t("regions.errors.updateFailed"));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success(t("regions.changesSaved"));
  };

  const handleEdit = (region: Region) => {
    setEditingRegion(region);
    setShowDialog(true);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-200">
          {t("titles.districts")}
        </h1>
        <div className="flex gap-2">
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="custom-input"
            >
              {t("common.cancel")}
            </Button>
          )}
          <Button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            variant={isEditing ? "default" : "outline"}
            className="custom-input"
          >
            {isEditing ? t("common.save") : t("common.edit")}
          </Button>
        </div>
      </div>

      <div className="card-shape h-[600px] mb-6">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={12}
          onLoad={setMap}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {regions
            .filter((region) => visibleRegions.has(region.id))
            .map((region) => {
              const polygonPath = region.location?.[0];
              if (!polygonPath || polygonPath.length < 3) return null;

              return (
                <Polygon
                  key={region.id}
                  paths={polygonPath}
                  options={{
                    fillColor: region.enabled ? "#00FF00" : "#FF0000",
                    fillOpacity: 0.35,
                    strokeColor: region.enabled ? "#00FF00" : "#FF0000",
                    strokeWeight: 2,
                  }}
                />
              );
            })}
        </GoogleMap>
      </div>

      <div className="card-shape p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-200">
            {t("regions.list")}
          </h2>
          {isEditing && (
            <Button
              onClick={() => setShowAddInMap(true)}
              variant="outline"
              className="custom-input"
            >
              {t("regions.addNew")}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {regions.map((region) => (
            <div
              key={region.id}
              className="flex items-center justify-between p-4 bg-[#1E1E1E] rounded-lg hover:bg-[#2A2A2A] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: region.enabled ? "#00FF00" : "#FF0000",
                    opacity: 0.6,
                  }}
                />
                <div>
                  <h3 className="text-gray-200 font-medium">{region.name}</h3>
                  <p className="text-sm text-gray-400">
                    {region.location?.[0]?.length || 0} {t("regions.points")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {t("regions.showOnMap")}
                  </span>
                  <Switch
                    disabled={false}
                    checked={visibleRegions.has(region.id)}
                    onChange={() => handleToggleVisibility(region.id)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {t("regions.status")}
                  </span>
                  <Switch
                    checked={region.enabled}
                    disabled={false}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleEnabled(region.id);
                    }}
                  />
                </div>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(region)}
                  >
                    {t("common.edit")}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddInMap && (
        <AddInMap
          isOpen={showAddInMap}
          onClose={() => setShowAddInMap(false)}
          onSave={async (region: Region) => {
            setRegions((prev) => [...prev, region]);
          }}
        />
      )}

      <EditRegionDialog
        region={editingRegion}
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false);
          setEditingRegion(null);
        }}
        onSave={async (updatedRegion) => {
          try {
            await UpdateRegionGQL({
              id: editingRegion?.id || "",
              update: updatedRegion,
            });

            if (editingRegion) {
              // Update existing region
              setRegions((prev) =>
                prev.map((r) =>
                  r.id === editingRegion.id
                    ? { ...updatedRegion, id: editingRegion.id }
                    : r
                )
              );
            } else {
              // Add new region
              setRegions((prev) => [
                ...prev,
                { ...updatedRegion, id: String(Date.now()) },
              ]);
            }
            setShowDialog(false);
            setEditingRegion(null);
            toast.success(t("regions.updateSuccess"));
          } catch (error) {
            toast.error(t("regions.errors.updateFailed"));
          }
        }}
      />
    </div>
  );
}
