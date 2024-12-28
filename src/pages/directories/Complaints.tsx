import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
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
import { MyDialog } from "../../components/common/MyDialog";

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
  //   const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] =
    useState<ComplaintDetails | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Update complaint status
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

  // Render pagination
  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          onClick={() => setCurrentPage(i)}
          className="w-10 h-10"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          {t("common.previous")}
        </Button>
        {pages}
        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
        >
          {t("common.next")}
        </Button>
      </div>
    );
  };

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

      {/* Complaints Table */}
      <div className="card-shape">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-transparent">
              <TableHead>{t("complaints.table.date")}</TableHead>
              <TableHead>{t("complaints.table.subject")}</TableHead>
              <TableHead>{t("complaints.table.status")}</TableHead>
              <TableHead>{t("complaints.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-transparent h-96">
                <TableCell colSpan={4} className="text-center">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : complaints.length > 0 ? (
              complaints.map((complaint) => (
                <TableRow
                  key={complaint.id}
                  className="hover:bg-transparent border-transparent"
                >
                  <TableCell>
                    {format(new Date(complaint.inscriptionTimestamp), "PPp")}
                  </TableCell>
                  <TableCell>{complaint.subject}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        complaint.status === ComplaintStatus.Submitted
                          ? "bg-yellow-500/20 text-yellow-500"
                          : complaint.status ===
                            ComplaintStatus.UnderInvestigation
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-green-500/20 text-green-500"
                      }`}
                    >
                      {t(`complaints.status.${complaint.status.toLowerCase()}`)}
                    </span>
                  </TableCell>
                  <TableCell>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent h-96">
                <TableCell colSpan={4} className="text-center">
                  {t("complaints.noComplaints")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {complaints.length > 0 && renderPagination()}
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
                    {selectedComplaint.activities.map((activity, index) => (
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
