import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import MyTable from "../../components/common/table-components/MyTable";

const ByTheClock = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-6 gap-6 mb-6 ">
        <Select>
          <SelectTrigger className="col-span-2 h-10 border-none custom-input">
            <SelectValue placeholder={t("kazan")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kazan">{t("kazan")}</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="col-span-2 h-10 border-none custom-input">
            <SelectValue placeholder={t("everythingIsAProfession")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="everything-is-a-profession">
              {t("everythingIsAProfession")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="col-span-2 h-10 border-none custom-input">
            <SelectValue placeholder={t("partners")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="partners">{t("partners.title")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex col-span-5 gap-4">
        <div className="flex gap-6">
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("today")}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("yesterday")}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("june")}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("period")}</span>
          </Button>
          <div className="flex justify-center gap-4">
            <Input
              type="date"
              className="bg-[#1E1E1E] border-none text-white"
              defaultValue="2023-07-08"
            />
            <Input
              type="date"
              className="bg-[#1E1E1E] border-none text-white"
              defaultValue="2023-07-10"
            />
          </div>
        </div>

        <Button className="bg-black ml-auto text-white hover:bg-black/90 px-8 col-span-1">
          {t("show")}
        </Button>
      </div>

      <MyTable
        headers={[
          t("time"),
          t("totalOrders"),
          t("numberPaid"),
          t("amountPaid"),
          t("quantityUnpaid"),
          t("amountUnpaid"),
          t("quantityCancelled"),
          t("effectiveness"),
        ]}
        rows={timeSlots.map((slot) => ({
          id: slot.time,
          data: [
            slot.time,
            slot.totalOrders,
            slot.numberPaid,
            slot.amountPaid,
            slot.quantityUnpaid,
            slot.amountUnpaidCancelled,
            slot.quantity,
            slot.effectiveness,
          ],
        }))}
      />

      <div className="flex justify-between items-center bg-black rounded-full p-4 mt-4">
        <span className="text-white text-lg">{t("total")}</span>
        <span className="text-white text-lg">4122.3 ₽</span>
      </div>
    </div>
  );
};

const timeSlots = [
  {
    time: "00-01",
    totalOrders: "2",
    numberPaid: "2",
    amountPaid: "4122,3 Point",
    quantityUnpaid: "2",
    amountUnpaidCancelled: "2",
    quantity: "2",
    effectiveness: "100%",
  },
  {
    time: "01-02",
    totalOrders: "0",
    numberPaid: "0",
    amountPaid: "0",
    quantityUnpaid: "0",
    amountUnpaidCancelled: "0",
    quantity: "0",
    effectiveness: "0",
  },
  {
    time: "02-03",
    totalOrders: "2",
    numberPaid: "2",
    amountPaid: "2",
    quantityUnpaid: "2",
    amountUnpaidCancelled: "2",
    quantity: "2",
    effectiveness: "0",
  },
];

export default ByTheClock;
