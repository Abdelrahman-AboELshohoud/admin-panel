import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Link, useNavigate } from "react-router-dom";

interface Partner {
  id: number;
  name: string;
  sort: number;
}

export default function Partners() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const partners: Partner[] = [
    { id: 1, name: "Kalina", sort: 4 },
    { id: 2, name: "Altynbaev", sort: 3 },
    { id: 3, name: "Olrus Auto", sort: 1 },
  ];

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{t("partners.title")}</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            navigate("/control-panel/directories/add-partner");
          }}
        >
          <Plus className="h-4 w-4" />
          {t("partners.addNewPartner")}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-[200px] grid-cols-2 bg-transparent">
          <TabsTrigger value="active" className="custom-tabs">
            {t("partners.active")}
          </TabsTrigger>
          <TabsTrigger value="blocked" className="custom-tabs">
            {t("partners.blocked")}
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <Input
            placeholder={t("partners.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm custom-input"
          />
        </div>

        <TabsContent value="active" className="mt-4 ">
          <div className="p-4 bg-[#383838] rounded-xl shadow-lg shadow-[#282828] border-none ">
            <Table className="p-10">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-transparent">
                  <TableHead>{t("partners.tableHeadName")}</TableHead>
                  <TableHead>{t("partners.tableHeadSort")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow
                    key={partner.id}
                    className="hover:bg-transparent border-transparent"
                  >
                    <TableCell>
                      <Link to={`#`} className="text-primary hover:underline">
                        {partner.name}
                      </Link>
                    </TableCell>
                    <TableCell>{partner.sort}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="blocked">
          <div className="text-center py-6 text-muted-foreground">
            {t("partners.noBlockedPartners")}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
