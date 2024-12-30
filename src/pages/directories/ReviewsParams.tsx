import { useState, useEffect } from "react";
import {
  ReviewParametersListGQL,
  CreateReviewParameterGQL,
  UpdateReviewParameterGQL,
  ReviewParameterViewGQL,
  ReviewParametersListQuery,
} from "../../graphql/requests";
import { Button } from "../../components/ui/button";
import { MyDialog } from "../../components/common/MyDialog";
import Switch from "../../components/common/Switch";
import { Input } from "../../components/ui/input";
import toast from "react-hot-toast";
import { Plus, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReviewParam {
  id: string;
  title: string;
  isGood: boolean;
}

interface ReviewParamFormData {
  title: string;
  isGood: boolean;
}

export default function ReviewsParams() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [data, setData] = useState<ReviewParametersListQuery>({
    feedbackParameters: [],
  });

  const [selectedParam, setSelectedParam] = useState<ReviewParam | null>(null);
  const [formData, setFormData] = useState<ReviewParamFormData>({
    title: "",
    isGood: true,
  });

  const fetchData = async () => {
    try {
      const response = await ReviewParametersListGQL({});
      if (response?.data.feedbackParameters) {
        setData({ feedbackParameters: response.data.feedbackParameters });
      }
    } catch (error) {
      toast.error("Failed to fetch review parameters");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await CreateReviewParameterGQL({
        input: {
          title: formData.title,
          isGood: formData.isGood,
        },
      });

      if (response?.status) {
        toast.success("Review parameter created successfully");
        setIsCreateDialogOpen(false);
        setFormData({ title: "", isGood: true });
        fetchData();
      } else {
        throw new Error("Failed to create parameter");
      }
    } catch (error) {
      toast.error("Failed to create review parameter");
    }
  };

  const handleUpdate = async () => {
    if (!selectedParam) return;

    try {
      const response = await UpdateReviewParameterGQL({
        id: selectedParam.id,
        update: {
          title: formData.title,
          isGood: formData.isGood,
        },
      });

      if (response?.status) {
        toast.success("Review parameter updated successfully");
        setIsEditDialogOpen(false);
        fetchData();
      } else {
        throw new Error("Failed to update parameter");
      }
    } catch (error) {
      toast.error("Failed to update review parameter");
    }
  };

  const openEditDialog = async (param: ReviewParam) => {
    try {
      const response = await ReviewParameterViewGQL({ id: param.id });
      if (response?.data.feedbackParameter) {
        setSelectedParam(response.data.feedbackParameter);
        setFormData({
          title: response.data.feedbackParameter.title,
          isGood: response.data.feedbackParameter.isGood,
        });
        setIsEditDialogOpen(true);
      }
    } catch (error) {
      toast.error("Failed to load parameter details");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("reviews.parameters")}</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t("reviews.addParameter")}
        </Button>
      </div>

      <div className="grid gap-4">
        {data?.feedbackParameters.map((param: ReviewParam) => (
          <div
            key={param.id}
            className="flex items-center justify-between p-4 bg-[#202020] rounded-lg shadow"
          >
            <div className="flex items-center space-x-4">
              <span
                className={`text-lg ${
                  param.isGood ? "text-green-600" : "text-red-600"
                }`}
              >
                {param.title}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => openEditDialog(param)}>
                <Pencil className="w-4 h-4 " />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Dialog */}
      <MyDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title={t("reviews.addParameter")}
        showCloseButton={false}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("reviews.title")}
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={t("reviews.parameterTitle")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t("reviews.isGood")}</label>
            <Switch
              disabled={false}
              checked={formData.isGood}
              onChange={(e) =>
                setFormData({ ...formData, isGood: e.target.checked })
              }
            />
          </div>
          <div className="flex justify-between space-x-2">
            <Button
              className="text-gray-600 border-transparent "
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleCreate}>{t("common.create")}</Button>
          </div>
        </div>
      </MyDialog>

      {/* Edit Dialog */}
      <MyDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title={t("reviews.editParameter")}
        showCloseButton={false}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("reviews.title")}
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={t("reviews.parameterTitle")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t("reviews.isGood")}</label>
            <Switch
              disabled={false}
              checked={formData.isGood}
              onChange={(e) =>
                setFormData({ ...formData, isGood: e.target.checked })
              }
            />
          </div>
          <div className="flex justify-between space-x-2">
            <Button
              className="text-gray-600 border-transparent"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={handleUpdate}>{t("common.update")}</Button>
          </div>
        </div>
      </MyDialog>
    </div>
  );
}
