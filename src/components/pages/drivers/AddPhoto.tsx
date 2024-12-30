import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import Switch from "../../common/Switch";

type PhotoRequirement = {
  id: string;
  label: string;
};

type FormSelectProps = {
  label: string;
  options: { value: string; label: string }[];
  defaultValue: string;
  onChange: (value: string) => void;
};

const photoRequirements: PhotoRequirement[] = [
  { id: "front", label: "In front, so that the state number is visible" },
  { id: "back", label: "The back part so that the state is visible" },
  { id: "right", label: "Right side" },
  { id: "left", label: "Left side" },
  { id: "cabin-front", label: "The front of the cabin" },
  { id: "cabin-back", label: "The back of the cabin" },
  { id: "trunk", label: "Trunk" },
  { id: "documents", label: "Documents" },
];

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  defaultValue,
}) => (
  <div className="flex justify-between">
    <label className="text-sm text-zinc-400">{label}</label>
    <Select defaultValue={defaultValue}>
      <SelectTrigger className="w-2/3 bg-zinc-900 border-none text-slate-200 select-none rounded-full">
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options &&
          options.length > 0 &&
          options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  </div>
);

export default function DriverForm() {
  const { t } = useTranslation();
  const [_photoSettings, setPhotoSettings] = useState({});

  const formSelects = [
    {
      label: t("addPhoto.form.city"),
      options: [{ value: "kazan", label: t("addPhoto.options.kazan") }],
      defaultValue: "kazan",
    },
    {
      label: t("addPhoto.form.profession"),
      options: [{ value: "taxi", label: t("addPhoto.options.taxiDriver") }],
      defaultValue: "taxi",
    },
    {
      label: t("addPhoto.form.carClass"),
      options: [{ value: "business", label: t("addPhoto.options.business") }],
      defaultValue: "business",
    },
    {
      label: t("addPhoto.form.period"),
      options: [
        { value: "shift-start", label: t("addPhoto.options.shiftStart") },
        { value: "24h", label: t("addPhoto.options.every24Hours") },
        { value: "weekly", label: t("addPhoto.options.everyWeek") },
        { value: "monthly", label: t("addPhoto.options.everyMonth") },
      ],
      defaultValue: "shift-start",
    },
  ];

  const handleSelectChange = (label: string, value: string) => {
    setPhotoSettings((prev) => ({ ...prev, [label]: value }));
  };

  return (
    <div className="min-h-screen mr-auto text-zinc-100 p-4">
      <Card className="max-w-2xl  bg-zinc-800 border-none flex flex-col w-2/3">
        <CardContent className="p-6 flex flex-col">
          <h1 className="text-2xl font-semibold mb-6 text-slate-200">
            {t("addPhoto.title")}
          </h1>

          <div className="space-y-6">
            {formSelects &&
              formSelects.length > 0 &&
              formSelects.map((select, index) => (
                <FormSelect
                  key={index}
                  label={select.label}
                  options={select.options}
                  defaultValue={select.defaultValue}
                  onChange={(value) =>
                  handleSelectChange(select.label.toLowerCase(), value)
                }
              />
            ))}

            <div className="space-y-4">
              <label className="text-sm text-zinc-400">
                {t("addPhoto.requirePhotos")}
              </label>

              {photoRequirements &&
                photoRequirements.length > 0 &&
                photoRequirements.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <label htmlFor={item.id} className="text-sm text-slate-200">
                      {t(`addPhoto.photoRequirements.${item.id}`)}
                    </label>
                  </div>

                  <Switch
                    checked={false}
                    // checked={photoSettings[item.id] || false}
                    disabled={false}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button className="ml-auto mt-8 bg-primary px-6 hover:bg-primary/80 text-[#383838]">
            {t("addPhoto.saveButton")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}