import { useState, useCallback } from "react";
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

interface MapProps {
  selectedLocations?: MapLocation[];
  setSelectedLocations?: (locations: MapLocation[]) => void;
  center?: MapLocation;
  children?: React.ReactNode;
  showDrawingTools?: boolean;
  onPolygonComplete?: (polygon: google.maps.Polygon) => void;
  polygons?: Array<{
    id: string;
    coordinates: MapLocation[];
    options?: google.maps.PolygonOptions;
  }>;
}

const MapWithClusters = ({
  selectedLocations,
  setSelectedLocations,
  center = { lat: 0, lng: 0 },
  children,
  showDrawingTools = false,
  onPolygonComplete,
  polygons = [],
  ...props
}: MapProps) => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

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
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onLoad={() => setGoogleMapsLoaded(true)}
      libraries={["drawing"]}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        {...props}
      >
        {googleMapsLoaded &&
          selectedLocations?.map((location, index) => (
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
        {polygons.map((polygon) => (
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
