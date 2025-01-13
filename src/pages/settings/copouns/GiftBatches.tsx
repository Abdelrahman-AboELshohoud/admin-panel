import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";

import { Input } from "../../../components/ui/input";
import { Plus } from "lucide-react";
import {
  GiftBatchListGQL,
  CreateGiftBachGQL,
  ExportGiftBatchToCsvGQL,
  CreateGiftBachMutationVariables,
  ViewGiftBatchQuery,
} from "../../../graphql/requests";
import { MyDialog } from "../../../components/common/MyDialog";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import moment from "moment";
import MyTableWithHeader from "../../../components/common/MyTableWithHeader";

export default function GiftBatches() {
  const { t } = useTranslation();
  const [giftBatches, setGiftBatches] = useState<
    ViewGiftBatchQuery["giftBatch"][]
  >([]);

  const [showGiftBatchDialog, setShowGiftBatchDialog] = useState(false);

  const [giftBatchForm, setGiftBatchForm] = useState<
    CreateGiftBachMutationVariables["input"]
  >({
    name: "",
    amount: 0,
    currency: "USD",
    quantity: 1,
    availableFrom: "",
    expireAt: "",
  });

  const fetchData = async () => {

    try {
      const [giftBatchData] = await Promise.all([GiftBatchListGQL({})]);

      setGiftBatches(giftBatchData.data.giftBatches.nodes);
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportGiftBatch = async (id: string) => {
    console.log(id);
    try {
      const response = await ExportGiftBatchToCsvGQL({ giftBatchId: id });
      // Handle CSV download
      console.log(response);
      if (response.statusCode === 200) {
        const blob = new Blob([response.data.exportGiftBatchToCsv], {
          type: "text/csv",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gift-batch-${id}.csv`;
        a.click();
        return;
      }
      toast.error(t("common.permissionNotGranted"));
    } catch (error) {
      toast.error(t("common.permissionNotGranted"));
    }
  };

  const handleCreateGiftBatch = async () => {
    try {
      await CreateGiftBachGQL({
        input: {
          ...giftBatchForm,
          amount: Number(giftBatchForm.amount),
          quantity: Number(giftBatchForm.quantity),
        },
      });
      await fetchData();
      setShowGiftBatchDialog(false);
      setGiftBatchForm({
        name: "",
        amount: 0,
        currency: "USD",
        quantity: 1,
        availableFrom: "",
        expireAt: "",
      });
      toast.success(t("common.created"));
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  console.log(giftBatches);

  return (
    <>
      <MyTableWithHeader
        Header={() => (
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-gray-200 text-xl font-bold">
              {t("promotions.giftCards")}
            </h3>
            <Button
              className="add-button"
              onClick={() => setShowGiftBatchDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("common.create")}
            </Button>
          </div>
        )}
        headers={[
          t("promotions.name"),
          t("promotions.amount"),
          t("promotions.unused"),
          t("promotions.used"),
          t("promotions.availableFrom"),
          t("promotions.expireAt"),
          t("common.actions"),
        ]}
        rows={giftBatches.map((batch) => [
          batch.name,
          `${batch.amount} ${batch.currency}`,
          batch?.totalUnused[0]?.count?.id,
          batch?.totalUsed[0]?.count?.id,
          <>
            {moment(batch.availableFrom).format("DD.MM.YYYY HH:mm")}
            <br />
            {moment(batch.availableFrom).format("HH:mm A")}
          </>,
          <>
            {moment(batch.expireAt).format("DD.MM.YYYY HH:mm")}
            <br />
            {moment(batch.expireAt).format("HH:mm A")}
          </>,
          <Button
            variant="outline"
            size="sm"
            className="text-gray-700"
            onClick={() => handleExportGiftBatch(batch.id)}
          >
            {t("common.export")}
          </Button>,
        ])}
        navigate={() => {}}
      />

      <MyDialog
        isOpen={showGiftBatchDialog}
        onOpenChange={setShowGiftBatchDialog}
        title={t("promotions.createGiftBatch")}
        showCloseButton={false}
      >
        <div className="space-y-4">
          <div>
            <label className="text-gray-400">{t("promotions.name")}</label>
            <Input
              placeholder={t("promotions.name")}
              value={giftBatchForm.name}
              onChange={(e) =>
                setGiftBatchForm({ ...giftBatchForm, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-gray-400">{t("promotions.amount")}</label>
            <Input
              type="number"
              placeholder={t("promotions.amount")}
              value={giftBatchForm.amount}
              onChange={(e) =>
                setGiftBatchForm({
                  ...giftBatchForm,
                  amount: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="text-gray-400">{t("promotions.currency")}</label>
            <Select
              value={giftBatchForm.currency}
              onValueChange={(value) =>
                setGiftBatchForm({ ...giftBatchForm, currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("promotions.currency")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="RUB">RUB</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-gray-400">{t("promotions.quantity")}</label>
            <Input
              type="number"
              placeholder={t("promotions.quantity")}
              value={giftBatchForm.quantity}
              onChange={(e) =>
                setGiftBatchForm({
                  ...giftBatchForm,
                  quantity: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="text-gray-400">
              {t("promotions.availableFrom")}
            </label>
            <Input
              type="date"
              placeholder={t("promotions.availableFrom")}
              value={giftBatchForm.availableFrom}
              onChange={(e) =>
                setGiftBatchForm({
                  ...giftBatchForm,
                  availableFrom: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="text-gray-400">{t("promotions.expireAt")}</label>
            <Input
              type="date"
              placeholder={t("promotions.expireAt")}
              value={giftBatchForm.expireAt}
              onChange={(e) =>
                setGiftBatchForm({ ...giftBatchForm, expireAt: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              className="hover:text-gray-600 text-gray-500"
              variant="outline"
              onClick={() => setShowGiftBatchDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleCreateGiftBatch}>
              {t("common.create")}
            </Button>
          </div>
        </div>
      </MyDialog>
    </>
  );
}
