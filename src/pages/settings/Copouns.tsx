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
  CreateCouponGQL,
  DeleteCouponGQL,
  CreateCouponMutationVariables,
  UpdateCouponGQL,
} from "../../graphql/requests";
import { MyDialog } from "../../components/common/MyDialog";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Switch } from "../../components/ui/switch";

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
        setCoupons((prev) => [...prev, data.createCoupon]);
        toast.success(t("common.created"));
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

  return (
    <div className="card-shape">
      <Card className="bg-transparent border-transparent shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-200 text-xl">
            {t("promotions.coupons")}
          </CardTitle>
          <Button onClick={() => setShowCouponDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t("common.create")}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-transparent">
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
                  <TableCell
                    colSpan={6}
                    className="text-center py-14 hover:bg-transparent border-transparent text-gray-200"
                  >
                    {t("common.loading")}
                  </TableCell>
                </TableRow>
              ) : coupons.length === 0 ? (
                <TableRow className="hover:bg-transparent border-transparent">
                  <TableCell colSpan={6} className="text-center py-14 ">
                    {t("common.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                coupons &&
                coupons?.map((coupon) => (
                  <TableRow
                    key={coupon.id}
                    className="hover:bg-[#262626] border-transparent text-gray-200"
                  >
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
                          coupon.isEnabled ? "text-green-500" : "text-red-500"
                        }
                      >
                        {coupon.isEnabled
                          ? t("common.active")
                          : t("common.inactive")}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-2">
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
