import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ViewFleetGQL,
  UpdateFleetGQL,
  FleetInput,
  FleetDriversGQL,
  FleetFinancialsGQL,
  FleetDriversQuery,
} from "../../graphql/requests";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FleetTransactionDialog } from "../../components/FleetTransactionDialog";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

// Add proper type for fleet financials
type FleetFinancialsData = {
  fleet: {
    transactions: {
      nodes: Array<{
        transactionTimestamp: string;
        amount: number;
        currency: string;
        action: string;
        deductType?: string | null;
        rechargeType?: string | null;
        refrenceNumber?: string | null;
        status?: string;
      }>;
      totalCount: number;
    };
    wallets: Array<{
      currency: string;
      balance: number;
    }>;
  };
  regions: {
    nodes: Array<{ currency: string }>;
  };
};

// Dummy data for fleet financials
// const dummyFleetFinancials: FleetFinancialsData = {
//   fleet: {
//     transactions: {
//       nodes: [
//         {
//           transactionTimestamp: "2024-01-15T10:30:00Z",
//           amount: 500,
//           currency: "USD",
//           action: "RECHARGE",
//           rechargeType: "BANK_TRANSFER",
//           refrenceNumber: "REF123",
//           status: "COMPLETED",
//         },
//         {
//           transactionTimestamp: "2024-01-10T15:45:00Z",
//           amount: -200,
//           currency: "USD",
//           action: "DEDUCT",
//           deductType: "WITHDRAWAL",
//           refrenceNumber: "REF124",
//           status: "COMPLETED",
//         },
//         {
//           transactionTimestamp: "2024-02-01T09:15:00Z",
//           amount: 750,
//           currency: "USD",
//           action: "RECHARGE",
//           rechargeType: "CASH",
//           refrenceNumber: "REF125",
//           status: "COMPLETED",
//         },
//         {
//           transactionTimestamp: "2024-02-05T14:20:00Z",
//           amount: 1000,
//           currency: "EUR",
//           action: "RECHARGE",
//           rechargeType: "CREDIT_CARD",
//           refrenceNumber: "REF126",
//           status: "COMPLETED",
//         },
//         {
//           transactionTimestamp: "2024-02-10T11:30:00Z",
//           amount: -300,
//           currency: "EUR",
//           action: "DEDUCT",
//           deductType: "SERVICE_FEE",
//           refrenceNumber: "REF127",
//           status: "PENDING",
//         },
//         {
//           transactionTimestamp: "2024-02-15T16:45:00Z",
//           amount: 250,
//           currency: "USD",
//           action: "RECHARGE",
//           rechargeType: "BANK_TRANSFER",
//           refrenceNumber: "REF128",
//           status: "COMPLETED",
//         },
//       ],
//       totalCount: 6,
//     },
//     wallets: [
//       {
//         currency: "USD",
//         balance: 1300,
//       },
//       {
//         currency: "EUR",
//         balance: 700,
//       },
//       {
//         currency: "GBP",
//         balance: 500,
//       },
//     ],
//   },
//   regions: {
//     nodes: [
//       {
//         currency: "USD",
//       },
//       {
//         currency: "EUR",
//       },
//       {
//         currency: "GBP",
//       },
//     ],
//   },
// };

