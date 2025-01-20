import { useEffect, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "./Profile";
import EmailAndPassword from "./EmailAndPassword";
import Balance from "./Balance";
import { useTranslation } from "react-i18next";
import {
  Driver as DriverType,
  ViewDriverGQL,
  DeleteDriverGQL,
} from "../../graphql/requests";
import Feedbacks from "./Feedbacks";
import Orders from "./Orders";
import Wallets from "./Wallets";
import { Button } from "../../components/ui/button";
import DeletionDialog from "../../components/common/dialogs/DeletionDialog";
import MyTabs from "../../components/common/MyTabs";

const Driver: React.FC = () => {
  const [profile, setProfile] = useState<DriverType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(5);
  const [_isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      ViewDriverGQL({ id }).then((data) => {
        console.log(data.data.driver);
        setProfile(data.data.driver);
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
      await DeleteDriverGQL({
        id: id!,
      });
      setShowDeleteDialog(false);
      navigate("/control-panel/drivers/active");
    } catch (error) {
      console.error("Error deleting driver:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const tabItems = [
    { value: "Profile", title: "Profile" },
    { value: "Orders", title: "Orders" },
    { value: "Balance", title: "Balance" },
    { value: "Reviews", title: "Reviews" },
    { value: "Wallets", title: "Wallets" },
    { value: "Photo control", title: "Photo control" },
  ];

  const tabsContent = [
    {
      value: "Profile",
      content: (
        <Profile
          profile={profile as DriverType}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setProfile={
            setProfile as React.Dispatch<React.SetStateAction<DriverType>>
          }
        />
      ),
    },
    {
      value: "Orders",
      content: <Orders driverProfile={profile as DriverType} />,
    },
    {
      value: "Balance",
      content: <Balance profile={profile as DriverType} />,
    },
    {
      value: "Reviews",
      content: <Feedbacks profile={profile as DriverType} />,
    },
    {
      value: "Wallets",
      content: <Wallets />,
    },
    {
      value: "Photo control",
      content: <EmailAndPassword />,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="text-muted-foreground" size={16} />
              <span className="text-foreground">{profile?.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-muted-foreground" size={16} />
              <span className="text-foreground">{profile?.rating} Rating</span>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              setShowDeleteDialog(true);
              setDeleteCountdown(5);
            }}
          >
            {t("common.delete")}
          </Button>
        </div>

        <DeletionDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          countdownSeconds={5}
          onConfirm={handleDelete}
          title={t("drivers.deleteConfirmation")}
          description={t("drivers.deleteWarning")}
        />

        <MyTabs
          tabs={tabItems}
          tabsContent={tabsContent}
          setActiveTab={(value) => {
            navigate(`/control-panel/drivers/active/${profile?.id}/${value}`);
          }}
        />
      </div>
    </div>
  );
};

export default Driver;
