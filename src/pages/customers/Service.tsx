import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import DeletionDialog from "../../components/common/DeletionDialog";
import BottomCustomerEdit from "./BottomCustomerEdit";
import LeftCustomerEdit from "./LeftCustomerEdit";
import RightCustomerEdit from "./RightCustomerEdit";
import { useTranslation } from "react-i18next";
import {
  ViewServiceGQL,
  UpdateServiceGQL,
  DeleteServiceGQL,
  type Service as ServiceType,
  ServicePaymentMethod,
  SetRegionsOnServiceGQL,
} from "../../graphql/requests";
import { toast } from "react-hot-toast";

// const mockService: ServiceType = {
//   id: "1",
//   name: "Standard Taxi",
//   description: "Regular taxi service for everyday commuting",
//   categoryId: "cat_001",
//   baseFare: 150,
//   perHundredMeters: 15,
//   perMinuteDrive: 5,
//   perMinuteWait: 3,
//   minimumFee: 200,
//   searchRadius: 5000,
//   maximumDestinationDistance: 100000,
//   paymentMethod: ServicePaymentMethod.CashCredit,
//   cancellationTotalFee: 100,
//   cancellationDriverShare: 50,
//   providerShareFlat: 30,
//   providerSharePercent: 20,
//   prepayPercent: 0,
//   dateRangeMultipliers: [
//     {
//       startDate: 1,
//       endDate: 2,
//       multiply: 1.2,
//     },
//   ],
//   distanceMultipliers: [
//     {
//       distanceFrom: 0,
//       distanceTo: 10000,
//       multiply: 1.0,
//     },
//     {
//       distanceFrom: 10000,
//       distanceTo: 20000,
//       multiply: 1.2,
//     },
//   ],
//   media: {
//     id: "media_001",
//     address:
//       "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
//   },
//   options: [
//     {
//       id: "option_001",
//       name: "Option 1",
//       icon: ServiceOptionIcon.Custom1,
//       type: ServiceOptionType.Paid,
//     },
//   ],
//   regions: [
//     {
//       id: "region_001",
//       name: "Region 1",
//       enabled: true,

//       location: [
//         [
//           {
//             lat: 1,
//             lng: 1,
//           },
//           {
//             lat: 1,
//             lng: 1,
//           },
//           {
//             lat: 1,
//             lng: 1,
//           },
//           {
//             lat: 1,
//             lng: 1,
//           },
//         ],
//       ],
//       currency: "USD",
//     },
//   ],
//   timeMultipliers: [
//     {
//       startTime: "00:00",
//       endTime: "24:00",
//       multiply: 1.0,
//     },
//   ],
//   twoWayAvailable: false,
//   weekdayMultipliers: [
//     {
//       multiply: 1.0,
//       weekday: Weekday.Monday,
//     },
//   ],
//   mediaId: "media_001",
// };