const getChartData = (financials: FleetFinancialsData | undefined) => {
  if (!financials?.fleet?.transactions?.nodes) return null;

  // Group transactions by week
  const weeklyData = financials.fleet.transactions.nodes.reduce((acc, tx) => {
    const date = new Date(tx.transactionTimestamp);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Get start of week (Sunday)
    const weekKey = weekStart.toISOString().split("T")[0];
    acc[weekKey] = (acc[weekKey] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(weeklyData).map((date) => {
      const weekStart = new Date(date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    }),
    datasets: [
      {
        data: Object.values(weeklyData),
        backgroundColor: "#3B82F6",
      },
    ],
  };
};

export default function Fleet() {
  const { t } = useTranslation();
  const { fleetId } = useParams();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate();
  const [fleetDrivers, setFleetDrivers] = useState<
    FleetDriversQuery["drivers"]["nodes"]
  >([]);
  const [fleetFinancials, setFleetFinancials] = useState<FleetFinancialsData>();
  const [formData, setFormData] = useState<FleetInput>({
    name: "",
    address: "",
    phoneNumber: "",
    accountNumber: "",
    commissionSharePercent: 0,
    commissionShareFlat: 0,
    mobileNumber: "",
    password: "",
    userName: "",
  });
  const [errors, setErrors] = useState<any>({});

  const fetchFleetData = async () => {
    try {
      const [fleetResponse, driversResponse, financialsResponse] =
        await Promise.all([
          ViewFleetGQL({ id: fleetId! }),
          FleetDriversGQL({ id: fleetId! }),
          FleetFinancialsGQL({ id: fleetId! }),
        ]);
      console.log(fleetResponse, driversResponse, financialsResponse);
      if (fleetResponse.data?.fleet) {
        setFormData({
          name: fleetResponse.data.fleet.name,
          address: fleetResponse.data.fleet.address || "",
          phoneNumber: fleetResponse.data.fleet.phoneNumber,
          accountNumber: fleetResponse.data.fleet.accountNumber,
          commissionSharePercent:
            fleetResponse.data.fleet.commissionSharePercent,
          commissionShareFlat: fleetResponse.data.fleet.commissionShareFlat,
          mobileNumber: fleetResponse.data.fleet.mobileNumber,
          password: fleetResponse.data.fleet.password || "",
          userName: fleetResponse.data.fleet.userName || "",
        });
      }

      if (driversResponse.data?.drivers.nodes) {
        setFleetDrivers(driversResponse.data.drivers.nodes);
      }

      if (financialsResponse.data) {
        setFleetFinancials(financialsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching fleet data:", error);
      // TODO: Add proper error handling
    }
  };

  useEffect(() => {
    if (fleetId) {
      fetchFleetData();
    }
  }, [fleetId]);

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.accountNumber)
      newErrors.accountNumber = "Account number is required";
    if (
      formData.commissionSharePercent < 0 ||
      formData.commissionSharePercent > 100
    ) {
      newErrors.commissionSharePercent =
        "Commission percentage must be between 0 and 100";
    }
    if (formData.commissionShareFlat < 0) {
      newErrors.commissionShareFlat = "Commission flat rate must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await UpdateFleetGQL({
      id: fleetId!,
      update: formData,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FleetInput
  ) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderFleetDetails = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name">{t("fleet.fields.name")}</label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange(e, "name")}
            className={errors.name ? "border-red-500" : ""}
            disabled={!editing}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="address">{t("fleet.fields.address")}</label>
          <Input
            id="address"
            value={formData.address || ""}
            onChange={(e) => handleInputChange(e, "address")}
            className={errors.address ? "border-red-500" : ""}
            disabled={!editing}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phoneNumber">{t("fleet.fields.phoneNumber")}</label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={(e) => handleInputChange(e, "phoneNumber")}
            className={errors.phoneNumber ? "border-red-500" : ""}
            disabled={!editing}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="accountNumber">
            {t("fleet.fields.accountNumber")}
          </label>
          <Input
            id="accountNumber"
            value={formData.accountNumber || ""}
            onChange={(e) => handleInputChange(e, "accountNumber")}
            className={errors.accountNumber ? "border-red-500" : ""}
            disabled={!editing}
          />
          {errors.accountNumber && (
            <p className="text-sm text-red-500">{errors.accountNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="commissionSharePercent">
            {t("fleet.fields.commissionPercent")}
          </label>
          <Input
            id="commissionSharePercent"
            type="number"
            value={formData.commissionSharePercent || 0}
            onChange={(e) => handleInputChange(e, "commissionSharePercent")}
            className={errors.commissionSharePercent ? "border-red-500" : ""}
            disabled={!editing}
          />
          {errors.commissionSharePercent && (
            <p className="text-sm text-red-500">
              {errors.commissionSharePercent}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="commissionShareFlat">
            {t("fleet.fields.commissionFlat")}
          </label>
          <Input
            id="commissionShareFlat"
            type="number"
            value={formData.commissionShareFlat || 0}
            onChange={(e) => handleInputChange(e, "commissionShareFlat")}
            className={errors.commissionShareFlat ? "border-red-500" : ""}
            disabled={!editing}
          />
          {errors.commissionShareFlat && (
            <p className="text-sm text-red-500">{errors.commissionShareFlat}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" onClick={() => setEditing((prev) => !prev)}>
          {editing ? t("common.save") : t("common.edit")}
        </Button>
      </div>
    </form>
  );

  const renderDrivers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-200">Fleet Drivers</h3>
        <Button className="text-gray-200 bg-gray-900 border-gray-800 hover:bg-gray-800">
          {t("fleet.drivers.add")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-gray-800">
            <TableHead className="text-gray-400">
              {t("fleet.drivers.name")}
            </TableHead>
            <TableHead className="text-gray-400">
              {t("fleet.drivers.status")}
            </TableHead>
            <TableHead className="text-gray-400">
              {t("common.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fleetDrivers?.map((driver) => (
            <TableRow
              key={driver.id}
              className="hover:bg-gray-900 border-gray-800"
            >
              <TableCell className="font-medium">
                <div>
                  <div className="text-gray-200">
                    {driver.firstName} {driver.lastName}
                  </div>
                  <div className="text-sm text-gray-400">
                    {driver.mobileNumber}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate(`/control-panel/drivers/${driver.id}`)
                  }
                >
                  {t("common.view")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!fleetDrivers?.length && (
            <TableRow className="hover:bg-transparent border-gray-800">
              <TableCell
                colSpan={5}
                className="text-center hover:bg-transparent text-gray-400 py-14"
              >
                {t("fleet.drivers.noDrivers")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderFinancials = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-200">
          Fleet Financials
        </h3>
        <FleetTransactionDialog
          fleetId={fleetId!}
          currencies={
            fleetFinancials?.regions?.nodes?.map((n) => n.currency) || []
          }
          onSuccess={fetchFleetData}
        />
      </div>

      {/* Wallets Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fleetFinancials?.fleet?.wallets?.map((wallet, index) => (
          <Card key={index} className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                {wallet.currency} {t("fleet.financials.balance")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {wallet.balance.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      {getChartData(fleetFinancials) && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">
              {t("fleet.financials.revenue")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={getChartData(fleetFinancials)!}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800">
            {t("fleet.financials.transactions")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-200">
                <TableHead className="text-gray-600">
                  {t("common.date")}
                </TableHead>
                <TableHead className="text-gray-600">
                  {t("common.type")}
                </TableHead>
                <TableHead className="text-gray-600">
                  {t("common.amount")}
                </TableHead>
                <TableHead className="text-gray-600">
                  {t("common.status")}
                </TableHead>
                <TableHead className="text-gray-600">
                  {t("common.reference")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fleetFinancials?.fleet?.transactions?.nodes?.length &&
              fleetFinancials?.fleet?.transactions?.nodes?.length > 0 ? (
                fleetFinancials?.fleet?.transactions?.nodes.map((tx) => (
                  <TableRow
                    key={tx.refrenceNumber}
                    className="hover:bg-gray-100 border-gray-200"
                  >
                    <TableCell className="text-gray-800">
                      {new Date(tx.transactionTimestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-800">
                      <div className="flex flex-col">
                        <span>{tx.action}</span>
                        <span className="text-sm text-gray-600">
                          {tx.deductType || tx.rechargeType}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={
                        tx.amount > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount.toLocaleString()} {tx.currency}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-100">
                        {tx.status || "Completed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {tx.refrenceNumber || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent border-gray-200">
                  <TableCell
                    colSpan={5}
                    className="text-center hover:bg-transparent text-gray-400 py-14"
                  >
                    {t("fleet.financials.noTransactions")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Tabs defaultValue="details" className="w-full">
      <div className="container mx-auto p-6">
        <Card className="bg-background border-none text-foreground card-shape">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-bold text-gray-400">
              Fleet Management
            </CardTitle>
          </CardHeader>

          <CardContent className="bg-transparent border-transparent">
            <TabsList className="grid grid-cols-3 w-1/3 mb-8 bg-transparent">
              <TabsTrigger value="details" className="custom-tabs">
                Details
              </TabsTrigger>
              <TabsTrigger value="drivers" className="custom-tabs">
                Drivers
              </TabsTrigger>
              <TabsTrigger value="financials" className="custom-tabs">
                Financials
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">{renderFleetDetails()}</TabsContent>
            <TabsContent value="drivers">{renderDrivers()}</TabsContent>
            <TabsContent value="financials">{renderFinancials()}</TabsContent>
          </CardContent>
        </Card>
      </div>
    </Tabs>
  );
}
