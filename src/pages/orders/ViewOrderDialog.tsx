import { useTranslation } from "react-i18next";
import { MyDialog } from "../../components/common/dialogs/MyDialog";
import { format } from "date-fns";
import { Order, CancelOrderGQL, OrderStatus } from "../../graphql/requests";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import MyTabs from "../../components/common/MyTabs";
import { useLoadScript } from "@react-google-maps/api";
import MapComponent from "../../components/regions/MapComponent";
import { Point } from "../../components/regions/EditRegionDialog";
import { DirectionsRenderer } from "@react-google-maps/api";

interface ViewOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onOrderUpdate: () => void;
}

export default function ViewOrderDialog({
  isOpen,
  onOpenChange,
  order,
  onOrderUpdate,
}: ViewOrderDialogProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "drawing", "geometry"],
  });

  useEffect(() => {
    if (isLoaded && order?.points && order.points.length >= 2) {
      const directionsService = new google.maps.DirectionsService();

      const origin = order.points[0];
      const destination = order.points[order.points.length - 1];
      const waypoints = order.points.slice(1, -1).map((point) => ({
        location: new google.maps.LatLng(point.lat, point.lng),
        stopover: true,
      }));

      directionsService.route(
        {
          origin: new google.maps.LatLng(origin.lat, origin.lng),
          destination: new google.maps.LatLng(destination.lat, destination.lng),
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Directions request failed: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, order?.points]);

  const canCancel =
    order?.status !== OrderStatus.Finished &&
    order?.status !== OrderStatus.Started &&
    order?.status !== OrderStatus.Arrived &&
    order?.status !== OrderStatus.Expired &&
    order?.status !== OrderStatus.RiderCanceled &&
    order?.status !== OrderStatus.DriverCanceled;

  console.log(order);

  const handleCancelOrder = async () => {
    if (!order?.id || !canCancel) return;

    try {
      setIsLoading(true);
      await CancelOrderGQL({ orderId: order.id });
      toast.success(t("orders.cancelSuccess"));
      onOrderUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error(t("orders.cancelError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) return null;

  const renderChatMessage = (message: any) => {
    const time = format(new Date(message.createdAt), "HH:mm:ss");
    const date = format(new Date(message.createdAt), "dd.MM.yyyy");
    const isOperator = message.sentByOperator;

    return (
      <div
        key={message.id}
        className={`flex gap-4 ${isOperator ? "flex-row" : "flex-row-reverse"}`}
      >
        <div className="flex flex-col gap-1 max-w-[70%]">
          <div
            className={`rounded-lg p-3 ${
              isOperator
                ? "bg-gray-100 text-gray-900"
                : "bg-blue-500 text-white"
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
          <div
            className={`text-xs text-gray-500 ${
              isOperator ? "text-left" : "text-right"
            }`}
          >
            {time} - {date}
          </div>
        </div>
      </div>
    );
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      // Add your send message mutation here
      // await SendMessageGQL({ orderId: order.id, content: message });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t("orders.chat.sendError"));
    }
  };

  const tabItems = [
    { value: "order", title: t("orders.view.tabs.order") },
    { value: "events", title: t("orders.view.tabs.events") },
    { value: "route", title: t("orders.view.tabs.route") },
    { value: "chat", title: t("orders.view.tabs.chat") },
    { value: "photos", title: t("orders.view.tabs.photos") },
  ];

  const OrderActions = () => (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">{t("orders.actions.title")}</h3>
      <div className="flex gap-2">
        {canCancel && (
          <Button
            variant="destructive"
            onClick={handleCancelOrder}
            disabled={isLoading}
          >
            {t("orders.actions.cancel")}
          </Button>
        )}
      </div>
    </div>
  );

  const tabsContent = [
    {
      value: "order",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {/* Client Info */}
          <div className="space-y-2">
            <h3 className="font-semibold">{t("orders.view.client")}</h3>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div>
                <p className="font-medium">
                  {order.rider?.firstName} {order.rider?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {order.rider?.mobileNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Executor Info */}
          <div className="space-y-2">
            <h3 className="font-semibold">{t("orders.view.executor")}</h3>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div>
                <p className="font-medium">
                  {order.driver?.firstName} {order.driver?.lastName}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    {order.driver?.mobileNumber}
                  </p>
                  <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                    {order.driver?.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="col-span-2 space-y-4">
            <h3 className="font-semibold">{t("orders.view.details")}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  {t("orders.view.fields.createdAt")}
                </p>
                <p>{format(new Date(order.createdOn), "PPp")}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("orders.view.fields.startTime")}
                </p>
                <p>
                  {order.startTimestamp
                    ? format(new Date(order.startTimestamp), "PPp")
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("orders.view.fields.finishTime")}
                </p>
                <p>
                  {order.finishTimestamp
                    ? format(new Date(order.finishTimestamp), "PPp")
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("orders.view.fields.cost")}
                </p>
                <p>
                  {order.costBest} {order.currency}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("orders.view.fields.finalCost")}
                </p>
                <p>
                  {order.costAfterCoupon} {order.currency}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("orders.view.fields.status")}
                </p>
                <p>{order.status}</p>
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-2">
              <h4 className="font-medium">{t("orders.view.addresses")}</h4>
              <div className="space-y-2">
                {order.addresses.map((address, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 bg-gray-50 p-2 rounded text-gray-700"
                  >
                    <span className="text-sm bg-gray-200 px-2 py-0.5 rounded">
                      {index + 1}
                    </span>
                    <p>{address}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add OrderActions at the bottom */}
          <div className="col-span-2">
            <OrderActions />
          </div>
        </div>
      ),
    },
    {
      value: "events",
      content: (
        <div className="space-y-4 p-4 bg-transparent min-h-[400px]">
          {order.activities && order.activities.length > 0 ? (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200" />
              <div className="space-y-6">
                {order.activities
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((event) => (
                    <div key={event.id} className="relative pl-10 group">
                      <div className="absolute left-4 -top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-blue-500 group-hover:border-blue-600 transition-colors" />
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-200 transition-colors">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {event.type}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {format(new Date(event.createdAt), "HH:mm")}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {format(new Date(event.createdAt), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>{t("orders.events.noEvents")}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      value: "route",
      content: (
        <div className="w-full h-[500px] rounded-md overflow-hidden">
          {isLoaded && order?.points && (
            <>
              <MapComponent
                points={order.points as Point[]}
                isEditing={false}
                onPolygonChange={() => {}}
                onClick={() => {}}
              />
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    suppressMarkers: false,
                    polylineOptions: {
                      strokeColor: "#2563eb",
                      strokeWeight: 4,
                    },
                  }}
                />
              )}
            </>
          )}
        </div>
      ),
    },
    {
      value: "chat",
      content: (
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {order.conversations && order.conversations.length > 0 ? (
              order.conversations
                .sort(
                  (a, b) =>
                    new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
                )
                .map(renderChatMessage)
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t("orders.chat.noMessages")}
              </div>
            )}
          </div>

          <div className="border-t p-4 space-y-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("orders.chat.messagePlaceholder")}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "photos",
      content: <div className="min-h-[400px]">{/* Photos tab content */}</div>,
    },
  ];

  return (
    <MyDialog
      title={`${t("orders.view.title")} #${order.id}`}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="max-w-4xl"
    >
      <MyTabs
        tabs={tabItems}
        tabsContent={tabsContent}
        setActiveTab={() => {}}
      />
    </MyDialog>
  );
}
