import { Download, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import MyTable from "../../components/common/table-components/MyTable";
import { Input } from "../../components/ui/input";

const ForAggregrator = () => {
  const { t } = useTranslation();

  const selects = {
    city: {
      defaultValue: "kazan",
      placeholder: t("selectCity"),
      options: [{ value: "kazan", label: t("kazan") }],
    },
    partner: {
      defaultValue: "olrusAuto",
      placeholder: t("selectPartner"),
      options: [{ value: "olrusAuto", label: t("olrusAuto") }],
    },
  };

  const buttons = {
    timeButtons: [t("today"), t("yesterday"), t("june"), t("period")],
    orderReport: t("forAggregrator.orderReport"),
  };

  return (
    <Card className="w-full bg-transparent max-w-4xl  text-white border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {t("forAggregrator.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 ">
        <div className=" gap-4 grid grid-cols-6">
          {Object.values(selects).map((select, index) => (
            <Select key={index} defaultValue={select.defaultValue}>
              <SelectTrigger className="w-full custom-input col-span-2">
                <SelectValue placeholder={select.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {select.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="flex gap-6">
          {buttons.timeButtons.map((text) => (
            <Button
              key={text}
              className="flex items-center gap-2 bg-[#121212] hover:bg-[#888]"
            >
              <span>{text}</span>
            </Button>
          ))}
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
          <Button className="bg-zinc-800">{buttons.orderReport}</Button>
        </div>

        <div className="bg-[#1C1C1E] rounded-xl">
          <MyTable
            headers={[
              t("forAggregrator.period"),
              t("forAggregrator.city"),
              t("forAggregrator.partner"),
              t("forAggregrator.payment"),
              t("forAggregrator.numberOfExecutors"),
              t("forAggregrator.status"),
              "",
            ]}
            rows={[
              {
                id: "1",
                data: [
                  "09.07.2023 - 09.07.2023",
                  t("kazan"),
                  "-",
                  "0",
                  "1",
                  t("forAggregrator.currentAsOf", { date: "10.07.2023 22:32" }),
                  <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>,
                ],
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ForAggregrator;
