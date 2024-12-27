import { useState } from "react";
import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";
import { iconUrl } from "./Mark";

const MapWithClusters = ({
  selectedLocations,
  setSelectedLocations,
  center = { lat: 0, lng: 0 },
  children,
  regions,
  ...props
}: {
  selectedLocations?: { lat: number; lng: number }[];
  setSelectedLocations?: any;
  center?: { lat: number; lng: number };
  props?: object;
  children?: React.ReactNode;
  regions?: any;
}) => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onLoad={() => setGoogleMapsLoaded(true)}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        onClick={(e) => {
          e.domEvent;
          if (e.latLng && selectedLocations) {
            if (selectedLocations.length === 2) {
              setSelectedLocations((prev: any) => [
                prev[0],
                { lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0 },
              ]);
            } else {
              setSelectedLocations((prev: any) => [
                ...prev,
                { lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0 },
              ]);
            }
          }
        }}
        center={center}
        zoom={10}
        {...props}
      >
        {googleMapsLoaded &&
          selectedLocations?.map((location, index) => (
            <Marker
              onClick={() => {
                setSelectedLocations((prev: any) =>
                  prev.filter((_: any, i: number) => i !== index)
                );
              }}
              key={`dynamic-${index}`}
              position={location}
              icon={{
                url: iconUrl,
                scaledSize: new window.google.maps.Size(20, 20),
              }}
            />
          ))}
        {regions?.map((region: any) => (
          <Polygon
            key={region.id}
            paths={region.location}
            options={{ fillColor: "#0000FF", strokeColor: "#0000FF" }}
          />
        ))}
        {children}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithClusters;
