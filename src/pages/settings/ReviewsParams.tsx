import { useState } from "react";
import {
  ReviewParametersListGQL,
  CreateReviewParameterGQL,
  UpdateReviewParameterGQL,
  ReviewParameterViewGQL,
  ReviewParametersListQuery,
} from "../../graphql/requests";
import { Button } from "../../components/ui/button";
import { MyDialog } from "../../components/common/MyDialog";
import { Switch } from "@radix-ui/react-switch";
import { Input } from "../../components/ui/input";
import toast from "react-hot-toast";
import { Loader2, Plus, Pencil, Trash } from "lucide-react";

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [data, setData] = useState<ReviewParametersListQuery>();

  const [selectedParam, setSelectedParam] = useState<ReviewParam | null>(null);
  const [formData, setFormData] = useState<ReviewParamFormData>({
    title: "",
    isGood: true,
  });

  const fetchData = async () => {
    const res = await ReviewParametersListGQL({});
    console.log(res.data);
    setData(res.data);
  };

  const handleCreate = async () => {
    try {
      await CreateReviewParameterGQL({
        input: {
          title: formData.title,
          isGood: formData.isGood,
        },
      });
      toast.success("Review parameter created successfully");
      setIsCreateDialogOpen(false);
      setFormData({ title: "", isGood: true });
    } catch (error) {
      toast.error("Failed to create review parameter");
    }
  };

  const handleUpdate = async () => {
    if (!selectedParam) return;

    try {
      await UpdateReviewParameterGQL({
        id: selectedParam.id,
        update: {
          title: formData.title,
          isGood: formData.isGood,
        },
      });
      toast.success("Review parameter updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update review parameter");
    }
  };

  const openEditDialog = (param: ReviewParam) => {
    setSelectedParam(param);
    setFormData({
      title: param.title,
      isGood: param.isGood,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Review Parameters</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Parameter
        </Button>
      </div>

      <div className="grid gap-4">
        {data?.feedbackParameters.map((param: ReviewParam) => (
          <div
            key={param.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
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
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Dialog */}
      <MyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Create Review Parameter"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter parameter title"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Is Positive?</label>
            <Switch
              checked={formData.isGood}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isGood: checked })
              }
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </MyDialog>

      {/* Edit Dialog */}
      <MyDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Review Parameter"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter parameter title"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Is Positive?</label>
            <Switch
              checked={formData.isGood}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isGood: checked })
              }
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </div>
      </MyDialog>
    </div>
  );
}
