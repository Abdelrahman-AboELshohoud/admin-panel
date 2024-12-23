import { useTranslation } from 'react-i18next';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

const ByTheClock = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-6 gap-6 mb-6 ">
        <Select>
          <SelectTrigger className="col-span-2 h-10 border-none custom-input">
            <SelectValue placeholder={t('kazan')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kazan">{t('kazan')}</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="col-span-2 h-10 border-none custom-input">
            <SelectValue placeholder={t('everythingIsAProfession')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="everything-is-a-profession">{t('everythingIsAProfession')}</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="col-span-2 h-10 border-none custom-input">
            <SelectValue placeholder={t('partners')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="partners">{t('partners.title')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex col-span-5 gap-4">
        <div className="flex gap-6">
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t('today')}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t('yesterday')}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t('june')}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t('period')}</span>
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
          {t('show')}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-gray-400">{t('time')}</TableHead>
            <TableHead className="text-gray-400">{t('totalOrders')}</TableHead>
            <TableHead className="text-gray-400">{t('numberPaid')}</TableHead>
            <TableHead className="text-gray-400">{t('amountPaid')}</TableHead>
            <TableHead className="text-gray-400">{t('quantityUnpaid')}</TableHead>
            <TableHead className="text-gray-400">{t('amountUnpaid')}</TableHead>
            <TableHead className="text-gray-400">{t('quantityCancelled')}</TableHead>
            <TableHead className="text-gray-400">{t('effectiveness')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeSlots.map((slot) => (
            <TableRow
              key={slot.time}
              className="border-none hover:bg-[#2F2F2F]"
            >
              <TableCell>{slot.time}</TableCell>
              <TableCell>{slot.totalOrders}</TableCell>
              <TableCell>{slot.numberPaid}</TableCell>
              <TableCell>{slot.amountPaid}</TableCell>
              <TableCell>{slot.quantityUnpaid}</TableCell>
              <TableCell>{slot.amountUnpaidCancelled}</TableCell>
              <TableCell>{slot.quantity}</TableCell>
              <TableCell>{slot.effectiveness}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center bg-black rounded-full p-4 mt-4">
        <span className="text-white text-lg">{t('total')}</span>
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
