import { useEffect, useState } from "react";

import { MapPin, Star } from "lucide-react";

import { Tabs, TabsList } from "../../components/ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
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

import DeletionDialog from "../../components/common/DeletionDialog";

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

        <Tabs defaultValue={"Profile"} className="w-full">
          <TabsList className="bg-transparent hover:bg-transparent flex flex-wrap gap-4 justify-start mb-6 w-full">
            {[
              "Profile",
              "Orders",
              "Balance",
              "Reviews",
              "Wallets",
              "Photo control",
            ].map((tab) => (
              <TabsTrigger
                onClick={() => {
                  navigate(
                    `/control-panel/drivers/active/${profile?.id}/${tab}`
                  );
                }}
                key={tab}
                value={tab}
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={"Profile"} className="space-y-6">
            <Profile
              profile={profile as DriverType}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setProfile={
                setProfile as React.Dispatch<React.SetStateAction<DriverType>>
              }
            />
          </TabsContent>
          <TabsContent value={"Call sign and password"} className="space-y-6">
            <EmailAndPassword />
          </TabsContent>
          <TabsContent value={"Balance"} className="space-y-6">
            <Balance profile={profile as DriverType} />
          </TabsContent>
          <TabsContent value={"Reviews"} className="space-y-6">
            <Feedbacks profile={profile as DriverType} />
          </TabsContent>
          <TabsContent value={"Orders"} className="space-y-6">
            <Orders driverProfile={profile as DriverType} />
          </TabsContent>
          <TabsContent value={"Wallets"} className="space-y-6">
            <Wallets driverProfile={profile as DriverType} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Driver;
