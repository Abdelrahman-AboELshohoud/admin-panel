import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AnnouncementsListGQL } from "../../graphql/requests";
import { Button } from "../../components/ui/button";
import MyTable from "../../components/common/table-components/MyTable";
import MyTabs from "../../components/common/MyTabs";

interface Announcement {
  id: string;
  title: string;
  description: string;
  userType: string[];
  startAt: string;
  expireAt: string;
  url?: string;
}

export default function News() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, [activeTab]);

  const fetchAnnouncements = async () => {
    try {
      const response = await AnnouncementsListGQL({
        paging: {
          limit: 100,
        },
      });
      console.log(response);

      const fetchedAnnouncements = response.data.announcements.nodes;

      // Filter based on active/blocked status
      const filteredAnnouncements = fetchedAnnouncements.filter(
        (announcement: Announcement) => {
          const now = new Date();
          const startDate = new Date(announcement.startAt);
          const endDate = new Date(announcement.expireAt);
          const isActive = now >= startDate && now <= endDate;
          return activeTab === "active" ? isActive : !isActive;
        }
      );

      setAnnouncements(filteredAnnouncements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const headers = [
    t("news.table.name"),
    t("news.table.userType"),
    t("news.table.activityPeriod"),
    t("news.table.status"),
  ];

  const formatDateRange = (startAt: string, expireAt: string) => {
    const start = new Date(startAt).toLocaleDateString();
    const end = new Date(expireAt).toLocaleDateString();
    return `${start} - ${end}`;
  };

  const getTableRows = (items: Announcement[]) => {
    if (items.length === 0) {
      return [
        {
          id: "no-data",
          data: [
            <div className="text-center text-muted-foreground col-span-4">
              {t("news.table.noItems")}
            </div>,
          ],
        },
      ];
    }

    return items.map((item) => ({
      id: item.id,
      data: [
        item.title,
        item.userType.join(", "),
        formatDateRange(item.startAt, item.expireAt),
        new Date() >= new Date(item.startAt) &&
        new Date() <= new Date(item.expireAt)
          ? t("common.active")
          : t("common.blocked"),
      ],
      navigate: () => navigate(`/control-panel/directories/news/${item.id}`),
    }));
  };

  const tabs = [
    {
      title: t("common.active"),
      value: "active",
    },
    {
      title: t("common.blocked"),
      value: "blocked",
    },
  ];

  const tabContents = [
    {
      value: "active",
      content: (
        <MyTable
          key="active"
          headers={headers}
          rows={getTableRows(announcements)}
        />
      ),
    },
    {
      value: "blocked",
      content: (
        <MyTable
          key="blocked"
          headers={headers}
          rows={getTableRows(announcements)}
        />
      ),
    },
  ];

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("news.title")}
        </h1>
        <Button
          className="gap-2 add-button"
          onClick={() => {
            navigate("/control-panel/directories/add-news");
          }}
        >
          <Plus className="h-4 w-4" />
          {t("news.addButton")}
        </Button>
      </div>

      <div className="bg-[#1C1C1E] rounded-xl p-4">
        <MyTabs
          tabs={tabs}
          tabsContent={tabContents}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}
