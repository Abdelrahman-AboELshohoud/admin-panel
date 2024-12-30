import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polygon,
  DrawingManager,
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
}

const MapWithClusters = ({
  selectedLocations,
  setSelectedLocations,
  center = { lat: 0, lng: 0 },
  children,
  showDrawingTools = false,
  onPolygonComplete,
  polygons = [],
  zoom = 10,
  onMapClick,
  ...props
}: MapProps) => {
  const mapContainerStyle = {
    width: "100%",
    height: "500px",
  };

  const [key, setKey] = useState(0);

  useEffect(() => {
    // Force reload map when component mounts
    setKey((prev) => prev + 1);
  }, []);

  const handlePolygonComplete = useCallback(
    (polygon: google.maps.Polygon) => {
      if (onPolygonComplete) {
        onPolygonComplete(polygon);
      }
    },
    [onPolygonComplete]
  );

  return (
    <LoadScript
      key={key}
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["drawing"]}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onClick={onMapClick}
        {...props}
      >
        {selectedLocations?.map((location, index) => (
          <Marker
            key={`dynamic-${index}`}
            position={location}
            icon={{
              url: iconUrl,
              scaledSize: new window.google.maps.Size(20, 20),
            }}
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
        {polygons && polygons.length > 0 &&
          polygons.map((polygon) => (
            <Polygon
              key={polygon.id}
              paths={polygon.coordinates}
              options={polygon.options}
            />
          ))}
        {children}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithClusters;
