import { useState, useEffect } from "react";
import Switch from "../../components/common/Switch";
import Map from "../../components/common/Map";
import { Button } from "../../components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RegionListGQL } from "../../graphql/requests";

interface Region {
  id: string;
  name: string;
  enabled: boolean;
  location: Array<Array<{ lat: number; lng: number }>>;
}

function Switches() {
  const { t } = useTranslation();
  const [regions, setRegions] = useState<Region[]>([]);
  const [activeRegions, setActiveRegions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await RegionListGQL({
          paging: {
            limit: 100,
          },
        });

        if (response.data?.regions?.nodes) {
          setRegions(response.data.regions.nodes);

          // Initialize active states
          const initialActiveRegions = response.data.regions.nodes
            .filter((region: Region) => region.enabled)
            .map((region: Region) => region.id);

          setActiveRegions(initialActiveRegions);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  const handleToggleRegion = (regionId: string) => {
    setActiveRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((id) => id !== regionId)
        : [...prev, regionId]
    );
  };

  return (
    <div className="bg-transparent text-zinc-100 p-4 ml-4 rounded-lg flex justify-between">
      <div className="flex flex-col w-full gap-4">
        {regions.map((region) => (
          <div key={region.id} className="flex items-center justify-between">
            <Link
              to={`/control-panel/directories/regions/${region.id}`}
              className="text-sm hover:text-blue-400 transition-colors"
            >
              {region.name}
            </Link>
            <Switch
              disabled={false}
              checked={activeRegions.includes(region.id)}
              onChange={() => handleToggleRegion(region.id)}
            />
          </div>
        ))}

        <Button
          className="add-button w-fit ml-auto mt-4"
          onClick={() => {
            navigate("/control-panel/directories/add-in-map");
          }}
        >
          <Plus className="mr-2" />
          {t("buttonsAdd.addInMap")}
        </Button>
      </div>
    </div>
  );
}

export default function MapPage() {
  const { t } = useTranslation();
  const [regions, setRegions] = useState<Region[]>([]);
  const [activeRegions, setActiveRegions] = useState<string[]>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await RegionListGQL({
          paging: {
            limit: 100,
          },
        });

        if (response.data?.regions?.nodes) {
          setRegions(response.data.regions.nodes);

          const initialActiveRegions = response.data.regions.nodes
            .filter((region: Region) => region.enabled)
            .map((region: Region) => region.id);

          setActiveRegions(initialActiveRegions);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  return (
    <div className="flex flex-col bg-transparent p-4">
      <div className="flex-grow flex flex-col items-center mb-4">
        <h1 className="text-3xl font-bold text-zinc-100 mb-4 w-full pl-12">
          {t("titles.districts")}
        </h1>
        <Map
          regions={regions.filter((region) =>
            activeRegions.includes(region.id)
          )}
        />
      </div>
      <Switches />
    </div>
  );
}
