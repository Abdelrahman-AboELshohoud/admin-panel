import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import {
  DeleteAnnouncementGQL,
  ViewAnnouncementGQL,
  UpdateAnnouncementGQL,
  AnnouncementUserType,
  AnnouncementInput,
} from "../../graphql/requests";
import Switch from "../../components/common/Switch";
import DeletionDialog from "../../components/common/DeletionDialog";

export default function SingleNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(5);
  const [_isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<AnnouncementInput>({
    title: "",
    description: "",
    startAt: "",
    expireAt: "",
    userType: [],
  });

  useEffect(() => {
    if (id) {
      ViewAnnouncementGQL({ id }).then((response) => {
        if (response.data?.announcement) {
          const announcement = response.data.announcement;
          setFormData({
            title: announcement.title,
            description: announcement.description,
            startAt: announcement.startAt,
            expireAt: announcement.expireAt,
            userType: Array.isArray(announcement.userType)
              ? announcement.userType
              : [announcement.userType],
          });
        }
      });
    }
  }, [id]);

  useEffect(() => {
    let timer: any;
    if (showDeleteDialog && deleteCountdown > 0) {
      timer = setInterval(() => {
        setDeleteCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showDeleteDialog, deleteCountdown]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await DeleteAnnouncementGQL({
        id: id!,
      });
      console.log(res);
      setShowDeleteDialog(false);
      navigate(`/control-panel/directories/news`);
    } catch (error) {
      console.error(t("errors.deleteError"), error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await UpdateAnnouncementGQL({
        id: id!,
        input: formData,
      });
      console.log(res);
      setIsEditing(false);
      const data = await ViewAnnouncementGQL({ id: id! });
      setFormData(data.data.announcement);
    } catch (error) {
      console.error(t("errors.updateError"), error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const isUserTypeActive = (type: AnnouncementUserType): boolean => {
    return formData.userType?.includes(type) || false;
  };

  const toggleUserType = (type: AnnouncementUserType) => {
    if (!isEditing) return;

    setFormData((prev) => {
      const currentTypes = prev.userType || [];
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          userType: currentTypes.filter((t) => t !== type),
        };
      } else {
        return {
          ...prev,
          userType: [...currentTypes, type],
        };
      }
    });
  };
  return (
    <div className="container  w-1/2 p-6">
      <h2 className="text-2xl font-bold mb-6">{t("announcements.details")}</h2>

      <div className="card-shape">
        <div className="space-y-6 p-6">
          <div className="grid gap-6">
            <div className="border-b pb-4">
              <label className="text-sm font-medium text-muted-foreground">
                {t("announcements.title")}
              </label>
              <input
                name="title"
                value={formData.title}
                readOnly={!isEditing}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mt-1 custom-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">
                {t("announcements.userType")}
                {isEditing && <span className="text-destructive">*</span>}
              </label>
              <div className="flex gap-10">
                {Object.values(AnnouncementUserType).map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Switch
                      disabled={!isEditing}
                      checked={isUserTypeActive(type)}
                      onChange={() => toggleUserType(type)}
                    />
                    <label
                      className={`text-sm ${
                        !isEditing && !isUserTypeActive(type)
                          ? "text-gray-500"
                          : ""
                      }`}
                    >
                      {t(`announcements.userTypes.${type.toLowerCase()}`)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b pb-4">
              <label className="text-sm font-medium text-muted-foreground">
                {t("announcements.description")}
              </label>
              <textarea
                name="description"
                value={formData.description}
                readOnly={!isEditing}
                onChange={handleInputChange}
                className="w-full p-2 h-fit rounded mt-1 bg-[#121212]"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t("announcements.startDate")}
                </label>

                <input
                  type="datetime-local"
                  name="startAt"
                  readOnly={!isEditing}
                  value={formData.startAt}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mt-1 custom-input"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t("announcements.expiryDate")}
                </label>

                <input
                  type="datetime-local"
                  name="expireAt"
                  readOnly={!isEditing}
                  value={formData.expireAt}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mt-1 custom-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4 p-6 bg-muted/40 border-t">
          <Button
            variant="destructive"
            onClick={() => {
              setShowDeleteDialog(true);
              setDeleteCountdown(5);
            }}
          >
            {t("common.delete")}
          </Button>
          {isEditing ? (
            <Button className="w-fit" onClick={handleUpdate}>
              {t("common.save")}
            </Button>
          ) : (
            <Button
              className="w-fit"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              {t("common.edit")}
            </Button>
          )}
        </div>
      </div>

      <DeletionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        countdownSeconds={5}
        onConfirm={handleDelete}
        title={t("announcements.deleteConfirmation")}
        description={t("announcements.deleteWarning")}
      />
    </div>
  );
}
