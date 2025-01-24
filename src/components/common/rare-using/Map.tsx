import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  Polygon,
  DrawingManager,
  useLoadScript,
} from "@react-google-maps/api";
import { iconUrl } from "./Mark";

interface MapLocation {
  lat: number;
  lng: number;
}

interface MapPolygonOptions extends google.maps.PolygonOptions {
  onEdit?: (polygon: google.maps.Polygon) => void;
  onDragEnd?: (polygon: google.maps.Polygon) => void;
}

interface MapPolygon {
  id: string;
  coordinates: Array<{ lat: number; lng: number }>;
  options: MapPolygonOptions;
}

interface MapProps {
  selectedLocations?: MapLocation[];
  setSelectedLocations?: (locations: MapLocation[]) => void;
  center?: MapLocation;
  children?: React.ReactNode;
  showDrawingTools?: boolean;
  onPolygonComplete?: (polygon: google.maps.Polygon) => void;
  polygons?: MapPolygon[];
  zoom?: number;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  onLoad?: (map: google.maps.Map) => void;
}

const libraries: ("drawing" | "geometry" | "places" | "visualization")[] = [
  "drawing",
];

function Map({
  selectedLocations = [],
  setSelectedLocations,
  center = { lat: 0, lng: 0 },
  children,
  showDrawingTools = false,
  onPolygonComplete,
  polygons = [],
  zoom = 10,
  onMapClick,
  onLoad,
  ...props
}: MapProps) {
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [iconOptions, setIconOptions] = useState<google.maps.Icon | null>(null);

  useEffect(() => {
    if (isLoaded) {
      setIconOptions({
        url: iconUrl,
        scaledSize: new google.maps.Size(20, 20),
      } as google.maps.Icon);
    }
  }, [isLoaded]);

  const handlePolygonComplete = useCallback(
    (polygon: google.maps.Polygon) => {
      if (onPolygonComplete) {
        onPolygonComplete(polygon);
      }
    },
    [onPolygonComplete]
  );

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onClick={onMapClick}
      onLoad={onLoad}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
      {...props}
    >
      {selectedLocations?.map((location, index) => (
        <Marker
          key={`marker-${index}`}
          position={location}
          icon={iconOptions as any}
        />
      ))}

      {showDrawingTools && (
        <DrawingManager
          onPolygonComplete={handlePolygonComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [google.maps.drawing.OverlayType.POLYGON],
            },
            polygonOptions: {
              fillColor: "#B69F7D",
              fillOpacity: 0.4,
              strokeColor: "#B69F7D",
              strokeWeight: 2,
              clickable: true,
              editable: true,
              draggable: true,
            },
          }}
        />
      )}

      {polygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          paths={polygon.coordinates}
          options={polygon.options}
        />
      ))}

      {children}
    </GoogleMap>
  );
}

export default Map;