export default function Service() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [service, setService] = useState<ServiceType | undefined>(undefined);
  const [formData, setFormData] = useState<Partial<ServiceType>>({});
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (!id) return;
        const response = await ViewServiceGQL({ id });
        if (response.data?.service) {
          setService(response.data.service);
          setFormData(response.data.service);
          setHasAccess(true);
        }
      } catch (error) {
        setHasAccess(false);
        console.error("Error fetching service:", error);
        toast.error(t("services.errors.fetchFailed"));
      }
    };

    fetchService();
  }, [id]);

  const handleUpdate = async () => {
    try {
      if (!id) return;
      const response1 = await UpdateServiceGQL({
        id,
        input: {
          name: formData.name || service?.name || "",
          description: formData.description || service?.description || "",
          categoryId: formData.categoryId || service?.categoryId || "",
          baseFare: formData.baseFare || service?.baseFare || 0,
          perHundredMeters:
            formData.perHundredMeters || service?.perHundredMeters || 0,
          perMinuteDrive:
            formData.perMinuteDrive || service?.perMinuteDrive || 0,
          perMinuteWait: formData.perMinuteWait || service?.perMinuteWait || 0,
          minimumFee: formData.minimumFee || service?.minimumFee || 0,
          searchRadius: formData.searchRadius || service?.searchRadius || 0,
          maximumDestinationDistance:
            formData.maximumDestinationDistance ||
            service?.maximumDestinationDistance ||
            0,
          paymentMethod:
            formData.paymentMethod ||
            service?.paymentMethod ||
            ServicePaymentMethod.CashCredit,
          cancellationTotalFee:
            formData.cancellationTotalFee || service?.cancellationTotalFee || 0,
          cancellationDriverShare:
            formData.cancellationDriverShare ||
            service?.cancellationDriverShare ||
            0,
          providerShareFlat:
            formData.providerShareFlat || service?.providerShareFlat || 0,
          providerSharePercent:
            formData.providerSharePercent || service?.providerSharePercent || 0,
          prepayPercent: formData.prepayPercent || service?.prepayPercent || 0,
          dateRangeMultipliers:
            formData.dateRangeMultipliers ||
            service?.dateRangeMultipliers ||
            [],
          distanceMultipliers:
            formData.distanceMultipliers || service?.distanceMultipliers || [],
          mediaId: formData.mediaId || service?.mediaId || "",
          timeMultipliers:
            formData.timeMultipliers || service?.timeMultipliers || [],
          twoWayAvailable:
            formData.twoWayAvailable || service?.twoWayAvailable || false,
          weekdayMultipliers:
            formData.weekdayMultipliers || service?.weekdayMultipliers || [],
        },
      });
      let response2;
      if (formData.regions) {
        response2 = await SetRegionsOnServiceGQL({
          id,
          relationIds: formData.regions?.map((region) => region.id) || [],
        });
      }
      if (
        response1.data?.updateService ||
        response2?.data?.setRegionsOnService
      ) {
        toast.success(t("services.success.updated"));
        setIsEditing(false);
      }

      // Refresh service data
      const response = await ViewServiceGQL({ id });
      if (response.data?.service) {
        setService(response.data.service);
        setFormData(response.data.service);
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(t("services.errors.updateFailed"));
    }
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleUpdate();
    } else {
      setIsEditing(true);
    }
  };

  // const handleToggleActive = async (checked: boolean) => {
  //   try {
  //     if (!id) return;
  //     await UpdateServiceGQL({
  //       id,
  //       input: {
  //         ...formData
  //       },
  //     });
  //     setFormData((prev) => ({ ...prev, enabled: checked }));
  //     toast.success(t("services.success.statusUpdated"));
  //   } catch (error) {
  //     console.error("Error updating service status:", error);
  //     toast.error(t("services.errors.statusUpdateFailed"));
  //   }
  // };

  if (!service) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{t("services.loading")}</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex-1 p-6 flex flex-col h-[80vh] justify-center items-center">
        <div className="text-center text-zinc-100 text-4xl font-bold">
          {t("errors.noAccess")}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen card-shape p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl">{service.name}</h1>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="w-[100px]"
        >
          {t("common.delete")}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <LeftCustomerEdit
          editing={isEditing}
          service={service}
          setService={setService}
        />
        <RightCustomerEdit
          editing={isEditing}
          service={service}
          setService={setService}
        />
      </div>

      <BottomCustomerEdit
        editing={isEditing}
        service={service}
        setService={setService}
      />

      <div className="mt-8 flex items-center justify-end gap-4">
        {isEditing && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="w-[100px]"
          >
            {t("common.cancel")}
          </Button>
        )}
        <Button
          onClick={handleToggleEdit}
          className={`bg-slate-500 text-black px-8 w-[100px] hover:bg-slate-400  ${
            isEditing ? "bg-yellow-500 hover:bg-yellow-400" : ""
          }`}
        >
          {isEditing ? t("common.save") : t("common.edit")}
        </Button>
      </div>

      <DeletionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        countdownSeconds={5}
        onConfirm={async () => {
          try {
            await DeleteServiceGQL({
              id: id!,
            });
            navigate("/control-panel/services/active");
            toast.success(t("services.success.deleted"));
          } catch (error) {
            console.error("Error deleting service:", error);
            toast.error(t("services.errors.deleteFailed"));
          }
        }}
        title={t("services.deleteConfirmation")}
        description={t("services.deleteWarning")}
      />
    </div>
  );
}
