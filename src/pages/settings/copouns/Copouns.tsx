import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Plus } from "lucide-react";
import {
  CouponListGQL,
  CreateCouponGQL,
  DeleteCouponGQL,
  CreateCouponMutationVariables,
  UpdateCouponGQL,
} from "../../../graphql/requests";
import { MyDialog } from "../../../components/common/dialogs/MyDialog";
import moment from "moment";
import toast from "react-hot-toast";
import { Switch } from "../../../components/ui/switch";
import MyTableWithHeader from "../../../components/common/table-components/MyTableWithHeader";

interface Coupon {
  id: string;
  code: string;
  title: string;
  startAt: string;
  expireAt: string;
  isEnabled: boolean;
  description: string;
  creditGift: number;
  discountFlat: number;
  discountPercent: number;
  isFirstTravelOnly: boolean;
  manyTimesUserCanUse: number;
  maximumCost: number;
  minimumCost: number;
  manyUsersCanUse: number;
}

export default function Copouns() {
  const { t } = useTranslation();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<string | null>(null);

  // Form states
  const [couponForm, setCouponForm] = useState<
    CreateCouponMutationVariables["input"]
  >({
    code: "",
    title: "",
    startAt: "",
    expireAt: "",
    isEnabled: true,
    description: "",
    creditGift: 0,
    discountFlat: 0,
    discountPercent: 0,
    isFirstTravelOnly: false,
    manyTimesUserCanUse: 0,
    maximumCost: 0,
    minimumCost: 0,
    manyUsersCanUse: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await CouponListGQL({});
      setCoupons(data.coupons.nodes);
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
      setCoupons((prev) => prev.filter((coupon) => coupon.id !== id));
      toast.success(t("common.deleted"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon.id);
    setCouponForm({
      code: coupon.code,
      title: coupon.title,
      startAt: coupon.startAt,
      expireAt: coupon.expireAt,
      isEnabled: coupon.isEnabled,
      description: coupon.description,
      creditGift: coupon.creditGift,
      discountFlat: coupon.discountFlat,
      discountPercent: coupon.discountPercent,
      isFirstTravelOnly: coupon.isFirstTravelOnly,
      manyTimesUserCanUse: coupon.manyTimesUserCanUse,
      maximumCost: coupon.maximumCost,
      minimumCost: coupon.minimumCost,
      manyUsersCanUse: coupon.manyUsersCanUse,
    });
    setShowCouponDialog(true);
  };

  const handleCreateOrUpdateCoupon = async () => {
    try {
      const input = {
        ...couponForm,
        creditGift: Number(couponForm.creditGift),
        discountFlat: Number(couponForm.discountFlat),
        discountPercent: Number(couponForm.discountPercent),
        manyTimesUserCanUse: Number(couponForm.manyTimesUserCanUse),
        maximumCost: Number(couponForm.maximumCost),
        minimumCost: Number(couponForm.minimumCost),
        manyUsersCanUse: Number(couponForm.manyUsersCanUse),
      };

      if (editingCoupon) {
        await UpdateCouponGQL({
          id: editingCoupon,
          input,
        });
        setCoupons((prev) =>
          prev.map((coupon) =>
            coupon.id === editingCoupon ? { ...coupon, ...input } : coupon
          )
        );
        toast.success(t("common.updated"));
      } else {
        const { data } = await CreateCouponGQL({ input });
        if (data.createCoupon) {
          setCoupons((prev) => [
            ...prev,
            { ...input, id: data.createCoupon.id },
          ]);
          toast.success(t("common.created"));
        }
      }

      setShowCouponDialog(false);
      setEditingCoupon(null);
      setCouponForm({
        code: "",
        title: "",
        startAt: "",
        expireAt: "",
        isEnabled: true,
        description: "",
        creditGift: 0,
        discountFlat: 0,
        discountPercent: 0,
        isFirstTravelOnly: false,
        manyTimesUserCanUse: 0,
        maximumCost: 0,
        minimumCost: 0,
        manyUsersCanUse: 0,
      });
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const TableHeader = () => (
    <div className="flex justify-between items-center">
      <CardTitle className="text-gray-200 text-xl">
        {t("promotions.coupons")}
      </CardTitle>
      <Button onClick={() => setShowCouponDialog(true)}>
        <Plus className="w-4 h-4 mr-2" />
        {t("common.create")}
      </Button>
    </div>
  );

  const headers = [
    t("promotions.code"),
    t("promotions.title"),
    t("promotions.startDate"),
    t("promotions.expireDate"),
    t("promotions.status"),
    t("common.actions"),
  ];
  console.log(coupons);
  const rows = coupons.map((coupon) => [
    coupon?.code || "-",
    coupon?.title || "-",
    moment(coupon?.startAt || "").format("ll"),
    moment(coupon?.expireAt || "").format("ll"),
    <span className={coupon?.isEnabled ? "text-green-500" : "text-red-500"}>
      {coupon?.isEnabled ? t("common.active") : t("common.inactive")}
    </span>,
    <div className="space-x-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleEditCoupon(coupon)}
      >
        {t("common.edit")}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleDeleteCoupon(coupon?.id || "")}
      >
        {t("common.delete")}
      </Button>
    </div>,
  ]);

  return (
    <div>
      <Card className="bg-transparent border-transparent shadow-none">
        <CardContent>
          {loading ? (
            <div className="text-center py-14 text-gray-200">
              {t("common.loading")}
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-14">{t("common.noData")}</div>
          ) : (
            <MyTableWithHeader
              Header={TableHeader}
              headers={headers}
              rows={rows}
              navigate={() => {}}
            />
          )}
        </CardContent>
      </Card>

      <MyDialog
        isOpen={showCouponDialog}
        onOpenChange={setShowCouponDialog}
        title={
          editingCoupon
            ? t("promotions.editCoupon")
            : t("promotions.createCoupon")
        }
        showCloseButton={false}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="code">{t("promotions.code")}</label>
            <Input
              id="code"
              value={couponForm.code}
              onChange={(e) =>
                setCouponForm({ ...couponForm, code: e.target.value })
              }
            />
            <label htmlFor="title">{t("promotions.title")}</label>
            <Input
              id="title"
              value={couponForm.title}
              onChange={(e) =>
                setCouponForm({ ...couponForm, title: e.target.value })
              }
            />
            <label htmlFor="description">{t("promotions.description")}</label>
            <Input
              id="description"
              value={couponForm.description}
              onChange={(e) =>
                setCouponForm({ ...couponForm, description: e.target.value })
              }
            />
            <label htmlFor="creditGift">{t("promotions.creditGift")}</label>
            <Input
              id="creditGift"
              type="number"
              value={couponForm.creditGift}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  creditGift: Number(e.target.value),
                })
              }
            />
            <label htmlFor="discountFlat">{t("promotions.discountFlat")}</label>
            <Input
              id="discountFlat"
              type="number"
              value={couponForm.discountFlat}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  discountFlat: Number(e.target.value),
                })
              }
            />
            <label htmlFor="discountPercent">
              {t("promotions.discountPercent")}
            </label>
            <Input
              id="discountPercent"
              type="number"
              value={couponForm.discountPercent}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  discountPercent: Number(e.target.value),
                })
              }
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="isFirstTravelOnly"
                checked={couponForm.isFirstTravelOnly}
                onCheckedChange={(checked) =>
                  setCouponForm({
                    ...couponForm,
                    isFirstTravelOnly: checked,
                  })
                }
              />
              <label htmlFor="isFirstTravelOnly">
                {t("promotions.isFirstTravelOnly")}
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="manyTimesUserCanUse">
              {t("promotions.manyTimesUserCanUse")}
            </label>
            <Input
              id="manyTimesUserCanUse"
              type="number"
              value={couponForm.manyTimesUserCanUse}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  manyTimesUserCanUse: Number(e.target.value),
                })
              }
            />
            <label htmlFor="maximumCost">{t("promotions.maximumCost")}</label>
            <Input
              id="maximumCost"
              type="number"
              value={couponForm.maximumCost}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  maximumCost: Number(e.target.value),
                })
              }
            />
            <label htmlFor="minimumCost">{t("promotions.minimumCost")}</label>
            <Input
              id="minimumCost"
              type="number"
              value={couponForm.minimumCost}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  minimumCost: Number(e.target.value),
                })
              }
            />
            <label htmlFor="manyUsersCanUse">
              {t("promotions.manyUsersCanUse")}
            </label>
            <Input
              id="manyUsersCanUse"
              type="number"
              value={couponForm.manyUsersCanUse}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  manyUsersCanUse: Number(e.target.value),
                })
              }
            />
            <label htmlFor="startAt">{t("promotions.startDate")}</label>
            <Input
              id="startAt"
              type="date"
              value={couponForm.startAt}
              onChange={(e) =>
                setCouponForm({ ...couponForm, startAt: e.target.value })
              }
            />
            <label htmlFor="expireAt">{t("promotions.expireDate")}</label>
            <Input
              id="expireAt"
              type="date"
              value={couponForm.expireAt}
              onChange={(e) =>
                setCouponForm({ ...couponForm, expireAt: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowCouponDialog(false);
              setEditingCoupon(null);
              setCouponForm({
                code: "",
                title: "",
                startAt: "",
                expireAt: "",
                isEnabled: true,
                description: "",
                creditGift: 0,
                discountFlat: 0,
                discountPercent: 0,
                isFirstTravelOnly: false,
                manyTimesUserCanUse: 0,
                maximumCost: 0,
                minimumCost: 0,
                manyUsersCanUse: 0,
              });
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleCreateOrUpdateCoupon}>
            {editingCoupon ? t("common.update") : t("common.create")}
          </Button>
        </div>
      </MyDialog>
    </div>
  );
}
