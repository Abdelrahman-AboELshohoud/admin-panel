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
import MyTable from "../../components/common/table-components/MyTable";
import MyTabs from "../../components/common/MyTabs";

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
  const navigate = useNavigate();
  const [fleetDrivers, setFleetDrivers] = useState<
    FleetDriversQuery["drivers"]["nodes"]
  >([]);
  const [fleetFinancials, setFleetFinancials] = useState<FleetFinancialsData>();
  const [_activeTab, setActiveTab] = useState("details");
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

    if (!formData.name) newErrors.name = t("fleet.errors.nameRequired");
    if (!formData.address)
      newErrors.address = t("fleet.errors.addressRequired");
    if (!formData.phoneNumber)
      newErrors.phoneNumber = t("fleet.errors.phoneRequired");
    if (!formData.accountNumber)
      newErrors.accountNumber = t("fleet.errors.accountRequired");
    if (
      formData.commissionSharePercent < 0 ||
      formData.commissionSharePercent > 100
    ) {
      newErrors.commissionSharePercent = t(
        "fleet.errors.commissionPercentRange"
      );
    }
    if (formData.commissionShareFlat < 0) {
      newErrors.commissionShareFlat = t("fleet.errors.commissionFlatPositive");
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
      <h3 className="text-xl font-semibold text-gray-200">
        {t("fleet.fields.details")}
      </h3>
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
        {editing ? (
          <Button
            className="bg-yellow-500 border-yellow-600 hover:bg-yellow-600"
            type="submit"
            onClick={() => setEditing((prev) => !prev)}
          >
            {t("common.save")}
          </Button>
        ) : (
          <Button
            className="bg-gray-900 border-gray-800 hover:bg-gray-800"
            type="submit"
            onClick={() => setEditing((prev) => !prev)}
          >
            {t("common.edit")}
          </Button>
        )}
      </div>
    </form>
  );

  const renderDrivers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-200">
          {t("fleet.drivers.title")}
        </h3>
        <Button className="add-button">{t("fleet.drivers.add")}</Button>
      </div>

      <MyTable
        headers={[
          t("fleet.drivers.name"),
          t("fleet.drivers.status"),
          t("common.actions"),
        ]}
        rows={fleetDrivers.map((driver) => ({
          id: driver.id,
          data: [
            <div>
              <div className="text-gray-200">
                {driver.firstName} {driver.lastName}
              </div>
              <div className="text-sm text-gray-400">{driver.mobileNumber}</div>
            </div>,
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/control-panel/drivers/${driver.id}`)}
            >
              {t("common.view")}
            </Button>,
          ],
        }))}
        navigate={(id) => navigate(`/control-panel/drivers/${id}`)}
      />
    </div>
  );

  const renderFinancials = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-200">
          {t("fleet.financials.title")}
        </h3>
        <FleetTransactionDialog
          fleetId={fleetId!}
          currencies={
            (fleetFinancials?.regions?.nodes &&
              fleetFinancials?.regions?.nodes.length > 0 &&
              fleetFinancials?.regions?.nodes?.map((n) => n.currency)) ||
            []
          }
          onSuccess={fetchFleetData}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fleetFinancials?.fleet?.wallets &&
          fleetFinancials?.fleet?.wallets.length > 0 &&
          fleetFinancials?.fleet?.wallets.map((wallet, index) => (
            <div key={index} className="card-shape">
              <Card className="bg-white border-gray-200">
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
            </div>
          ))}
      </div>

      {/* Chart */}
      {getChartData(fleetFinancials) && (
        <div className=" flex flex-col gap-4">
          <h3 className="text-lg font-medium text-gray-200">
            {t("fleet.financials.revenue")}
          </h3>
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
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium text-gray-200">
          {t("fleet.financials.transactions")}
        </h3>
        <div className="">
          <MyTable
            headers={[
              t("common.date"),
              t("common.type"),
              t("common.amount"),
              t("common.status"),
              t("common.reference"),
            ]}
            rows={
              fleetFinancials?.fleet?.transactions?.nodes?.map((tx) => ({
                id: tx.refrenceNumber || "",
                data: [
                  new Date(tx.transactionTimestamp).toLocaleDateString(),
                  <div className="flex flex-col">
                    <span>{tx.action}</span>
                    <span className="text-sm text-gray-600">
                      {tx.deductType || tx.rechargeType}
                    </span>
                  </div>,
                  <span
                    className={
                      tx.amount > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount.toLocaleString()} {tx.currency}
                  </span>,
                  <Badge variant="secondary" className="bg-gray-100">
                    {tx.status || t("common.completed")}
                  </Badge>,
                  tx.refrenceNumber || "-",
                ],
              })) || []
            }
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      title: t("fleet.tabs.details"),
      value: "details",
    },
    {
      title: t("fleet.tabs.drivers"),
      value: "drivers",
    },
    {
      title: t("fleet.tabs.financials"),
      value: "financials",
    },
  ];
  const tabsContent = [
    {
      value: "details",
      content: renderFleetDetails(),
    },
    {
      value: "drivers",
      content: renderDrivers(),
    },
    {
      value: "financials",
      content: renderFinancials(),
    },
  ];

  return (
    <div>
      <h3 className="text-3xl font-semibold pl-6 mb-3 text-gray-300">
        {t("fleet.title")}
      </h3>
      <div className="container w-2/3 p-6">
        <Card className="bg-background border-none text-foreground card-shape">
          <CardContent className="bg-transparent border-transparent">
            <MyTabs
              tabs={tabs}
              tabsContent={tabsContent}
              setActiveTab={setActiveTab}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
