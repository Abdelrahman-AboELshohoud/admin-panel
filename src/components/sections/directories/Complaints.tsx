import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { toast } from "react-hot-toast";
import {
  ComplaintsListGQL,
  ViewComplaintGQL,
  UpdateComplaintStatusGQL,
  ComplaintSubscriptionGQL,
  type Complaint,
  ComplaintStatus,
} from "../../../graphql/requests";
import { format } from "date-fns";
import { MyDialog } from "../../common/dialogs/MyDialog";
import Pagination from "../../common/table-components/Pagination";
import MyTable from "../../common/table-components/MyTable";

const ITEMS_PER_PAGE = 10;

interface ComplaintDetails extends Omit<Complaint, "activities" | "order"> {
  order?: {
    id: string;
    status: string;
    addresses: string[];
    costBest: number;
    costAfterCoupon: number;
    currency: string;
    rider?: {
      firstName?: string;
      lastName?: string;
      mobileNumber: string;
    };
    driver?: {
      firstName?: string;
      lastName?: string;
      mobileNumber: string;
    };
  };
  activities?: Array<{
    type: string;
    comment?: string;
    actor?: {
      firstName?: string;
      lastName?: string;
    };
    assignedTo?: {
      firstName?: string;
      lastName?: string;
    };
  }>;
}

export default function Complaints() {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] =
    useState<ComplaintDetails | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");

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
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error(t("complaints.errors.fetchFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const ComplaintSub = async () => {
    const subscription = await ComplaintSubscriptionGQL();
    console.log("Complaint subscription:", subscription);
  };

  ComplaintSub();
  useEffect(() => {
    fetchComplaints();
  }, [currentPage, statusFilter]);

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

  const headers = [
    t("complaints.table.date"),
    t("complaints.table.subject"),
    t("complaints.table.status"),
    t("complaints.table.actions"),
  ];

  const tableRows = complaints.map((complaint) => ({
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
              <SelectItem key={status} value={status}>
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

      <div className="card-shape">
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            {t("common.loading")}
          </div>
        ) : complaints.length > 0 ? (
          <MyTable headers={headers} rows={tableRows} />
        ) : (
          <div className="h-96 flex items-center justify-center">
            {t("complaints.noComplaints")}
          </div>
        )}

        {complaints.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Complaint Details Dialog */}
      <MyDialog
        isOpen={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        title={t("complaints.details.title")}
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">
                {t("complaints.details.subject")}
              </h3>
              <p>{selectedComplaint.subject}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">
                {t("complaints.details.content")}
              </h3>
              <p>{selectedComplaint.content}</p>
            </div>

            {selectedComplaint.order && (
              <div>
                <h3 className="font-medium mb-2">
                  {t("complaints.details.order")}
                </h3>
                <div className="space-y-2">
                  <p>
                    {t("complaints.details.orderStatus")}:{" "}
                    {selectedComplaint.order.status}
                  </p>
                  <p>
                    {t("complaints.details.cost")}:{" "}
                    {selectedComplaint.order.costAfterCoupon}{" "}
                    {selectedComplaint.order.currency}
                  </p>
                  <p>
                    {t("complaints.details.addresses")}:{" "}
                    {selectedComplaint.order.addresses.join(" → ")}
                  </p>
                </div>
              </div>
            )}

            {selectedComplaint.activities &&
              selectedComplaint.activities.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">
                    {t("complaints.details.activities")}
                  </h3>
                  <div className="space-y-2">
                    {selectedComplaint.activities &&
                      selectedComplaint.activities.length > 0 &&
                      selectedComplaint.activities.map((activity, index) => (
                        <div key={index} className="p-2 bg-gray-800 rounded">
                          <p>
                            {t(
                              `complaints.activities.${activity.type.toLowerCase()}`
                            )}
                          </p>
                          {activity.comment && <p>{activity.comment}</p>}
                          {activity.actor && (
                            <p className="text-sm text-gray-400">
                              {t("complaints.details.by")}{" "}
                              {`${activity.actor.firstName} ${activity.actor.lastName}`}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </MyDialog>
    </div>
  );
}
