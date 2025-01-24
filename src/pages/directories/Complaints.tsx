import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { toast } from "react-hot-toast";
import {
  ComplaintsListGQL,
  ViewComplaintGQL,
  UpdateComplaintStatusGQL,
  ComplaintSubscriptionGQL,
  type Complaint,
  ComplaintStatus,
} from "../../graphql/requests";
import { format } from "date-fns";
import { MyDialog } from "../../components/common/dialogs/MyDialog";
import Pagination from "../../components/common/table-components/Pagination";
import MyTable from "../../components/common/table-components/MyTable";

const ITEMS_PER_PAGE = 10;

export default function Complaints() {
  const { t } = useTranslation();
  //   const navigate = useNavigate();
  const [_complaints, setComplaints] = useState<Complaint[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [_isLoading, setIsLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasAccess, setHasAccess] = useState(true);

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const response = await ComplaintsListGQL({
        paging: {
          offset: (currentPage - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
        },
      });
      console.log("Complaints response:", response);

      if (response.data?.complaints) {
        setComplaints(response.data.complaints.nodes);
        setTotalCount(response.data.complaints.totalCount);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error(t("complaints.errors.fetchFailed"));
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  const ComplaintSub = async () => {
    const subscription = await ComplaintSubscriptionGQL();
    console.log("Complaint subscription:", subscription);
    console.log("Mock Complaint subscription");
  };

  // Fetch complaints on page change or filter change
  ComplaintSub();
  useEffect(() => {
    fetchComplaints();
  }, [currentPage, statusFilter]);

  // View complaint details
  const handleViewDetails = async (id: string) => {
    try {
      const response = await ViewComplaintGQL({ id });
      console.log("View complaint response:", response);
      if (response.data?.complaint) {
        setSelectedComplaint(response.data.complaint);
        setShowDetailsDialog(true);
      }
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      toast.error(t("complaints.errors.fetchDetailsFailed"));
    }
  };

  const handleUpdateStatus = async (id: string, status: ComplaintStatus) => {
    try {
      const response = await UpdateComplaintStatusGQL({
        id,
        status,
      });
      console.log("Update status response:", response);
      toast.success(t("complaints.success.statusUpdated"));
      fetchComplaints();
    } catch (error) {
      console.error("Error updating complaint status:", error);
      toast.error(t("complaints.errors.updateStatusFailed"));
    }
  };

  if (!hasAccess) {
    return (
      <div className="flex-1 p-6 flex flex-col h-[80vh] justify-center items-center">
        <div className="text-center text-zinc-100 text-4xl font-bold">
          {t("errors.noAccess")}
        </div>
      </div>
    );
  }

  const headers = [
    t("complaints.table.date"),
    t("complaints.table.subject"),
    t("complaints.table.status"),
    t("complaints.table.actions"),
  ];

  const mockComplaints = [
    {
      id: "1",
      inscriptionTimestamp: "2023-12-01T10:30:00Z",
      subject: "Late Delivery",
      status: ComplaintStatus.Submitted,
    },
    {
      id: "2",
      inscriptionTimestamp: "2023-12-01T11:45:00Z",
      subject: "Wrong Order",
      status: ComplaintStatus.UnderInvestigation,
    },
    {
      id: "3",
      inscriptionTimestamp: "2023-12-01T13:15:00Z",
      subject: "Driver Behavior",
      status: ComplaintStatus.Resolved,
    },
  ];

  const rows = mockComplaints?.map((complaint) => ({
    id: complaint.id,
    data: [
      format(new Date(complaint.inscriptionTimestamp), "PPp"),
      complaint.subject,
      <span
        className={`px-2 py-1 rounded-full text-sm ${
          complaint.status === ComplaintStatus.Submitted
            ? "bg-yellow-500/20 text-yellow-500"
            : complaint.status === ComplaintStatus.UnderInvestigation
            ? "bg-blue-500/20 text-blue-500"
            : "bg-green-500/20 text-green-500"
        }`}
      >
        {t(`complaints.status.${complaint.status.toLowerCase()}`)}
      </span>,
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-gray-500 hover:text-gray-600"
          onClick={() => handleViewDetails(complaint.id)}
        >
          {t("common.view")}
        </Button>
        <Select
          value={complaint.status}
          onValueChange={(value: ComplaintStatus) =>
            handleUpdateStatus(complaint.id, value)
          }
        >
          <SelectTrigger className="custom-input w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ComplaintStatus).map((status) => (
              <SelectItem
                key={status}
                value={status}
                onClick={() => handleUpdateStatus(complaint.id, status)}
              >
                {t(`complaints.status.${status.toLowerCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>,
    ],
  }));

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select
          value={statusFilter}
          onValueChange={(value: ComplaintStatus | "") =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="custom-input w-[200px]">
            <SelectValue placeholder={t("complaints.filters.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("complaints.filters.allStatuses")}
            </SelectItem>
            {Object.values(ComplaintStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {t(`complaints.status.${status.toLowerCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder={t("complaints.filters.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="custom-input w-[300px]"
        />
      </div>

      <MyTable headers={headers} rows={rows} />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / ITEMS_PER_PAGE)}
        onPageChange={setCurrentPage}
      />

      <MyDialog
        isOpen={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        title={t("complaints.details.title")}
        showCloseButton={false}
        className="min-w-[50vw]"
      >
        {selectedComplaint && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-medium text-xl mb-4">
                    {t("complaints.details.subject")}
                  </h3>
                  <p>{selectedComplaint.subject}</p>
                </div>
                <div>
                  <h3 className="font-medium text-xl mb-4">
                    {t("complaints.details.content")}
                  </h3>
                  <p className="text-gray-300">{selectedComplaint.content}</p>
                </div>
                <div>
                  <h3 className="font-medium text-xl mb-4">
                    {t("complaints.details.time")}
                  </h3>
                  <p className="text-gray-300">
                    {selectedComplaint.inscriptionTimestamp &&
                    !isNaN(
                      new Date(selectedComplaint.inscriptionTimestamp).getTime()
                    )
                      ? format(
                          new Date(selectedComplaint.inscriptionTimestamp),
                          "PPpp"
                        )
                      : t("complaints.details.invalidDate")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {selectedComplaint.order && (
                  <div>
                    <h3 className="font-medium text-xl mb-4">
                      {t("complaints.details.order")}
                    </h3>
                    <div className="flex flex-col gap-3">
                      <p className="text-gray-300">
                        {t("complaints.details.orderId")}:{" "}
                        {selectedComplaint.order.id}
                      </p>
                      <p className="text-gray-300">
                        {t("complaints.details.orderStatus")}:{" "}
                        {selectedComplaint.order.status}
                      </p>
                      <p className="text-gray-300">
                        {t("complaints.details.createdOn")}:{" "}
                        {selectedComplaint.order.createdOn &&
                        !isNaN(
                          new Date(selectedComplaint.order.createdOn).getTime()
                        )
                          ? format(
                              new Date(selectedComplaint.order.createdOn),
                              "Ppp"
                            )
                          : t("complaints.details.invalidDate")}
                      </p>
                      <p className="text-gray-300">
                        {t("complaints.details.cost")}:{" "}
                        {selectedComplaint.order.costAfterCoupon}{" "}
                        {selectedComplaint.order.currency}
                      </p>
                      <p className="text-gray-300">
                        {t("complaints.details.addresses")}:{" "}
                        {selectedComplaint.order.addresses.join(" → ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6">
                {selectedComplaint.order?.rider && (
                  <div>
                    <h3 className="font-medium text-xl mb-4">
                      {t("complaints.details.rider")}
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        {t("complaints.details.riderId")}:{" "}
                        {selectedComplaint.order.rider.id}
                      </p>
                      <p className="text-gray-300">
                        {t("complaints.details.riderName")}:{" "}
                        {`${selectedComplaint.order.rider.firstName} ${selectedComplaint.order.rider.lastName}`}
                      </p>
                      <p className="text-gray-300">
                        {t("complaints.details.riderMobile")}:{" "}
                        {selectedComplaint.order.rider.mobileNumber}
                      </p>
                      <p className="text-gray-300">
                        {t("complaints.details.riderStatus")}:{" "}
                        {selectedComplaint.order.rider.status}
                      </p>
                    </div>
                  </div>
                )}

                {selectedComplaint.order?.driver && (
                  <div>
                    <h3 className="font-medium text-xl mb-4">
                      {t("complaints.details.driver")}
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        {t("complaints.details.driverId")}:{" "}
                        {selectedComplaint.order.driver.id}
                      </p>
                      <p className="text-gray-300">
                        {t("complaints.details.driverName")}:{" "}
                        {`${selectedComplaint.order.driver.firstName} ${selectedComplaint.order.driver.lastName}`}
                      </p>
                      <p className="text-gray-300">
                        {t("complaints.details.driverMobile")}:{" "}
                        {selectedComplaint.order.driver.mobileNumber}
                      </p>
                      <p className="text-gray-300">
                        {t("complaints.details.driverStatus")}:{" "}
                        {selectedComplaint.order.driver.status}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {selectedComplaint.activities &&
              selectedComplaint.activities.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {selectedComplaint.activities.map((activity, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded">
                      <p className="text-gray-300">
                        {t(
                          `complaints.activities.${activity.type.toLowerCase()}`
                        )}
                      </p>
                      {activity.comment && (
                        <p className="mt-2">{activity.comment}</p>
                      )}
                      {activity.actor && (
                        <p className="text-sm text-gray-400 mt-2">
                          {t("complaints.details.by")}{" "}
                          {`${activity.actor.firstName} ${activity.actor.lastName}`}
                        </p>
                      )}
                      {activity.assignedTo && (
                        <p className="text-sm text-gray-400">
                          {t("complaints.details.assignedTo")}{" "}
                          {`${activity.assignedTo.firstName} ${activity.assignedTo.lastName}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}
        <Button
          className="w-fit mt-8 mx-auto"
          onClick={() => setShowDetailsDialog(false)}
        >
          {t("common.close")}
        </Button>
      </MyDialog>
    </div>
  );
}
