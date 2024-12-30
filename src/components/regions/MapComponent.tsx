import { useCallback } from "react";
import { GoogleMap, Polygon } from "@react-google-maps/api";
import { Point } from "./EditRegionDialog";

interface MapComponentProps {
  points: Point[];
  isEditing: boolean;
  onPolygonChange: (points: Point[]) => void;
  onClick: (e: google.maps.MapMouseEvent) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: 55.7887, lng: 49.1221 };

export default function MapComponent({
  points,
  isEditing,
  onPolygonChange,
  onClick,
}: MapComponentProps) {
  const handlePolygonEdit = useCallback(
    (polygon: google.maps.Polygon) => {
      if (!isEditing) return;

      const path = polygon.getPath();
      const newPoints: Point[] = [];

      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        newPoints.push({ lat: point.lat(), lng: point.lng() });
      }

      onPolygonChange(newPoints);
    },
    [isEditing, onPolygonChange]
  );

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={points[0] || defaultCenter}
      zoom={12}
      onClick={onClick}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {points.length > 0 && (
        <Polygon
          paths={points}
          options={{
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            strokeColor: "#FF0000",
            strokeWeight: 2,
            editable: isEditing,
            draggable: isEditing,
          }}
          onMouseUp={(e) =>
            handlePolygonEdit(e as unknown as google.maps.Polygon)
          }
          onDragEnd={(e) =>
            handlePolygonEdit(e as unknown as google.maps.Polygon)
          }
        />
      )}
    </GoogleMap>
  );
}
