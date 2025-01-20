import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import Map from "../../components/common/rare-using/Map";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

interface Location {
  driverId: number;
  location: {
    lat: number;
    lng: number;
  };
}

interface Driver {
  id: string;
  firstName?: string;
  lastName?: string;
  mobileNumber: string;
  status: string;
}

interface OverviewDriversMapProps {
  data: {
    listOfData: Driver[];
    locations: Location[];
    page: number;
    setPage: (page: number) => void;
    searchData: () => void;
  };
  locations: Location[];
}

const OverviewDriversMap = ({ locations = [] }: OverviewDriversMapProps) => {
  const [autoZoom, setAutoZoom] = useState(false);
  const [_selectedDriverId, setSelectedDriverId] = useState<string | null>(
    null
  );
  const [_map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [_clusterer, setClusterer] = useState<MarkerClusterer | null>(null);

  // Kazan coordinates
  const defaultCenter = { lat: 55.7887, lng: 49.1221 };

  //   // Fake driver locations for testing
  //   const testLocations: Location[] = [
  //     {
  //       driverId: 1,
  //       location: { lat: 55.7887, lng: 49.1221 },
  //     },
  //     {
  //       driverId: 2,
  //       location: { lat: 55.7967, lng: 49.1061 },
  //     },
  //     {
  //       driverId: 3,
  //       location: { lat: 55.7827, lng: 49.1351 },
  //     },
  //     {
  //       driverId: 4,
  //       location: { lat: 55.7947, lng: 49.1141 },
  //     },
  //     {
  //       driverId: 5,
  //       location: { lat: 55.7807, lng: 49.1291 },
  //     },
  //   ];

  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);

      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null));

      // Create markers for each location
      const locationsToUse = locations;
      const newMarkers = locationsToUse.map((loc) => {
        const marker = new google.maps.Marker({
          position: loc.location,
          map: map,
          icon: {
            url: "/car.png",
            scaledSize: new google.maps.Size(32, 32),
          },
          title: `Driver ${loc.driverId}`,
        });

        marker.addListener("click", () => handleMarkerClick(loc.driverId));
        return marker;
      });

      setMarkers(newMarkers);

      // Initialize clusterer with new markers
      const newClusterer = new MarkerClusterer({
        map,
        markers: newMarkers,
      });
      setClusterer(newClusterer);
    },
    [locations]
  );

  const handleMarkerClick = (driverId: number) => {
    setSelectedDriverId(driverId.toString());
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Drivers Online</CardTitle>
          <div className="flex items-center gap-2">
            <span>Auto Zoom</span>
            <Switch checked={autoZoom} onCheckedChange={setAutoZoom} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="h-[400px] w-full">
          <Map center={defaultCenter} zoom={12} onLoad={handleMapLoad} />
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewDriversMap;
