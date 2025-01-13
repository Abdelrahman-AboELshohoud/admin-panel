import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import BottomCustomerEdit from "./BottomCustomerEdit";
import LeftCustomerEdit from "./LeftCustomerEdit";
import RightCustomerEdit from "./RightCustomerEdit";
import { useTranslation } from "react-i18next";
import {
  CreateServiceGQL,
  type Service as ServiceType,
  ServicePaymentMethod,
  ServiceInput,
} from "../../../graphql/requests";
import { toast } from "react-hot-toast";

const emptyService: ServiceInput = {
  name: "",
  description: "",
  categoryId: "3",
  baseFare: 0,
  perHundredMeters: 0,
  perMinuteDrive: 0,
  perMinuteWait: 0,
  minimumFee: 0,
  searchRadius: 0,
  maximumDestinationDistance: 0,
  paymentMethod: ServicePaymentMethod.CashCredit,
  cancellationTotalFee: 0,
  cancellationDriverShare: 0,
  providerShareFlat: 0,
  providerSharePercent: 0,
  prepayPercent: 0,
  dateRangeMultipliers: [],
  distanceMultipliers: [],
  timeMultipliers: [],
  weekdayMultipliers: [],
  twoWayAvailable: false,
  mediaId: "2",
  // baseFare: 10.5,
  // cancellationDriverShare: 5.0,
  // cancellationTotalFee: 15.0,
  // categoryId: "1",
  // dateRangeMultipliers: [],
  // description: "Test service description",
  // distanceMultipliers: [],
  // maximumDestinationDistance: 10000,
  // mediaId: "3",
  // minimumFee: 5.0,
  // name: "Test Service",
  // paymentMethod: ServicePaymentMethod.CashCredit,
  // perHundredMeters: 1.5,
  // perMinuteDrive: 0.5,
  // perMinuteWait: 0.25,
  // personCapacity: 4,
  // prepayPercent: 25.0,
  // providerShareFlat: 2.0,
  // providerSharePercent: 80,
  // roundingFactor: 0.5,
  // searchRadius: 5000,
  // timeMultipliers: [],
  // twoWayAvailable: true,
  // weekdayMultipliers: [],
};

export default function AddService() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [service, setService] = useState<ServiceInput>(emptyService);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    console.log(service);
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!service.name) {
        toast.error(t("services.errors.nameRequired"));
        return;
      }

      const response = await CreateServiceGQL({
        input: {
          name: service.name,
          description: service.description,
          categoryId: service.categoryId,
          baseFare: service.baseFare,
          perHundredMeters: service.perHundredMeters,
          perMinuteDrive: service.perMinuteDrive,
          perMinuteWait: service.perMinuteWait,
          minimumFee: service.minimumFee,
          searchRadius: service.searchRadius,
          maximumDestinationDistance: service.maximumDestinationDistance,
          paymentMethod: service.paymentMethod,
          cancellationTotalFee: service.cancellationTotalFee,
          cancellationDriverShare: service.cancellationDriverShare,
          providerShareFlat: service.providerShareFlat,
          providerSharePercent: service.providerSharePercent,
          prepayPercent: service.prepayPercent,
          dateRangeMultipliers: service.dateRangeMultipliers,
          distanceMultipliers: service.distanceMultipliers,
          timeMultipliers: service.timeMultipliers,
          weekdayMultipliers: service.weekdayMultipliers,
          twoWayAvailable: service.twoWayAvailable,
          mediaId: service.mediaId,
        },
      });
      console.log(response);
      if (response.data?.createService) {
        toast.success(t("services.success.created"));
        navigate(`/control-panel/services/${response.data.createService.id}`);
      }
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error(t("services.errors.createFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen card-shape p-8">
      <h1 className="text-4xl mb-8">{t("services.create.title")}</h1>

      <div className="grid grid-cols-2 gap-8">
        <LeftCustomerEdit
          editing={true}
          service={service as ServiceType}
          setService={setService}
        />
        <RightCustomerEdit
          editing={true}
          service={service as ServiceType}
          setService={setService}
          type="add"
        />
      </div>

      <BottomCustomerEdit
        editing={true}
        service={service as ServiceType}
        setService={setService}
        type="add"
      />

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/control-panel/services/active")}
          disabled={isSubmitting}
        >
          {t("common.cancel")}
        </Button>
        <Button
          onClick={handleCreate}
          disabled={isSubmitting || !service.name}
          className={`bg-slate-500 text-black px-8 w-[100px] hover:bg-slate-400 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? t("common.processing") : t("common.submit")}
        </Button>
      </div>
    </div>
  );
}
