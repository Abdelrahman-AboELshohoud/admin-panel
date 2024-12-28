import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import moment from "moment";
import SelectsWithLabel from "../../components/common/SelectsWithLabel";
import { Rider } from "../../graphql/requests";
import { UpdateRiderGQL, Gender } from "../../graphql/requests";
import { useParams } from "react-router-dom";

export default function ClientProfile({
  client,
  formData,
  setFormData,
}: {
  client: Rider;
  formData: Partial<Rider> | null;
  setFormData: (formData: Rider | null) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const { t } = useTranslation();
  const [gender, setGender] = useState<Gender>(Gender.Male);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData({
      ...(formData || {}),
      [e.target.name]: value,
    } as Rider);
  };

  const handleSubmit = async () => {
    try {
      const response = await UpdateRiderGQL({
        id: id!,
        update: {
          firstName: formData?.firstName || "",
          lastName: formData?.lastName || "",
          mobileNumber: formData?.mobileNumber || "",
          email: formData?.email || "",
          gender: gender,
          isResident: formData?.isResident || false,
        },
      });
      if (response.data) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  return (
    <Card className="card-shape text-gray-100">
      <CardHeader className="flex flex-row items-center">
        <div className="flex items-center gap-4">
          <img
            src={client.media?.address || "/avatar.jpg"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <CardTitle className="text-2xl font-bold">
              {client.firstName} {client.lastName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("clients.registeredOn")}:{" "}
              {moment(client.registrationTimestamp).format("DD.MM.YYYY HH:mm")}
            </p>
            <div className="mt-2"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("clients.firstName")}
            </p>
            {isEditing ? (
              <Input
                name="firstName"
                value={formData?.firstName || ""}
                onChange={handleChange}
              />
            ) : (
              <p className="font-medium">{client.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("clients.lastName")}
            </p>
            {isEditing ? (
              <Input
                name="lastName"
                value={formData?.lastName || ""}
                onChange={handleChange}
              />
            ) : (
              <p className="font-medium">{client.lastName}</p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("clients.mobile")}
            </p>
            {isEditing ? (
              <Input
                name="mobileNumber"
                value={formData?.mobileNumber || ""}
                onChange={handleChange}
              />
            ) : (
              <p className="font-medium">{client.mobileNumber}</p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("clients.email")}
            </p>
            {isEditing ? (
              <Input
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
              />
            ) : (
              <p className="font-medium">{client.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <SelectsWithLabel
              options={[Gender.Male, Gender.Female, Gender.Unknown]}
              placeholder={t("clients.gender")}
              isEditing={isEditing}
              label={t("clients.gender")}
              value={gender}
              onChange={(value) => {
                setGender(value);
                console.log(value);
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col  justify-center">
              <h3 className="text-lg font-semibold mb-2">
                {t("clients.orders")}
              </h3>
              <p className="text-muted-foreground text-center py-10">
                {t("clients.totalOrders")}: {client.orders?.totalCount || 0}
              </p>
            </div>
          </div>
          {client.wallets?.nodes?.length > 0 ? (
            client.wallets?.nodes?.map((wallet, index) => (
              <div key={index} className="flex items-center gap-2">
                <p className="font-medium">{wallet.balance}</p>
                <p className="text-muted-foreground">{wallet.currency}</p>
              </div>
            ))
          ) : (
            <div className="flex gap-2 h-40 flex-col">
              <h3 className="text-lg font-semibold">{t("clients.wallets")}</h3>
              <p className="text-muted-foreground text-center py-10">
                {t("clients.noWallet")}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button
            className={`${
              isEditing
                ? "bg-yellow-500 text-gray-100"
                : "bg-gray-900 text-gray-100"
            }`}
            onClick={() => {
              if (isEditing) {
                handleSubmit();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? t("buttons.save") : t("buttons.edit")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
