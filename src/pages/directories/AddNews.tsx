import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import Switch from "../../components/common/form-elements/Switch";
import { Button } from "../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "../../components/ui/calendar";
import { useTranslation } from "react-i18next";
import {
  CreateAnnouncementGQL,
  AnnouncementUserType,
} from "../../graphql/requests";
import toast from "react-hot-toast";

export default function AddNewsForm() {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [userType, setUserType] = useState<AnnouncementUserType[]>([]);

  const validateForm = () => {
    if (!title.trim()) {
      toast.error(t("Title is required"));
      return false;
    }
    if (!startDate) {
      toast.error(t("Start date is required"));
      return false;
    }
    if (!endDate) {
      toast.error(t("End date is required"));
      return false;
    }
    if (startDate > endDate) {
      toast.error(t("Start date cannot be after end date"));
      return false;
    }
    if (userType.length === 0) {
      toast.error(t("At least one user type must be selected"));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const response = await CreateAnnouncementGQL({
        input: {
          title,
          description,
          startAt: startDate?.toISOString(),
          expireAt: endDate?.toISOString(),
          userType: userType,
        },
      });
      console.log(response);

      toast.success(t("Announcement created successfully"));

      // Reset form
      setTitle("");
      setDescription("");
      setStartDate(new Date());
      setEndDate(new Date());
      setUserType([]);
    } catch (error) {
      console.error(error);
      toast.error(t("Error creating announcement"));
    }
  };

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

  const toggleUserType = (type: AnnouncementUserType) => {
    setUserType((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("addNews.titlePlaceholder")}
              className="custom-input"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">
              {t("news.userType")} <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-10">
              {Object.values(AnnouncementUserType).map((type) => (
                <div className="flex items-center gap-2">
                  <Switch
                    disabled={false}
                    checked={userType.includes(type)}
                    onChange={() => toggleUserType(type)}
                  />
                  <label className="text-sm">{type}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm">
              {t("addNews.descriptionLabel")}
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                  className="bg-[#121212] hover:bg-[#666] custom-input"
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
                  className="bg-[#121212] hover:bg-[#666] custom-input"
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
            <label htmlFor="url" className="text-sm">
              {t("addNews.urlLabel")}
            </label>
            <Input
              id="url"
              placeholder={t("addNews.urlPlaceholder")}
              className="custom-input"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleSubmit}
              className="bg-primary text-black px-8 w-fit hover:bg-primary/80 transition rounded-md py-2 ml-auto"
            >
              {t("addNews.announceButton")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
