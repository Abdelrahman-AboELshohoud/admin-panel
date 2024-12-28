import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";

const PushMails = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full bg-transparent max-w-4xl text-white border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {t("pushMails.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-6">
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("pushMails.today")}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("pushMails.yesterday")}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("pushMails.june")}</span>
          </Button>
          <Button className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]">
            <span>{t("pushMails.period")}</span>
          </Button>
          <Input
            type="date"
            className="bg-[#1E1E1E] border-none text-white select-none"
            defaultValue="2023-07-08"
          />
          <Input
            type="date"
            className="bg-[#1E1E1E] border-none text-white select-none"
            defaultValue="2023-07-10"
          />
          <Button className="bg-zinc-800">{t("pushMails.show")}</Button>
        </div>

        <Table className="items-center gap-6 p-4 bg-[#1C1C1E] rounded-xl col-span-4">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead>{t("pushMails.date")}</TableHead>
              <TableHead>{t("pushMails.name")}</TableHead>
              <TableHead>{t("pushMails.recipient")}</TableHead>
              <TableHead>{t("pushMails.total")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent border-none">
              <TableCell className="text-white">08.07.2023</TableCell>
              <TableCell className="text-white">Olrus Auto</TableCell>
              <TableCell className="text-white">All</TableCell>
              <TableCell className="text-white">10</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PushMails;

// Translation JSON
/*
{

}
*/
