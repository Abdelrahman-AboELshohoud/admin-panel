import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useTranslation } from "react-i18next";

interface Contact {
  id: string;
  type: string;
  name: string;
  value: string;
  visible: boolean;
}

export default function AddBranch() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      type: "Telephone",
      name: "",
      value: "",
      visible: true,
    },
  ]);

  const contactTypes = ["Telephone", "WhatsApp", "Viber", "Telegram", "Link"];

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        id: Math.random().toString(),
        type: "Telephone",
        name: "",
        value: "",
        visible: true,
      },
    ]);
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-normal text-zinc-100">
          {t("addBranch.title")}
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="card-shape">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-2">
                <label className="text-sm text-zinc-100 flex items-center gap-1">
                  {t("addBranch.country")}
                  <span className="text-amber-500">*</span>
                </label>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue
                      placeholder={t("addBranch.countryPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="ru">
                      {t("addBranch.countryOption")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-100">
                  {t("addBranch.city")}
                </label>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue placeholder={t("addBranch.cityPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="moscow">
                      {t("addBranch.cityOption1")}
                    </SelectItem>
                    <SelectItem value="kazan">
                      {t("addBranch.cityOption2")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-100">
                  {t("addBranch.language")}
                </label>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue
                      placeholder={t("addBranch.languagePlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="ru">
                      {t("addBranch.languageOption")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Currency Settings */}
          <Card className="card-shape">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-100 flex items-center gap-1">
                  {t("addBranch.currency")}
                  <span className="text-amber-500">*</span>
                </label>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue
                      placeholder={t("addBranch.currencyPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="rub">
                      {t("addBranch.currencyOption")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-100">
                  {t("addBranch.priceFormat")}
                </label>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue
                      placeholder={t("addBranch.priceFormatPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="format1">
                      {t("addBranch.priceFormatOption")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-sm text-zinc-100">
                    {t("addBranch.soundSignal")}
                  </label>
                  <label className="text-sm text-zinc-400 block">
                    {t("addBranch.newOrder")}
                    <span className="text-amber-500 text-sm"> *</span>
                  </label>
                </div>
                <Select>
                  <SelectTrigger className="custom-input">
                    <SelectValue
                      placeholder={t("addBranch.soundSignalPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="no">
                      {t("addBranch.soundSignalOptionNo")}
                    </SelectItem>
                    <SelectItem value="yes">
                      {t("addBranch.soundSignalOptionYes")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sorting */}
        <Card className="card-shape">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-100">
                {t("addBranch.sorting")}
              </label>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-zinc-100"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder={t("addBranch.sortingPlaceholder")}
              className="bg-transparent border-0 text-zinc-400 px-0 h-auto placeholder:text-zinc-500 border-none select-none resize-none focus-visible:ring-0"
            />
          </CardContent>
        </Card>

        <div className="flex gap-6">
          <Card className="card-shape w-1/2">
            <CardContent className="p-6 space-y-2">
              <label className="text-sm text-zinc-100 flex items-center gap-1">
                {t("addBranch.professions")}
                <span className="text-amber-500">*</span>
              </label>
              <Select>
                <SelectTrigger className="custom-input">
                  <SelectValue
                    placeholder={t("addBranch.professionsPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="taxi">
                    {t("addBranch.professionsOption")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="card-shape w-1/2">
            <CardContent className="p-6 space-y-2">
              <label className="text-sm text-zinc-100">
                {t("addBranch.languages")}
              </label>
              <Select>
                <SelectTrigger className="custom-input">
                  <SelectValue
                    placeholder={t("addBranch.languagesPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="none">
                    {t("addBranch.languagesOption")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Contacts */}
        <Card className="card-shape">
          <CardContent className="p-6 flex flex-col gap-4">
            <label className="text-sm text-zinc-100">
              {t("addBranch.contacts")}
            </label>
            <div className="flex flex-col gap-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="grid grid-cols-12 gap-4 items-center"
                >
                  <div className="col-span-2">
                    <Select defaultValue={contact.type}>
                      <SelectTrigger className="custom-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {contactTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(`addBranch.contactTypes.${type.toLowerCase()}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      placeholder={t("addBranch.contactNamePlaceholder")}
                      className="bg-zinc-900 border-zinc-700 text-zinc-100 "
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      placeholder={t("addBranch.contactTelPlaceholder")}
                      className="bg-zinc-900 border-zinc-700 text-zinc-100"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-red-500 hover:bg-red-600 rounded-full text-white hover:text-black"
                      onClick={() => removeContact(contact.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className=" ml-auto  px-4 py-2 bg-zinc-600 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
                onClick={addContact}
              >
                {t("addBranch.addContact")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-[#B69D74] hover:bg-[#a08a65] text-zinc-900 px-8">
            {t("addBranch.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}