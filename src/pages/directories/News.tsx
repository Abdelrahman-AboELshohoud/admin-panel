import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AnnouncementsListGQL } from "../../graphql/requests";

import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

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
        (announcement) => {
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

      <Tabs
        defaultValue="active"
        className="w-full bg-transparent"
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4 bg-transparent">
          <TabsTrigger value="active" className="custom-tabs">
            {t("news.tabs.active")}
          </TabsTrigger>
          <TabsTrigger value="blocked" className="custom-tabs">
            {t("news.tabs.blocked")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <NewsTable items={announcements} />
        </TabsContent>
        <TabsContent value="blocked">
          <NewsTable items={announcements} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NewsTable({ items }: { items: Announcement[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formatDateRange = (startAt: string, expireAt: string) => {
    const start = new Date(startAt).toLocaleDateString();
    const end = new Date(expireAt).toLocaleDateString();
    return `${start} - ${end}`;
  };

  return (
    <div className="card-shape">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-transparent">
            <TableHead>{t("news.table.name")}</TableHead>
            <TableHead>{t("news.table.userType")}</TableHead>
            <TableHead>{t("news.table.activityPeriod")}</TableHead>
            <TableHead>{t("news.table.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow className="hover:bg-transparent border-transparent">
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                {t("news.table.noItems")}
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-transparent border-transparent cursor-pointer"
                onClick={() =>
                  navigate(`/control-panel/directories/news/${item.id}`)
                }
              >
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.userType.join(", ")}</TableCell>
                <TableCell>
                  {formatDateRange(item.startAt, item.expireAt)}
                </TableCell>
                <TableCell>
                  {new Date() >= new Date(item.startAt) &&
                  new Date() <= new Date(item.expireAt)
                    ? t("news.status.active")
                    : t("news.status.blocked")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
