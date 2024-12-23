import { Card } from "../../components/ui/card";
import { CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  DriverStatus,
  Driver as DriverType,
  UpdateDriverStatusGQL,
  UpdateDriverProfileGQL,
} from "../../graphql/requests";

import SelectsWithLabel from "../../components/common/SelectsWithLabel";
import InputField from "../../components/common/InputField";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Profile({
  profile,
  isEditing,
  setIsEditing,
  setProfile,
}: {
  profile: DriverType;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setProfile: React.Dispatch<React.SetStateAction<DriverType>>;
}) {
  const handleEdit = () => setIsEditing(true);
  const { t } = useTranslation();
  const [currentState, _] = useState(profile?.status);
  const handleChange = async () => {
    const {
      reviewCount,
      registrationTimestamp,
      lastSeenTimestamp,
      feedbacks,
      enabledServices,
      documents,
      media,
      rating,
      id,
      status,
      ...rest
    } = profile;

    const res: any = await UpdateDriverProfileGQL({
      id: profile.id,
      update: rest,
      serviceIds: [],
    });
    let statusRes: any = { status: true, data: null };
    console.log(currentState, status);
    currentState !== status
      ? (statusRes = await UpdateDriverStatusGQL({
          id: profile.id,
          status: status,
        }))
      : null;

    if (res?.status === true && statusRes?.status === true) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };
  const handleInputChange = (key: string, value: string) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  return (
    <div className="grid md:grid-cols-[2fr,1.5fr] gap-8">
      <div className="space-y-6">
        <Card className="card-shape border-none">
          <CardHeader>
            <CardTitle className="text-gray-100">
              {t("drivers.driver.profile.personalInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
              key="firstName"
              label={t("drivers.driver.profile.firstName")}
              value={profile?.firstName || ""}
              isEditing={isEditing}
              onChange={(e: any) =>
                handleInputChange("firstName", e.target.value)
              }
            />

            <InputField
              key="lastName"
              label={t("drivers.driver.profile.lastName")}
              value={profile?.lastName || ""}
              isEditing={isEditing}
              onChange={(e: any) =>
                handleInputChange("lastName", e.target.value)
              }
            />

            <SelectsWithLabel
              label={t("drivers.driver.profile.gender")}
              key="gender"
              value={profile?.gender || "Male"}
              isEditing={isEditing}
              options={["Male", "Female"]}
              placeholder={profile?.gender || "Male"}
              onChange={(e: any) => handleInputChange("gender", e.target.value)}
            />
            <InputField
              key="email"
              label={t("drivers.driver.profile.email")}
              value={profile?.email || ""}
              isEditing={isEditing}
              placeholder="Not assigned"
              onChange={(e: any) => handleInputChange("email", e.target.value)}
            />

            <InputField
              key="phone"
              label={t("drivers.driver.profile.phone")}
              value={profile?.mobileNumber}
              isEditing={isEditing}
              placeholder="Not assigned"
              onChange={(e: any) =>
                handleInputChange("mobileNumber", e.target.value)
              }
            />
          </CardContent>
        </Card>

        <Card className="card-shape border-none">
          <CardHeader>
            <CardTitle className="text-gray-100">
              {t("drivers.driver.profile.bankInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
              key="bankName"
              label={t("drivers.driver.profile.bankName")}
              value={profile?.bankName || ""}
              isEditing={isEditing}
              placeholder="Not assigned"
              onChange={(e: any) =>
                handleInputChange("bankName", e.target.value)
              }
            />
            <InputField
              key="bankAccountNumber"
              label={t("drivers.driver.profile.bankAccountNumber")}
              value={profile?.accountNumber || ""}
              isEditing={isEditing}
              placeholder="Not assigned"
              onChange={(e: any) =>
                handleInputChange("accountNumber", e.target.value)
              }
            />

            <InputField
              key="bankSwift"
              label={t("drivers.driver.profile.bankSwift")}
              value={profile?.bankSwift || ""}
              isEditing={isEditing}
              placeholder="Not assigned"
              onChange={(e: any) =>
                handleInputChange("bankSwift", e.target.value)
              }
            />
          </CardContent>
        </Card>
        <Card className="card-shape border-none">
          <CardContent className="space-y-4 pt-6">
            <SelectsWithLabel
              label={t("drivers.driver.statusTitle")}
              value={profile?.status || ""}
              placeholder={profile?.status || ""}
              isEditing={isEditing}
              options={Object.values(DriverStatus)}
              onChange={(e: any) => {
                setProfile((prevProfile) => ({
                  ...prevProfile,
                  status: e,
                }));
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="col-span-1 overflow-hidden rounded-lg">
        <Card className="card-shape border-none w-full mb-6">
          <CardContent className="pt-6">
            <div className="rounded-full aspect-square overflow-hidden">
              <img
                src={
                  profile?.media?.address ||
                  "https://up.yimg.com/ib/th?id=OIP.HxV79tFMPfBAIo0BBF-sOgHaEy&pid=Api&rs=1&c=1&qlt=95&w=151&h=97"
                }
                alt="Driver Media"
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="card-shape border-none h-full">
          <CardHeader>
            <CardTitle className="text-gray-100">
              {t("drivers.driver.profile.documents")}
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`space-y-6 min-h-[300px] flex justify-center ${
              profile?.documents?.length > 0
                ? " flex-col items-start"
                : "items-center"
            }`}
          >
            {profile?.documents?.length > 0 ? (
              profile?.documents?.map((card, index) => (
                <Card key={index} className="card-shape border-none">
                  <CardContent className="pt-6">
                    {card?.address && (
                      <div className="rounded-full ">
                        <img src={card?.address} alt="Document" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-100">
                {t("drivers.driver.profile.noDocuments")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="card-shape border-none col-span-2 ">
        <CardHeader>
          <CardTitle className="text-gray-100">
            {t("drivers.driver.profile.cars")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <InputField
            key="carModel"
            label={t("drivers.driver.profile.carModel")}
            value={profile?.carId || ""}
            isEditing={isEditing}
            onChange={(e: any) => handleInputChange("carModel", e.target.value)}
          />

          <InputField
            key="carColor"
            label={t("drivers.driver.profile.carColor")}
            value={profile?.carColorId || ""}
            isEditing={isEditing}
            onChange={(e: any) => handleInputChange("carColor", e.target.value)}
          />

          <InputField
            key="carPlateNumber"
            label={t("drivers.driver.profile.carPlateNumber")}
            value={profile?.carPlate || ""}
            isEditing={isEditing}
            onChange={(e: any) =>
              handleInputChange("carPlateNumber", e.target.value)
            }
          />

          <InputField
            key="carProductionYear"
            label={t("drivers.driver.profile.carProductionYear")}
            value={profile?.carProductionYear || ""}
            isEditing={isEditing}
            onChange={(e: any) =>
              handleInputChange("carProductionYear", e.target.value)
            }
          />
        </CardContent>
      </Card>
      <div className="flex justify-end col-span-3 pr-8">
        {isEditing ? (
          <Button
            onClick={handleChange}
            className="px-7 py-2 font-medium text-lg bg-yellow-500 hover:bg-yellow-400"
          >
            {t("buttons.save")}
          </Button>
        ) : (
          <Button
            onClick={handleEdit}
            className="px-7 py-2 font-medium text-lg bg-slate-900 hover:bg-slate-800"
          >
            {t("buttons.edit")}
          </Button>
        )}
      </div>
    </div>
  );
}
