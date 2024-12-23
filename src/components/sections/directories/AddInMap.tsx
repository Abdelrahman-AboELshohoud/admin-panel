import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import Switch from "../../common/Switch";
import { useState } from "react";
import Map from "../../common/Map";
import { useTranslation } from "react-i18next";

export default function AddInMap() {
  const { t } = useTranslation();
  const [showAllDistricts, _setShowAllDistricts] = useState(false);
  const [formData, setFormData] = useState({
    type: "city",
    title: "",
    sorting: "100",
    ratioTo: "0",
    ratioFrom: "0",
  });

  return (
    <div className="min-h-screen bg-transparent text-gray-300 p-4">
      <Card className=" card-shape p-6 mb-4">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">{t("addInMap.add")}</h1>

          <div className="flex gap-4 text-gray-100">
            <div className="w-1/2 flex flex-col gap-2">
              <label htmlFor="area-type">{t("addInMap.typeOfArea")}</label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="w-full custom-input">
                  <SelectValue placeholder={t("addInMap.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city">{t("addInMap.city")}</SelectItem>
                  <SelectItem value="countryside">
                    {t("addInMap.countryside")}
                  </SelectItem>
                  <SelectItem value="airport">
                    {t("addInMap.airport")}
                  </SelectItem>
                  <SelectItem value="railway">
                    {t("addInMap.railway")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-1/2 flex flex-col gap-2">
              <label htmlFor="title">{t("addInMap.title")}</label>
              <Input
                id="title"
                placeholder={t("addInMap.enterTitle")}
                className="border-none focus:ring-0 text-gray-100 focus-visible:ring-0 custom-input"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex flex-row gap-2 justify-between text-gray-200">
            <div className="flex flex-col gap-2">
              <label>{t("addInMap.sorting")}</label>
              <Input
                type="number"
                className="custom-input"
                value={formData.sorting}
                onChange={(e) =>
                  setFormData({ ...formData, sorting: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>{t("addInMap.districtRatio")}</label>
              <div className="flex w-full gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="custom-input"
                    value={formData.ratioFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, ratioFrom: e.target.value })
                    }
                  />
                  <span>%</span>
                </div>
                <span className="pl-2">{t("addInMap.from")}</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="custom-input"
                    value={formData.ratioTo}
                    onChange={(e) =>
                      setFormData({ ...formData, ratioTo: e.target.value })
                    }
                  />
                  <span>%</span>
                </div>
                <span className="pl-2">{t("addInMap.to")}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div className="flex justify-center">
        <Map />
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-6">
          <label
            htmlFor="show-districts"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("addInMap.showAllDistricts")}
          </label>
          <Switch
            checked={showAllDistricts}
            disabled={false}
            // onCheckedChange={(checked) => setShowAllDistricts(checked)}
          />
        </div>

        <Button className="bg-[#B69F7D] hover:bg-[#A38D6B] text-black">
          {t("addInMap.save")}
        </Button>
      </div>
    </div>
  );
}
