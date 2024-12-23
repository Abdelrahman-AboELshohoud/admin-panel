import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useNavigate } from "react-router-dom";

interface NewsItem {
  name: string;
  branch: string;
  activityPeriod: string;
  status: string;
}

export default function News() {
  const { t } = useTranslation();
  const [_activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">{t("news.title")}</h1>
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
          <NewsTable items={[]} />
        </TabsContent>
        <TabsContent value="blocked">
          <NewsTable items={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NewsTable({ items }: { items: NewsItem[] }) {
  const { t } = useTranslation();
  return (
    <div className="card-shape">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-transparent">
            <TableHead>{t("news.table.name")}</TableHead>
            <TableHead>{t("news.table.branch")}</TableHead>
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
            items.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-transparent border-transparent"
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.branch}</TableCell>
                <TableCell>{item.activityPeriod}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
