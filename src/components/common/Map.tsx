import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { renderToStaticMarkup } from "react-dom/server";
import { MdLocationPin } from "react-icons/md";
const MapWithClusters = () => {
  const [selectedLocations, setSelectedLocations] = useState<
    { lat: number; lng: number }[]
  >([]);

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const createIconURL = (IconComponent: any) => {
    const svgString = renderToStaticMarkup(<IconComponent color="#d3121f" />);
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`;
  };

  const iconUrl = createIconURL(MdLocationPin);

  const center = {
    lat: 37.7749, // Example latitude (San Francisco)
    lng: -122.4194, // Example longitude
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        onClick={(e) => {
          e.domEvent;
          if (e.latLng) {
            if (selectedLocations.length === 2) {
              setSelectedLocations((prev) => [
                prev[0],
                { lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0 },
              ]);
            } else {
              setSelectedLocations((prev) => [
                ...prev,
                { lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0 },
              ]);
            }
          }
        }}
        center={center}
        zoom={10}
      >
        {selectedLocations.map((location, index) => (
          <Marker
            onClick={() => {
              setSelectedLocations((prev) =>
                prev.filter((_, i) => i !== index)
              );
            }}
            key={`dynamic-${index}`}
            position={location}
            icon={{
              url: iconUrl,
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithClusters;
