import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  CouponListGQL,
  RewardListGQL,
  GiftBatchListGQL,
  CreateCouponGQL,
  CreateRewardGQL,
  CreateGiftBachGQL,
  DeleteCouponGQL,
  ExportGiftBatchToCsvGQL,
} from "../../graphql/requests";
import { MyDialog } from "../../components/common/MyDialog";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Coupon {
  id: string;
  code: string;
  title: string;
  startAt: string;
  expireAt: string;
  isEnabled: boolean;
}

interface Reward {
  id: string;
  title: string;
  beneficiary: string;
  event: string;
  startDate: string;
  endDate: string;
}

interface GiftBatch {
  id: string;
  name: string;
  amount: number;
  currency: string;
  totalUsed: {
    count: {
      id: number;
    };
  };
  totalUnused: {
    count: {
      id: number;
    };
  };
}

export default function Promotions() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("coupons");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [giftBatches, setGiftBatches] = useState<GiftBatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [showGiftBatchDialog, setShowGiftBatchDialog] = useState(false);

  // Form states
  const [couponForm, setCouponForm] = useState({
    code: "",
    title: "",
    startAt: "",
    expireAt: "",
    isEnabled: true,
  });

  const [rewardForm, setRewardForm] = useState({
    title: "",
    beneficiary: "",
    event: "",
    startDate: "",
    endDate: "",
  });

  const [giftBatchForm, setGiftBatchForm] = useState({
    name: "",
    amount: 0,
    currency: "USD",
    count: 1,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [couponsRes, rewardsRes, giftBatchesRes] = await Promise.all([
        CouponListGQL({ paging: { limit: 10 } }),
        RewardListGQL({ paging: { limit: 10 } }),
        GiftBatchListGQL({ paging: { limit: 10 } }),
      ]);

      setCoupons(couponsRes.data.coupons.nodes);
      setRewards(rewardsRes.data.rewards.nodes);
      setGiftBatches(giftBatchesRes.data.giftBatches.nodes);
    } catch (error) {
      toast.error(t("common.error"));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteCoupon = async (id: string) => {
    try {
      await DeleteCouponGQL({ id });
      await fetchData();
      toast.success(t("common.deleted"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleExportGiftBatch = async (id: string) => {
    try {
      const response = await ExportGiftBatchToCsvGQL({ giftBatchId: id });
      // Handle CSV download
      const blob = new Blob([response.data.exportGiftBatchToCsv], {
        type: "text/csv",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gift-batch-${id}.csv`;
      a.click();
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleCreateCoupon = async () => {
    try {
      await CreateCouponGQL(couponForm);
      await fetchData();
      setShowCouponDialog(false);
      setCouponForm({
        code: "",
        title: "",
        startAt: "",
        expireAt: "",
        isEnabled: true,
      });
      toast.success(t("common.created"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleCreateReward = async () => {
    try {
      await CreateRewardGQL(rewardForm);
      await fetchData();
      setShowRewardDialog(false);
      setRewardForm({
        title: "",
        beneficiary: "",
        event: "",
        startDate: "",
        endDate: "",
      });
      toast.success(t("common.created"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleCreateGiftBatch = async () => {
    try {
      await CreateGiftBachGQL(giftBatchForm);
      await fetchData();
      setShowGiftBatchDialog(false);
      setGiftBatchForm({
        name: "",
        amount: 0,
        currency: "USD",
        count: 1,
      });
      toast.success(t("common.created"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("promotions.title")}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="coupons">{t("promotions.coupons")}</TabsTrigger>
          <TabsTrigger value="rewards">{t("promotions.rewards")}</TabsTrigger>
          <TabsTrigger value="giftCards">
            {t("promotions.giftCards")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coupons">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("promotions.coupons")}</CardTitle>
              <Button onClick={() => setShowCouponDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t("common.create")}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("promotions.code")}</TableHead>
                    <TableHead>{t("promotions.title")}</TableHead>
                    <TableHead>{t("promotions.startDate")}</TableHead>
                    <TableHead>{t("promotions.expireDate")}</TableHead>
                    <TableHead>{t("promotions.status")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {t("common.loading")}
                      </TableCell>
                    </TableRow>
                  ) : coupons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {t("common.noData")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell>{coupon.code}</TableCell>
                        <TableCell>{coupon.title}</TableCell>
                        <TableCell>
                          {format(new Date(coupon.startAt), "PP")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(coupon.expireAt), "PP")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              coupon.isEnabled
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {coupon.isEnabled
                              ? t("common.active")
                              : t("common.inactive")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                          >
                            {t("common.delete")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("promotions.rewards")}</CardTitle>
              <Button onClick={() => setShowRewardDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t("common.create")}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("promotions.title")}</TableHead>
                    <TableHead>{t("promotions.beneficiary")}</TableHead>
                    <TableHead>{t("promotions.event")}</TableHead>
                    <TableHead>{t("promotions.startDate")}</TableHead>
                    <TableHead>{t("promotions.endDate")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {t("common.loading")}
                      </TableCell>
                    </TableRow>
                  ) : rewards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {t("common.noData")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rewards.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell>{reward.title}</TableCell>
                        <TableCell>{reward.beneficiary}</TableCell>
                        <TableCell>{reward.event}</TableCell>
                        <TableCell>
                          {format(new Date(reward.startDate), "PP")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(reward.endDate), "PP")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="giftCards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("promotions.giftCards")}</CardTitle>
              <Button onClick={() => setShowGiftBatchDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t("common.create")}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("promotions.name")}</TableHead>
                    <TableHead>{t("promotions.amount")}</TableHead>
                    <TableHead>{t("promotions.used")}</TableHead>
                    <TableHead>{t("promotions.unused")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {t("common.loading")}
                      </TableCell>
                    </TableRow>
                  ) : giftBatches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {t("common.noData")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    giftBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell>{batch.name}</TableCell>
                        <TableCell>{`${batch.amount} ${batch.currency}`}</TableCell>
                        <TableCell>{batch.totalUsed.count.id}</TableCell>
                        <TableCell>{batch.totalUnused.count.id}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportGiftBatch(batch.id)}
                          >
                            {t("common.export")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MyDialog
        isOpen={showCouponDialog}
        onOpenChange={setShowCouponDialog}
        title={t("promotions.createCoupon")}
      >
        <div className="space-y-4">
          <Input
            placeholder={t("promotions.code")}
            value={couponForm.code}
            onChange={(e) =>
              setCouponForm({ ...couponForm, code: e.target.value })
            }
          />
          <Input
            placeholder={t("promotions.title")}
            value={couponForm.title}
            onChange={(e) =>
              setCouponForm({ ...couponForm, title: e.target.value })
            }
          />
          <Input
            type="date"
            placeholder={t("promotions.startDate")}
            value={couponForm.startAt}
            onChange={(e) =>
              setCouponForm({ ...couponForm, startAt: e.target.value })
            }
          />
          <Input
            type="date"
            placeholder={t("promotions.expireDate")}
            value={couponForm.expireAt}
            onChange={(e) =>
              setCouponForm({ ...couponForm, expireAt: e.target.value })
            }
          />
          <Button onClick={handleCreateCoupon} className="w-full">
            {t("common.create")}
          </Button>
        </div>
      </MyDialog>

      <MyDialog
        isOpen={showRewardDialog}
        onOpenChange={setShowRewardDialog}
        title={t("promotions.createReward")}
      >
        <div className="space-y-4">
          <Input
            placeholder={t("promotions.title")}
            value={rewardForm.title}
            onChange={(e) =>
              setRewardForm({ ...rewardForm, title: e.target.value })
            }
          />
          <Input
            placeholder={t("promotions.beneficiary")}
            value={rewardForm.beneficiary}
            onChange={(e) =>
              setRewardForm({ ...rewardForm, beneficiary: e.target.value })
            }
          />
          <Input
            placeholder={t("promotions.event")}
            value={rewardForm.event}
            onChange={(e) =>
              setRewardForm({ ...rewardForm, event: e.target.value })
            }
          />
          <Input
            type="date"
            placeholder={t("promotions.startDate")}
            value={rewardForm.startDate}
            onChange={(e) =>
              setRewardForm({ ...rewardForm, startDate: e.target.value })
            }
          />
          <Input
            type="date"
            placeholder={t("promotions.endDate")}
            value={rewardForm.endDate}
            onChange={(e) =>
              setRewardForm({ ...rewardForm, endDate: e.target.value })
            }
          />
          <Button onClick={handleCreateReward} className="w-full">
            {t("common.create")}
          </Button>
        </div>
      </MyDialog>

      <MyDialog
        isOpen={showGiftBatchDialog}
        onOpenChange={setShowGiftBatchDialog}
        title={t("promotions.createGiftBatch")}
      >
        <div className="space-y-4">
          <Input
            placeholder={t("promotions.name")}
            value={giftBatchForm.name}
            onChange={(e) =>
              setGiftBatchForm({ ...giftBatchForm, name: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder={t("promotions.amount")}
            value={giftBatchForm.amount}
            onChange={(e) =>
              setGiftBatchForm({
                ...giftBatchForm,
                amount: parseFloat(e.target.value),
              })
            }
          />
          <Input
            placeholder={t("promotions.currency")}
            value={giftBatchForm.currency}
            onChange={(e) =>
              setGiftBatchForm({ ...giftBatchForm, currency: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder={t("promotions.count")}
            value={giftBatchForm.count}
            onChange={(e) =>
              setGiftBatchForm({
                ...giftBatchForm,
                count: parseInt(e.target.value),
              })
            }
          />
          <Button onClick={handleCreateGiftBatch} className="w-full">
            {t("common.create")}
          </Button>
        </div>
      </MyDialog>
    </div>
  );
}
