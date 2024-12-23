import { useState } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import Switch from "../../common/Switch";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { cn } from "../../../lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "../../ui/calendar";
import { useTranslation } from "react-i18next";

export default function AddNewsForm() {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isBlocked, _setIsBlocked] = useState(false);

  const renderDateButton = ({
    date,
    placeholder,
  }: {
    date: Date | undefined;
    placeholder: string;
  }) => (
    <Button
      variant="outline"
      className={cn(
        "flex justify-start text-left font-normal bg-background w-full",
        !date && "text-muted-foreground"
      )}
    >
      <Calendar className="mr-2 h-4 w-4" />
      {date ? format(date, "dd.MM.yyyy") : placeholder}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background p-4 dark">
      <Card className="card-shape w-2/3">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t("addNews.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm">
              {t("addNews.titleLabel")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              placeholder={t("addNews.titlePlaceholder")}
              className="custom-input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="branch" className="text-sm">
              {t("addNews.branchLabel")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder={t("addNews.branchPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="branch1">
                  {t("addNews.branches")[0]}
                </SelectItem>
                <SelectItem value="branch2">
                  {t("addNews.branches")[1]}
                </SelectItem>
                <SelectItem value="branch3">
                  {t("addNews.branches")[2]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm">
              {t("addNews.descriptionLabel")}
            </label>
            <Textarea
              id="description"
              placeholder={t("addNews.descriptionPlaceholder")}
              className="min-h-[100px] bg-[#121212] resize-none outline-none focus:outline-none select-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">
              {t("addNews.activityPeriodLabel")}
            </label>
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger
                  asChild
                  className="bg-[#121212] hover:bg-[#666]"
                >
                  {renderDateButton({
                    date: startDate,
                    placeholder: t("addNews.datePlaceholders")[0],
                  })}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger
                  asChild
                  className="bg-[#121212] hover:bg-[#666]"
                >
                  {renderDateButton({
                    date: endDate,
                    placeholder: t("addNews.datePlaceholders")[1],
                  })}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="push" className="text-sm">
              {t("addNews.pushLabel")}
            </label>
            <Textarea
              id="push"
              placeholder={t("addNews.pushPlaceholder")}
              className="min-h-[100px] bg-[#121212] resize-none outline-none focus:outline-none select-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label>{t("addNews.blockLabel")}</label>
              <Switch
                checked={isBlocked}
                // onCheckedChange={setIsBlocked}
                disabled={false}
              />
            </div>
            <button className="bg-primary text-black px-8 w-[100px] hover:bg-primary/80 transition rounded-md py-2">
              {t("addNews.saveButton")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
