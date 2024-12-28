import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import Switch from "../../components/common/Switch";
import { useTranslation } from "react-i18next";

export default function AddPartner() {
  const { t } = useTranslation();
  const [isBlocked, _setIsBlocked] = useState(false);

  return (
    <div className="min-h-scree">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-normal text-zinc-100">
          {t("addPartner.title")}
        </h1>

        <Card className="card-shape">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between">
              <label className="text-sm text-zinc-100 flex items-center gap-1">
                {t("addPartner.label.title")}
                <span className="text-amber-500">*</span>
              </label>
              <Input
                className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                placeholder="."
              />
            </div>

            <div className="flex justify-between">
              <label className="text-sm text-zinc-100">
                {t("addPartner.label.telephone")}
              </label>
              <Input
                className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                placeholder="+7(000)000-00-00"
              />
            </div>

            <div className="flex justify-between">
              <label className="text-sm text-zinc-100">
                {t("addPartner.label.commission")}
              </label>
              <div className="flex gap-2 items-center  w-2/3">
                <Input
                  className="bg-zinc-900 border-zinc-700 text-zinc-100"
                  placeholder="."
                />
                <span className="text-zinc-400">%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Details */}
        <Card className="card-shape">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-normal text-zinc-400">
              {t("addPartner.organization.title")}
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.name")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.contractNumber")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.agreementDate")}
                </label>
                <Input
                  type="text"
                  defaultValue="08.07.2023"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.legalAddress")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.ogrn")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.inn")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.directorName")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.email")}
                </label>
                <Input
                  type="email"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.bank")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.pc")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.ks")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.bic")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.taxService")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm text-zinc-100">
                  {t("addPartner.organization.comment")}
                </label>
                <Input
                  type="text"
                  className="bg-zinc-900 border-zinc-700 text-zinc-100 w-2/3"
                  placeholder="."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block Toggle and Save */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-xl font-normal text-zinc-100">
              {t("addPartner.block")}
            </label>
            <Switch
              disabled={false}
              checked={isBlocked}
              // onCheckedChange={setIsBlocked}
            />
          </div>

          <Button className="bg-[#B69D74] hover:bg-[#a08a65] text-zinc-900 px-8">
            {t("addPartner.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
