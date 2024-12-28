import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import BottomCustomerEdit from "./BottomCustomerEdit";
import LeftCustomerEdit from "./LeftCustomerEdit";
import RightCustomerEdit from "./RightCustomerEdit";
import { useTranslation } from "react-i18next";
import {
  CreateServiceGQL,
  type Service as ServiceType,
  ServicePaymentMethod,
} from "../../graphql/requests";
import { toast } from "react-hot-toast";

const emptyService: ServiceType = {
  id: "",
  name: "",
  description: "",
  categoryId: "",
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
  regions: [],
  options: [],
  twoWayAvailable: false,
  media: {
    address: "",
    id: "",
  },
  mediaId: "",
};

export default function AddService() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [service, setService] = useState<ServiceType>(emptyService);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
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
          service={service}
          setService={setService}
        />
        <RightCustomerEdit
          editing={true}
          service={service}
          setService={setService}
        />
      </div>

      <BottomCustomerEdit
        editing={true}
        service={service}
        setService={setService}
        type="add"
      />

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/control-panel/services")}
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
