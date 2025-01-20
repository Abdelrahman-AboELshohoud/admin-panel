import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HiMiniUserCircle } from "react-icons/hi2";
import { IoNotifications } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { NotificationsGQL } from "../../../graphql/requests";
import { toast } from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

interface NotificationCounts {
  complaints: number;
  distressSignals: number;
  pendingDrivers: number;
}

const MyHeader = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [notificationCounts, setNotificationCounts] =
    useState<NotificationCounts>({
      complaints: 0,
      distressSignals: 0,
      pendingDrivers: 0,
    });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchNotifications = async () => {
    try {
      const response = await NotificationsGQL();
      console.log(response);
      if (response.data) {
        setNotificationCounts({
          complaints: response.data.complaintAggregate[0].count.id,
          distressSignals: response.data.distressSignalAggregate[0].count.id,
          pendingDrivers: response.data.driverAggregate[0].count.id,
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error(t("notifications.errors.fetchFailed"));
    }
  };
  console.log(notificationCounts);

  useEffect(() => {
    fetchNotifications();
    // Fetch notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalNotifications =
    notificationCounts.complaints +
    notificationCounts.distressSignals +
    notificationCounts.pendingDrivers;

  return (
    <header className="w-full h-20 pt-6 flex items-center justify-end gap-6 headerM px-8 mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <button className="relative">
            <IoNotifications size={24} className="text-quaternary" />

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalNotifications}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>{t("notifications.complaints")}</span>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                {notificationCounts.complaints}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>{t("notifications.distressSignals")}</span>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                {notificationCounts.distressSignals}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>{t("notifications.pendingDrivers")}</span>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                {notificationCounts.pendingDrivers}
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <ul
        className="menu dropdown-content bg-base-100 bg-quinary border-slate-900 border-opacity-5 text-slate-300 shadow-sm z-[1] rounded-lg px-5 w-fit py-3"
        style={{ display: openMenu ? "block" : "none" }}
      >
        <li className="text-lg font-semibold py-0.5 text-nowrap">
          {t("header.personalAccount")}
        </li>
        <li className="py-0.5">
          <button
            onClick={handleLogout}
            type="button"
            className="w-full h-full text-start"
          >
            {t("header.logout")}
          </button>
        </li>
      </ul>
      <button
        type="button"
        className="h-full flex items-center justify-end"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <HiMiniUserCircle size={40} className="text-quaternary" />
      </button>
    </header>
  );
};

export default MyHeader;
