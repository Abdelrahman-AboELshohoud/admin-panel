import { Card } from "../../components/ui/card";
import { CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  DriverStatus,
  CreateDriverGQL,
  Gender,
  UpdateDriverInput,
} from "../../graphql/requests";
import SelectsWithLabel from "../../components/common/form-elements/SelectsWithLabel";
import InputField from "../../components/common/form-elements/InputField";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddDriver() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState<UpdateDriverInput>({
    firstName: "",
    lastName: "",
    gender: Gender.Male,
    email: "",
    mobileNumber: "",
    bankName: "",
    accountNumber: "",
    bankSwift: "",
    status: DriverStatus.WaitingDocuments,
  });

  const handleInputChange = (key: string, value: string | number) => {
    setDriverData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const carProductionYear = undefined;
    console.log({ ...driverData, carProductionYear });
    const res = await CreateDriverGQL({
      input: {
        ...driverData,
      },
    });
    console.log(res);

    if (res?.status === true) {
      navigate("/control-panel/drivers/active");
    }
  };

  return (
    <div className="grid md:grid-cols-[2fr,1.5fr] gap-8">
      <div className="space-y-6">
        <Card className="card-shape border-none h-full">
          <CardHeader>
            <CardTitle className="text-gray-100">
              {t("drivers.driver.profile.personalInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
              key="firstName"
              label={t("drivers.driver.profile.firstName")}
              value={driverData.firstName}
              isEditing={true}
              onChange={(e: any) =>
                handleInputChange("firstName", e.target.value)
              }
            />

            <InputField
              key="lastName"
              label={t("drivers.driver.profile.lastName")}
              value={driverData.lastName}
              isEditing={true}
              onChange={(e: any) =>
                handleInputChange("lastName", e.target.value)
              }
            />

            <SelectsWithLabel
              label={t("drivers.driver.profile.gender")}
              key="gender"
              value={driverData.gender}
              isEditing={true}
              options={Object.values(Gender)}
              placeholder="Select Gender"
              onChange={(e: any) => handleInputChange("gender", e)}
            />

            <InputField
              key="email"
              label={t("drivers.driver.profile.email")}
              value={driverData.email}
              isEditing={true}
              placeholder="Enter email"
              onChange={(e: any) => handleInputChange("email", e.target.value)}
            />

            <InputField
              key="phone"
              label={t("drivers.driver.profile.phone")}
              value={driverData.mobileNumber}
              isEditing={true}
              placeholder="Enter phone number"
              onChange={(e: any) =>
                handleInputChange("mobileNumber", e.target.value)
              }
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
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
              value={driverData.bankName}
              isEditing={true}
              placeholder="Enter bank name"
              onChange={(e: any) =>
                handleInputChange("bankName", e.target.value)
              }
            />

            <InputField
              key="bankAccountNumber"
              label={t("drivers.driver.profile.bankAccountNumber")}
              value={driverData.accountNumber}
              isEditing={true}
              placeholder="Enter account number"
              onChange={(e: any) =>
                handleInputChange("accountNumber", e.target.value)
              }
            />

            <InputField
              key="bankSwift"
              label={t("drivers.driver.profile.bankSwift")}
              value={driverData.bankSwift}
              isEditing={true}
              placeholder="Enter SWIFT code"
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
              value={driverData.status}
              placeholder="Select Status"
              isEditing={true}
              options={Object.values(DriverStatus)}
              onChange={(e: any) => handleInputChange("status", e)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end col-span-2 pr-8">
        <Button
          onClick={handleSubmit}
          className="px-7 py-2 font-medium text-lg bg-yellow-500 hover:bg-yellow-400"
        >
          {t("buttons.save")}
        </Button>
      </div>
    </div>
  );
}
