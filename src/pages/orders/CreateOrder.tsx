import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { MyDialog } from "../../components/common/dialogs/MyDialog";
import { toast } from "react-hot-toast";
import {
  CreateOrderGQL,
  ServicesListGQL,
  type Service,
} from "../../graphql/requests";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { format } from "date-fns";
import { cn } from "../../lib/utils";

interface OrderFormData {
  addresses: string[];
  serviceId?: string;
  riderId: string;
  driverId?: string;
  expectedTimestamp?: Date;
  waitMinutes?: number;
  paymentMethodId?: string;
  points: Array<{
    lat: number;
    lng: number;
  }>;
}

export default function CreateOrder() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<OrderFormData>({
    addresses: [""],
    points: [],
    riderId: "",
  });

  const fetchServices = async () => {
    try {
      const response = await ServicesListGQL({});
      if (response.data?.services) {
        setServices(response.data.services);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error(t("orders.errors.fetchServicesFailed"));
    }
  };

  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, ""],
    }));
  };

  const handleRemoveAddress = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }));
  };

  const handleAddressChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) => (i === index ? value : addr)),
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await CreateOrderGQL({
        riderId: formData.riderId,
        addresses: formData.addresses,
        serviceId: formData.serviceId!,
        points: formData.points,
        intervalMinutes: 10,
      });

      if (response.data?.createOrder) {
        toast.success(t("orders.success.created"));
        navigate("/orders");
      } else {
        toast.error(t("orders.errors.createFailed"));
      }

      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(t("orders.errors.createFailed"));
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="container w-1/2 p-6 text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("orders.create.title")}</h1>
      </div>

      <div className="card-shape">
        <div className="space-y-6 p-6">
          {/* Addresses */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {t("orders.create.addresses")}
            </label>
            {formData.addresses.map((address, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={address}
                  onChange={(e) => handleAddressChange(index, e.target.value)}
                  placeholder={t("orders.create.addressPlaceholder")}
                  className="flex-1"
                />
                {index > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveAddress(index)}
                  >
                    {t("common.remove")}
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={handleAddAddress}
              className="w-fit ml-auto text-gray-600"
            >
              {t("orders.create.addAddress")}
            </Button>
          </div>

          {/* Service Selection */}
          <div className="flex flex-row justify-between items-center">
            <label className=" font-medium">{t("orders.create.service")}</label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, serviceId: value }))
              }
            >
              <SelectTrigger className="custom-input w-1/3">
                <SelectValue placeholder={t("orders.create.selectService")} />
              </SelectTrigger>
              <SelectContent>
                {services &&
                  services.length > 0 &&
                  services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expected Time with Calendar */}
          <div className="flex flex-row justify-between items-center">
            <label className="font-medium">
              {t("orders.create.expectedTime")}
            </label>
            <div className="flex gap-2 items-center custom-input w-1/3">
              <Popover>
                <PopoverTrigger
                  asChild
                  className="bg-transparent border-none hover:bg-transparent hover:text-gray-200 p-0 mx-auto"
                >
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      setFormData((prev) => ({
                        ...prev,
                        expectedTimestamp: date,
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center">
            <label className=" font-medium">
              {t("orders.create.waitTime")}
            </label>
            <Input
              type="number"
              min="0"
              value={formData.waitMinutes || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  waitMinutes: parseInt(e.target.value),
                }))
              }
              className="custom-input w-1/3"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setShowConfirmDialog(true)}
              disabled={
                isLoading || !formData.serviceId || !formData.addresses.length
              }
            >
              {t("orders.create.submit")}
            </Button>
          </div>
        </div>
      </div>

      <MyDialog
        isOpen={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={t("orders.create.confirmTitle")}
        description={t("orders.create.confirmDescription")}
      >
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? t("common.processing") : t("common.confirm")}
          </Button>
        </div>
      </MyDialog>
    </div>
  );
}
