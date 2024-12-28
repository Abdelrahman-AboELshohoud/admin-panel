import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ServicesListGQL,
  DeleteServiceCategoryGQL,
  UpdateServiceCategoryGQL,
  CreateServiceCategoryGQL,
  ServiceCategory,
  ServiceCategoryInput,
} from "../../graphql/requests.js";
import { Button } from "../../components/ui/button.js";
import { Input } from "../../components/ui/input";
import { MyDialog } from "../../components/common/MyDialog";
import DeletionDialog from "../../components/common/DeletionDialog";
import toast from "react-hot-toast";

export default function Services() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hasAccess, setHasAccess] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [editedCategories, setEditedCategories] = useState<{
    [key: string]: string;
  }>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Simulated API response
      const mockResponse = {
        data: {
          serviceCategories: [
            {
              id: "1",
              name: "Transportation",
              services: [
                {
                  id: "101",
                  name: "Standard Ride",
                  description: "Comfortable ride for up to 4 passengers",
                  media: {
                    address: "https://placehold.co/600x400?text=Standard+Ride",
                  },
                },
                {
                  id: "102",
                  name: "Premium Ride",
                  description: "Luxury vehicle with professional driver",
                  media: {
                    address: "https://placehold.co/600x400?text=Premium+Ride",
                  },
                },
              ],
            },
            {
              id: "2",
              name: "Delivery",
              services: [
                {
                  id: "201",
                  name: "Express Delivery",
                  description: "Same day delivery service",
                  media: {
                    address:
                      "https://placehold.co/600x400?text=Express+Delivery",
                  },
                },
              ],
            },
          ],
        },
      };
      setCategories(mockResponse.data.serviceCategories);
      toast.success(t("services.fetchSuccess"));
    } catch (error) {
      setHasAccess(false);
      toast.error(t("errors.fetchError"));
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await DeleteServiceCategoryGQL({
        id: categoryId,
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
      toast.success(t("services.deleteSuccess"));
    } catch (error) {
      toast.error(t("errors.deleteError"));
      console.error("Error deleting category:", error);
    }
  };

  const handleUpdateCategories = async () => {
    try {
      const input: ServiceCategoryInput = {
        name: editedCategories[categories[0].id] || categories[0].name,
      };
      await UpdateServiceCategoryGQL({
        input,
        id: categories[0].id,
      });
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          name: editedCategories[cat.id] || cat.name,
        }))
      );
      setIsEditing(false);
      setEditedCategories({});
      toast.success(t("services.updateSuccess"));
    } catch (error) {
      toast.error(t("errors.updateError"));
      console.error("Error updating categories:", error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const input: ServiceCategoryInput = {
        name: newCategoryName,
      };
      // Simulated API response
      const mockResponse = {
        data: {
          createServiceCategory: {
            id: Math.random().toString(),
            name: newCategoryName,
            services: [],
          },
        },
      };
      setCategories((prev) => [
        ...prev,
        mockResponse.data.createServiceCategory,
      ]);
      setIsAddDialogOpen(false);
      setNewCategoryName("");
      toast.success(t("services.createSuccess"));
    } catch (error) {
      toast.error(t("errors.createError"));
      console.error("Error creating category:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (!hasAccess) {
    return (
      <div className="flex-1 p-6 flex flex-col h-[80vh] justify-center items-center">
        <div className="text-center text-zinc-100 text-4xl font-bold">
          {t("errors.noAccess")}
        </div>
      </div>
    );
  }

  const canEdit = categories && categories.length > 0 ? true : false;

  return (
    <div className="w-full p-6 min-h-fit">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Services Management</h1>
        <div className="flex gap-4">
          {!isEditing && (
            <>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="add-button px-6 py-5 text-base"
              >
                {t("services.addCategory")}
              </Button>
              <Button
                onClick={() => navigate("/control-panel/services/add")}
                className="add-button px-6 py-5 text-base"
              >
                {t("services.addService")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-transparent h-fit">
        {loading ? (
          <h3 className="text-center text-zinc-100 text-3xl font-medium py-20">
            {t("common.loading")}
          </h3>
        ) : !categories || categories.length === 0 ? (
          <h3 className="text-center text-zinc-100 text-3xl font-medium py-20">
            {t("services.noServices")}
          </h3>
        ) : (
          <div className="space-y-8">
            {categories?.map((category) => (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  {isEditing ? (
                    <Input
                      value={editedCategories[category.id] || category.name}
                      onChange={(e) =>
                        setEditedCategories((prev) => ({
                          ...prev,
                          [category.id]: e.target.value,
                        }))
                      }
                      className="max-w-xs"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-gray-100">
                      {category.name}
                    </h2>
                  )}
                  {isEditing && (
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setCategoryToDelete(category.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        {t("common.delete")}
                      </Button>
                    </div>
                  )}
                </div>

                {!category.services || category.services.length === 0 ? (
                  <div className="text-gray-400">
                    {t("services.noCategoryServices")}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-6">
                    {category.services.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 card-shape rounded-lg cursor-pointer flex flex-col gap-4"
                        onClick={() =>
                          navigate(
                            `/control-panel/services/active/${service.id}`
                          )
                        }
                      >
                        <img
                          src={service?.media?.address}
                          alt={service.name}
                          className="w-full h-48 object-cover rounded mt-2"
                        />
                        <h3 className="text-lg font-semibold mb-2 text-gray-100">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-400 min-h-14 line-clamp-3 break-words">
                          {service.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <MyDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title={t("services.addCategory")}
      >
        <Input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder={t("services.categoryName")}
        />
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleCreateCategory}>{t("common.save")}</Button>
        </div>
      </MyDialog>

      <DeletionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          if (categoryToDelete) {
            await handleDeleteCategory(categoryToDelete);
          }
        }}
        title={t("services.deleteCategory")}
        description={t("services.deleteCategoryConfirmation")}
      />

      <div className="flex justify-end mt-8 gap-4">
        {isEditing && (
          <Button
            onClick={handleUpdateCategories}
            className="add-button px-6 py-5 text-base bg-amber-500 hover:bg-amber-600"
          >
            {t("common.save")}
          </Button>
        )}
        {canEdit && (
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="add-button px-6 py-5 text-base"
          >
            {isEditing ? t("common.cancel") : t("common.edit")}
          </Button>
        )}
      </div>
    </div>
  );
}
