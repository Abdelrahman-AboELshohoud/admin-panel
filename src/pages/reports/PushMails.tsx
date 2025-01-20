import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import MyTable from "../../components/common/table-components/MyTable";

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

        <div className="bg-[#1C1C1E] rounded-xl">
          <MyTable
            headers={[
              t("pushMails.date"),
              t("pushMails.name"),
              t("pushMails.recipient"),
              t("pushMails.total"),
            ]}
            rows={[
              {
                id: "1",
                data: ["08.07.2023", "Olrus Auto", "All", "10"],
              },
            ]}
          />
        </div>
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
