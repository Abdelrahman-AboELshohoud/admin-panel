import {
  Order,
  ViewOrderGQL,
  CancelOrderGQL,
  OrderStatus,
  OrderCancelReasonListGQL,
  UpdateOrderCancelReasonGQL,
  CreateOrderCancelReasonGQL,
  OrderCancelReason,
  AnnouncementUserType,
} from "../../graphql/requests";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Switch } from "../../components/ui/switch";

import { FaComments } from "react-icons/fa";
import MapWithClusters from "../../components/common/Map";

interface CancelOrderDialog {
  isOpen: boolean;
  mode: "cancel" | "create" | "edit";
  selectedReason?: OrderCancelReason;
  reason: {
    title: string | undefined;
    comment: string | undefined;
    userType: AnnouncementUserType;
    isEnabled: boolean;
  };
}

interface ChatMessage {
  sentAt: string;
  sentByDriver: boolean;
  status: string;
  content: string;
}

export default function ViewOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [cancelReasons, setCancelReasons] = useState<OrderCancelReason[]>([]);
  const [cancelDialog, setCancelDialog] = useState<CancelOrderDialog>({
    isOpen: false,
    mode: "cancel",
    reason: {
      title: "",
      comment: "",
      userType: AnnouncementUserType.Driver,
      isEnabled: true,
    },
  });
  const [hasAccess, setHasAccess] = useState(true);

  const fetchOrder = async () => {
    const response = await ViewOrderGQL({
      id: orderId!,
    });
    console.log(response);
    if (response.data?.order) {
      setOrder(response.data.order);
    } else {
      setHasAccess(false);
    }
  };

  const fetchCancelReasons = async () => {
    try {
      const response = await OrderCancelReasonListGQL({});
      if (response.data?.orderCancelReasons?.nodes) {
        setCancelReasons(response.data.orderCancelReasons.nodes);
      } else {
        setHasAccess(false);
      }
      console.log(response);
    } catch (error) {
      console.error("Error fetching cancel reasons:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchCancelReasons();
  }, [orderId]);

  const handleCancelOrder = async () => {
    try {
      if (!order || !cancelDialog.reason.title || !cancelDialog.reason.userType)
        return;

      // First update the cancel reason
      await UpdateOrderCancelReasonGQL({
        id: order.id,
        update: {
          isEnabled: true,
          title: cancelDialog.reason.title,
          userType: cancelDialog.reason.userType,
        },
      });

      // Then cancel the order
      await CancelOrderGQL({
        orderId: order.id,
      });

      await fetchOrder();
      setCancelDialog((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleCreateReason = async () => {
    try {
      await CreateOrderCancelReasonGQL({
        input: {
          title: cancelDialog.reason.title!,
          isEnabled: cancelDialog.reason.isEnabled,
          userType: cancelDialog.reason.userType,
        },
      });
      await fetchCancelReasons();
      setCancelDialog((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error("Error creating cancel reason:", error);
    }
  };

  const handleUpdateReason = async () => {
    try {
      if (!cancelDialog.selectedReason?.id) return;

      await UpdateOrderCancelReasonGQL({
        id: cancelDialog.selectedReason.id,
        update: {
          title: cancelDialog.reason.title!,
          isEnabled: cancelDialog.reason.isEnabled,
          userType: cancelDialog.reason.userType,
        },
      });
      await fetchCancelReasons();
      setCancelDialog((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error("Error updating cancel reason:", error);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants = {
      [OrderStatus.Finished]: "success",
      [OrderStatus.DriverCanceled]: "destructive",
      [OrderStatus.RiderCanceled]: "destructive",
      [OrderStatus.Started]: "default",
      [OrderStatus.Arrived]: "default",
      [OrderStatus.Booked]: "default",
      [OrderStatus.DriverAccepted]: "default",
      [OrderStatus.Expired]: "destructive",
      [OrderStatus.Found]: "default",
      [OrderStatus.NoCloseFound]: "destructive",
      [OrderStatus.NotFound]: "destructive",
      [OrderStatus.Requested]: "default",
      [OrderStatus.WaitingForPostPay]: "default",
      [OrderStatus.WaitingForPrePay]: "default",
      [OrderStatus.WaitingForReview]: "default",
    } as const;
    return (
      <Badge variant={variants[status] ? "outline" : variants[status]}>
        {t(`orders.status.${status.toLowerCase()}`)}
      </Badge>
    );
  };

  const renderChatMessage = (message: ChatMessage) => {
    return (
      <div
        key={`${message.sentAt}-${message.content}`}
        className={`flex bg-transparent ${
          message.sentByDriver ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            message.sentByDriver
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <div className="text-sm font-semibold mb-1">
            {message.sentByDriver
              ? order?.driver?.firstName
              : order?.rider?.firstName}{" "}
            {message.sentByDriver
              ? order?.driver?.lastName
              : order?.rider?.lastName}
          </div>
          <div>{message.content}</div>
          <div className="text-xs mt-1 opacity-70">
            {new Date(message.sentAt).toLocaleString()}
          </div>
          {message.status && (
            <div className="text-xs italic opacity-50">
              {t(`chat.status.${message.status.toLowerCase()}`)}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-semibold text-gray-400">
            {t("viewOrders.noOrders")}
          </h3>
          <p className="text-gray-500 max-w-md">
            {t("viewOrders.noOrdersDescription")}
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex-1 p-6 flex flex-col h-[80vh] justify-center items-center">
        <div className="text-center text-zinc-100 text-4xl font-bold">
          {t("errors.noAccess")}
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6">
      <Card className="card-shape text-gray-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {t("viewOrders.orderDetails")}
          </CardTitle>
          <div className="flex gap-2">
            {order.status !== OrderStatus.Finished && (
              <Button
                variant="destructive"
                onClick={() =>
                  setCancelDialog((prev) => ({
                    ...prev,
                    isOpen: true,
                    mode: "cancel",
                  }))
                }
              >
                {t("orders.actions.cancel")}
              </Button>
            )}
            <Button
              variant="outline"
              className="text-gray-100 bg-gray-800 border-none"
              onClick={() =>
                setCancelDialog((prev) => ({
                  ...prev,
                  isOpen: true,
                  mode: "create",
                  reason: {
                    title: "",
                    comment: "",
                    userType: AnnouncementUserType.Driver,
                    isEnabled: true,
                  },
                }))
              }
            >
              {t("orders.cancel.addReason")}
            </Button>
            <Button
              variant="outline"
              className="text-gray-100 bg-gray-800 border-none"
              onClick={() =>
                setCancelDialog((prev) => ({
                  ...prev,
                  isOpen: true,
                  mode: "edit",
                  reason: {
                    title: "",
                    comment: "",
                    userType: AnnouncementUserType.Driver,
                    isEnabled: true,
                  },
                }))
              }
            >
              {t("orders.cancel.updateReasons")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("viewOrders.id")}
              </p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("viewOrders.status")}
              </p>
              {getStatusBadge(order.status)}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("viewOrders.created")}
              </p>
              <p className="font-medium">
                {new Date(order.createdOn).toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("viewOrders.cost")}
              </p>
              <p className="font-medium">
                {order.costBest} {order.currency}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("viewOrders.finalCost")}
              </p>
              <p className="font-medium">
                {order.costAfterCoupon} {order.currency}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {t("viewOrders.addresses")}
            </h3>
            <ul className="space-y-2">
              {order.addresses &&
                order.addresses.length > 0 &&
                order.addresses.map((address, index) => (
                  <li key={index} className="bg-secondary p-2 rounded">
                    {address}
                  </li>
                ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {t("viewOrders.rider")}
            </h3>
            {order.rider ? (
              <Card className="bg-transparent border-none text-gray-100">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p>
                      <span className="text-muted-foreground">
                        {t("viewOrders.name")}:{" "}
                      </span>
                      {order.rider.firstName} {order.rider.lastName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        {t("viewOrders.mobile")}:{" "}
                      </span>
                      {order.rider.mobileNumber}
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        {t("viewOrders.status")}:{" "}
                      </span>
                      {order.rider.status}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground">{t("viewOrders.noRider")}</p>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {t("viewOrders.driver")}
            </h3>
            {order.driver ? (
              <Card className="bg-transparent border-none text-gray-100">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p>
                      <span className="text-muted-foreground">
                        {t("viewOrders.name")}:{" "}
                      </span>
                      {order.driver.firstName} {order.driver.lastName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        {t("viewOrders.mobile")}:{" "}
                      </span>
                      {order.driver.mobileNumber}
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        {t("viewOrders.status")}:{" "}
                      </span>
                      {order.driver.status}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground">
                {t("viewOrders.noDriver")}
              </p>
            )}
          </div>

          <Dialog
            open={cancelDialog.isOpen}
            onOpenChange={(open) =>
              setCancelDialog((prev) => ({
                ...prev,
                isOpen: open,
                reason: open
                  ? prev.reason
                  : {
                      title: "",
                      comment: "",
                      userType: AnnouncementUserType.Driver,
                      isEnabled: true,
                    },
              }))
            }
          >
            <DialogContent className="flex items-center flex-col py-10">
              <DialogHeader>
                <DialogTitle>
                  {cancelDialog.mode === "cancel"
                    ? t("orders.cancel.title")
                    : cancelDialog.mode === "create"
                    ? t("orders.cancel.createReason")
                    : t("orders.cancel.editReason")}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 w-fit">
                <Select
                  value={cancelDialog.reason.userType}
                  onValueChange={(value: AnnouncementUserType) =>
                    setCancelDialog((prev) => ({
                      ...prev,
                      reason: {
                        ...prev.reason,
                        userType: value,
                      },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("orders.cancel.selectUserType")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AnnouncementUserType.Driver}>
                      {t("orders.cancel.driver")}
                    </SelectItem>
                    <SelectItem value={AnnouncementUserType.Rider}>
                      {t("orders.cancel.rider")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                {cancelDialog.mode !== "cancel" && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="reason-enabled"
                      checked={cancelDialog.reason.isEnabled}
                      onCheckedChange={(checked) =>
                        setCancelDialog((prev) => ({
                          ...prev,
                          reason: { ...prev.reason, isEnabled: checked },
                        }))
                      }
                    />
                    <label htmlFor="reason-enabled">
                      {t("common.enabled")}
                    </label>
                  </div>
                )}

                {cancelDialog.mode === "cancel" ? (
                  <Select
                    value={cancelDialog.reason.title}
                    onValueChange={(value: string) => {
                      console.log(value);
                      setCancelDialog((prev) => ({
                        ...prev,
                        reason: {
                          ...prev.reason,
                          title: value,
                        },
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("orders.cancel.selectReason")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cancelReasons &&
                        cancelReasons.length > 0 &&
                        cancelReasons.map((reason) => (
                          <SelectItem key={reason.id} value={reason.title}>
                            {t(`${reason.title}`)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <input
                    className="bg-transparent border-gray-500 border w-full text-black p-2 rounded-md placeholder:text-gray-600"
                    placeholder={t("orders.cancel.enterReason")}
                    value={cancelDialog.reason.title}
                    onChange={(e) =>
                      setCancelDialog((prev) => ({
                        ...prev,
                        reason: {
                          ...prev.reason,
                          title: e.target.value,
                        },
                      }))
                    }
                  />
                )}
                {cancelDialog.mode === "cancel" && (
                  <Textarea
                    placeholder={t("orders.cancel.commentPlaceholder")}
                    value={cancelDialog.reason.comment}
                    onChange={(e) =>
                      setCancelDialog((prev) => ({
                        ...prev,
                        reason: { ...prev.reason, comment: e.target.value },
                      }))
                    }
                  />
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCancelDialog((prev) => ({
                        ...prev,
                        isOpen: false,
                      }))
                    }
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={
                      cancelDialog.mode === "cancel"
                        ? handleCancelOrder
                        : cancelDialog.mode === "create"
                        ? handleCreateReason
                        : handleUpdateReason
                    }
                    disabled={!cancelDialog.reason.title}
                  >
                    {cancelDialog.mode === "cancel"
                      ? t("orders.cancel.confirm")
                      : cancelDialog.mode === "create"
                      ? t("common.create")
                      : t("common.update")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("viewOrders.route")}
            </h3>
            <MapWithClusters
              selectedLocations={order.points}
              setSelectedLocations={() => {}}
              center={order.points?.[0] || { lat: 0, lng: 40 }}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t("viewOrders.chat")}</h3>
              <Button
                className="text-gray-100 bg-gray-800 border-none"
                variant="outline"
                size="sm"
                onClick={() => setShowChat(!showChat)}
              >
                <FaComments className="mr-2" />
                {showChat ? t("common.hide") : t("common.show")}
              </Button>
            </div>

            {showChat && (
              <div className="bg-transparent rounded-lg p-4 max-h-[400px] overflow-y-auto">
                {order?.conversations &&
                  order?.conversations.length > 0 &&
                  order?.conversations.map(renderChatMessage)}
                {(!order?.conversations ||
                  order.conversations.length === 0) && (
                  <div className="text-center text-gray-400 py-4 bg-transparent">
                    {t("viewOrders.noMessages")}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
