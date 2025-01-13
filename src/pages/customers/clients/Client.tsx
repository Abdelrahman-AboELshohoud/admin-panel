import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Rider,
  ViewRiderGQL,
  DeleteRiderGQL,
  DispatcherCalculateFareGQL,
} from "../../../graphql/requests";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { useTranslation } from "react-i18next";
import ClientProfile from "./ClientProfile";
import ClientWallet from "./ClientWallet";
import ClientOrders from "./ClientOrders";
import { Button } from "../../../components/ui/button";
import DeletionDialog from "../../../components/common/DeletionDialog";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import { toast } from "react-hot-toast";

const libraries: "places"[] = ["places"];

interface Location {
  lat: number;
  lng: number;
}

interface CalculationResult {
  distance: number;
  duration: number;
  cost: number;
  currency: string;
}

export default function Client() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [client, setClient] = useState<Rider | null>(null);
  const [formData, setFormData] = useState<Partial<Rider> | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(5);
  const [_isDeleting, setIsDeleting] = useState(false);

  // Map related state
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [calculationResult, setCalculationResult] =
    useState<CalculationResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) {
        toast.error(t("common.errors.invalidLocation"));
        return;
      }

      if (!pickup) {
        setPickup({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      } else if (!dropoff) {
        setDropoff({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      }
    },
    [pickup, dropoff, t]
  );

  const calculateFare = useCallback(async () => {
    if (!pickup || !dropoff) {
      toast.error(
        !pickup
          ? t("clients.dispatcherCalculator.errors.pickupRequired")
          : t("clients.dispatcherCalculator.errors.dropoffRequired")
      );
      return;
    }

    try {
      const response = await DispatcherCalculateFareGQL({
        points: [
          {
            lat: pickup.lat,
            lng: pickup.lng,
          },
          {
            lat: dropoff.lat,
            lng: dropoff.lng,
          },
        ],
        riderId: client!.id,
      });

      if (response.data?.calculateFare) {
        const result = response.data.calculateFare;
        setCalculationResult({
          distance: result.distance,
          duration: result.duration,
          cost: result.cost,
          currency: result.currency,
        });

        // Get directions for visualization
        const directionsService = new google.maps.DirectionsService();
        try {
          const directionsResult = await directionsService.route({
            origin: pickup,
            destination: dropoff,
            travelMode: google.maps.TravelMode.DRIVING,
          });
          setDirections(directionsResult);
        } catch (error) {
          toast.error(t("clients.dispatcherCalculator.errors.directionsError"));
        }
      }
    } catch (error) {
      console.error("Fare calculation failed:", error);
      toast.error(t("clients.dispatcherCalculator.errors.calculationFailed"));
    }
  }, [pickup, dropoff, t, client]);

  const clearPoints = useCallback(() => {
    setPickup(null);
    setDropoff(null);
    setDirections(null);
    setCalculationResult(null);
  }, []);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await ViewRiderGQL({
          id: id!,
        });
        if (response.data.rider) {
          setClient(response.data.rider);
          setFormData(response.data.rider);
        } else {
          toast.error(t("clients.errors.notFound"));
        }
      } catch (error) {
        console.error("Error fetching client:", error);
        toast.error(t("clients.errors.fetchFailed"));
      }
    };
    fetchClient();
  }, [id, t]);

  useEffect(() => {
    let timer: any;
    if (showDeleteDialog && deleteCountdown > 0) {
      timer = setInterval(() => {
        setDeleteCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showDeleteDialog, deleteCountdown]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await DeleteRiderGQL({
        id: id!,
      });
      setShowDeleteDialog(false);
      navigate("/control-panel/clients/active");
      toast.success(t("clients.deleteSuccess"));
    } catch (error) {
      console.error("Error deleting rider:", error);
      toast.error(t("common.errors.deleteFailed"));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loadError) {
    toast.error(t("common.errors.mapLoadFailed"));
    return <div>{t("common.errors.mapLoadFailed")}</div>;
  }

  if (!isLoaded) {
    return <div>{t("common.loading")}</div>;
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-semibold text-gray-400">
            {t("clients.noClient")}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {client.firstName} {client.lastName}
        </h2>
        <Button
          variant="destructive"
          onClick={() => {
            setShowDeleteDialog(true);
            setDeleteCountdown(5);
          }}
        >
          {t("common.delete")}
        </Button>
      </div>

      <DeletionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        countdownSeconds={5}
        onConfirm={handleDelete}
        title={t("clients.deleteConfirmation")}
        description={t("clients.deleteWarning")}
      />
      <Tabs defaultValue="profile">
        <TabsList className="bg-transparent">
          <TabsTrigger value="profile" className="custom-tabs">
            {t("clients.profile")}
          </TabsTrigger>
          <TabsTrigger value="orders" className="custom-tabs">
            {t("clients.orders")}
          </TabsTrigger>
          <TabsTrigger value="wallets" className="custom-tabs">
            {t("clients.wallets")}
          </TabsTrigger>
          <TabsTrigger value="calculator" className="custom-tabs">
            {t("clients.dispatcherCalculator.title")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ClientProfile
            client={client}
            formData={formData}
            setFormData={setFormData}
          />
        </TabsContent>
        <TabsContent value="orders">
          <ClientOrders riderId={client.id} />
        </TabsContent>
        <TabsContent value="wallets">
          <ClientWallet riderId={client.id} />
        </TabsContent>
        <TabsContent value="calculator">
          <div className="card-shape p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">
                {t("clients.dispatcherCalculator.title")}
              </h3>
              <p className="text-gray-400 mb-4">
                {t("clients.dispatcherCalculator.instructions")}
              </p>
            </div>

            <div className="space-y-6">
              <div className="h-[500px] relative w-full">
                <GoogleMap
                  zoom={13}
                  center={{ lat: 55.7887, lng: 49.1221 }}
                  mapContainerClassName="w-full h-full rounded-lg"
                  onClick={handleMapClick}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                >
                  {pickup && (
                    <Marker
                      position={pickup}
                      label="A"
                      draggable
                      onDragEnd={(e) => {
                        if (e.latLng) {
                          setPickup({
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng(),
                          });
                        } else {
                          toast.error(t("common.errors.invalidLocation"));
                        }
                      }}
                    />
                  )}
                  {dropoff && (
                    <Marker
                      position={dropoff}
                      label="B"
                      draggable
                      onDragEnd={(e) => {
                        if (e.latLng) {
                          setDropoff({
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng(),
                          });
                        } else {
                          toast.error(t("common.errors.invalidLocation"));
                        }
                      }}
                    />
                  )}
                  {directions && (
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        suppressMarkers: true,
                      }}
                    />
                  )}
                </GoogleMap>
              </div>

              {calculationResult && (
                <div className="bg-secondary/10 p-6 rounded-lg space-y-4">
                  <h4 className="text-lg font-semibold">
                    {t("clients.dispatcherCalculator.results.title")}
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400">
                        {t("clients.dispatcherCalculator.results.distance")}
                      </p>
                      <p className="text-lg">
                        {calculationResult.distance.toFixed(2)} km
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("clients.dispatcherCalculator.results.duration")}
                      </p>
                      <p className="text-lg">
                        {Math.round(calculationResult.duration)} min
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {t("clients.dispatcherCalculator.results.cost")}
                      </p>
                      <p className="text-lg font-bold">
                        {calculationResult.cost} {calculationResult.currency}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={calculateFare} className="w-full">
                  {t("clients.dispatcherCalculator.calculate")}
                </Button>
                <Button
                  onClick={clearPoints}
                  variant="outline"
                  className="w-full"
                >
                  {t("clients.dispatcherCalculator.clear")}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
