import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import Switch from "../../common/Switch";
import { CardContent, Card } from "../../ui/card";
import { useTranslation } from "react-i18next";

const PhotoControlForm = () => {
  const { t } = useTranslation();
  const [photoRequirements, _setPhotoRequirements] = useState([
    { id: 1, label: t("photoRequirements.front"), checked: true },
    { id: 2, label: t("photoRequirements.back"), checked: true },
    { id: 3, label: t("photoRequirements.right"), checked: true },
    { id: 4, label: t("photoRequirements.left"), checked: true },
    { id: 5, label: t("photoRequirements.frontCabin"), checked: true },
    { id: 6, label: t("photoRequirements.backCabin"), checked: true },
    { id: 7, label: t("photoRequirements.trunk"), checked: true },
    { id: 8, label: t("photoRequirements.documents"), checked: true },
  ]);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-gray-400">{t("photoControl.title")}</p>
          <h1 className="text-3xl font-semibold mt-2">
            {t("photoControl.add")}
          </h1>
        </div>
        <Card className="bg-[#2A2A2A] border-gray-700">
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-100">{t("labels.city")}</label>
                  <Select defaultValue="kazan">
                    <SelectTrigger className="bg-[#1E1E1E] border-gray-700 text-white">
                      <SelectValue placeholder={t("placeholders.selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kazan">{t("cities.kazan")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-100">
                    {t("labels.profession")}
                  </label>
                  <Select defaultValue="taxi">
                    <SelectTrigger className="bg-[#1E1E1E] border-gray-700 text-white">
                      <SelectValue
                        placeholder={t("placeholders.selectProfession")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="taxi">
                        {t("professions.taxi")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-100">
                    {t("labels.carClass")}
                  </label>
                  <Select defaultValue="business">
                    <SelectTrigger className="bg-[#1E1E1E] border-gray-700 text-white">
                      <SelectValue
                        placeholder={t("placeholders.selectCarClass")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">
                        {t("carClasses.business")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-100">{t("labels.period")}</label>
                  <Select defaultValue="start">
                    <SelectTrigger className="bg-[#1E1E1E] border-gray-700 text-white">
                      <SelectValue
                        placeholder={t("placeholders.selectPeriod")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="start">
                        {t("periods.start")}
                      </SelectItem>
                      <SelectItem value="24h">
                        {t("periods.every24h")}
                      </SelectItem>
                      <SelectItem value="week">
                        {t("periods.everyWeek")}
                      </SelectItem>
                      <SelectItem value="month">
                        {t("periods.everyMonth")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-gray-100">
                  {t("labels.photoRequirements")}
                </label>
                <div className="space-y-4">
                  {photoRequirements.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <label className="text-gray-300">{item.label}</label>
                      <Switch checked={item.checked} disabled={false} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-[#D4AF37] text-black hover:bg-[#C4A137] px-8">
            {t("buttons.save")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoControlForm;
