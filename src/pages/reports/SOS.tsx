import { useEffect, useState } from "react";
import {
  SosListGQL,
  ViewSosGQL,
  CreateSosActivityGQL,
  type DistressSignal,
  SosActivityAction,
  SosSubscriptionDocument,
} from "../../graphql/requests";
import { Button } from "../../components/ui/button";
import { MyDialog } from "../../components/common/dialogs/MyDialog";
import { Input } from "../../components/ui/input";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import Map from "../../components/common/rare-using/Map";
import { useSubscription } from "@apollo/client";
import { useTranslation } from "react-i18next";
import MyTable from "../../components/common/table-components/MyTable";
import { ReactNode } from "react";

export const SOSPage = () => {
  const { t } = useTranslation();
  const [sosList, setSOSList] = useState<DistressSignal[]>([]);
  const [selectedSOS, setSelectedSOS] = useState<DistressSignal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityNote, setActivityNote] = useState("");
  const [activityAction, setActivityAction] = useState<SosActivityAction | "">(
    ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchSOSList = async () => {
    try {
      const response = await SosListGQL({
        paging: { limit: 10, offset: 0 },
      });
      console.log("SOS List Response:", response);
      setSOSList(response.data.distressSignals.nodes);
    } catch (error) {
      console.error("Failed to fetch SOS list:", error);
      toast.error(t("error.fetchSOSList")); // Using i18n for error message
    }
  };

  const handleViewSOS = async (id: string) => {
    try {
      const response = await ViewSosGQL({ id });
      setSelectedSOS(response.data.distressSignal);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(t("error.fetchSOSDetails")); // Using i18n for error message
    }
  };

  const handleCreateActivity = async () => {
    if (!selectedSOS || !activityNote || !activityAction) return;

    setIsLoading(true);
    try {
      await CreateSosActivityGQL({
        activity: {
          sosId: selectedSOS.id,
          action: activityAction,
          note: activityNote,
        },
      });
      toast.success(t("success.activityAdded")); // Using i18n for success message
      setActivityNote("");
      setActivityAction("");
      handleViewSOS(selectedSOS.id);
    } catch (error) {
      toast.error(t("error.addActivity")); // Using i18n for error message
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSOSList();
  }, []);

  useSubscription(SosSubscriptionDocument, {
    onData: ({ data }) => {
      console.log("SOS Subscription Response:", {
        data: data.data,
      });

      if (data.data?.sosCreated) {
        const newSOS = data.data.sosCreated;
        setSOSList((prev) => {
          // Remove any existing SOS with same ID and add new one at start
          const filteredList = prev.filter((sos) => sos.id !== newSOS.id);
          return [newSOS, ...filteredList];
        });
        toast.success(t("success.newSOSReceived")); // Using i18n for success message
      }
    },
    onError: (error) => {
      console.error("SOS Subscription error:", {
        message: error.message,
        stack: error.stack,
      });
    },
  });

  const tableRows = sosList.map((sos) => ({
    id: sos.id,
    data: [
      sos.id,
      format(new Date(sos.createdAt), "PPp"),
      sos.status,
      <Button variant="outline" size="sm" onClick={() => handleViewSOS(sos.id)}>
        {t("actions.viewDetails")}
      </Button>,
    ] as ReactNode[],
  }));

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">{t("sos.title")}</h1>
        <MyTable
          headers={[
            t("table.id"),
            t("table.createdAt"),
            t("table.status"),
            t("table.actions"),
          ]}
          rows={tableRows}
        />
      </div>

      <MyDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={t("sos.detailsTitle")} // Using i18n for dialog title
      >
        {selectedSOS && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold">{t("sos.status")}</h3>{" "}
                {/* Using i18n for status label */}
                <p>{selectedSOS.status}</p>
              </div>
              <div>
                <h3 className="font-bold">{t("sos.createdAt")}</h3>{" "}
                {/* Using i18n for created at label */}
                <p>{format(new Date(selectedSOS.createdAt), "PPp")}</p>
              </div>
            </div>

            {selectedSOS.location && (
              <div className="h-64">
                <Map
                  center={selectedSOS.location}
                  selectedLocations={[selectedSOS.location]}
                />
              </div>
            )}

            <div>
              <h3 className="font-bold mb-2">{t("sos.orderDetails")}</h3>{" "}
              {/* Using i18n for order details label */}
              {selectedSOS.order && (
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    {t("sos.orderId")}: {selectedSOS.order.id}
                  </p>{" "}
                  {/* Using i18n for order ID */}
                  <p>
                    {t("sos.orderStatus")}: {selectedSOS.order.status}
                  </p>{" "}
                  {/* Using i18n for order status */}
                  <p>
                    {t("sos.rider")}:{" "}
                    {`${selectedSOS.order.rider?.firstName || ""} ${
                      selectedSOS.order.rider?.lastName || ""
                    }`}
                  </p>
                  <p>
                    {t("sos.driver")}:{" "}
                    {`${selectedSOS.order.driver?.firstName || ""} ${
                      selectedSOS.order.driver?.lastName || ""
                    }`}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold mb-2">{t("sos.activities")}</h3>{" "}
              {/* Using i18n for activities label */}
              <div className="space-y-2">
                {selectedSOS.activities?.map((activity, index) => (
                  <div key={index} className="border p-2 rounded">
                    <p className="font-semibold">
                      {activity.action} -{" "}
                      {format(new Date(activity.createdAt), "PPp")}
                    </p>
                    <p>{activity.note}</p>
                    {activity.operator && (
                      <p className="text-sm text-gray-600">
                        {t("sos.by")}: {activity.operator.firstName}{" "}
                        {activity.operator.lastName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Input
                value={activityNote}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setActivityNote(e.target.value)
                }
                placeholder={t("sos.addActivityNote")} // Using i18n for placeholder
                className="custom-input"
              />
              <select
                value={activityAction}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setActivityAction(e.target.value as SosActivityAction)
                }
                className="custom-select"
              >
                <option value="">{t("sos.selectAction")}</option>{" "}
                {/* Using i18n for select option */}
                {Object.values(SosActivityAction).map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleCreateActivity}
                disabled={isLoading || !activityNote || !activityAction}
                className="w-full"
              >
                {isLoading ? t("sos.adding") : t("sos.addActivity")}{" "}
                {/* Using i18n for button text */}
              </Button>
            </div>
          </div>
        )}
      </MyDialog>
    </div>
  );
};

export default SOSPage;
