import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { TabsContent } from "@radix-ui/react-tabs";
import { Button } from "../../ui/button";
import { useTranslation } from "react-i18next";

export default function Employees() {
  const { t } = useTranslation();
  const staff = [
    {
      id: 1,
      name: "Ivanov Ivan Ivanovich",
      branch: "Branch 1",
      position: "Admin",
      isOnline: true,
    },
    {
      id: 2,
      name: "Petrov Petr Petrovich",
      branch: "Branch 2",
      position: "Admin",
      isOnline: false,
    },
    {
      id: 3,
      name: "Sidorov Sidor Sidorovich",
      branch: "Branch 3",
      position: "Admin",
      isOnline: true,
    },
  ];
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-zinc-100">{t("employees.title")}</h1>
      </div>

      <Tabs defaultValue="working" className="mb-6">
        <TabsList className="bg-transparent mb-2">
          <TabsTrigger value="working" className="custom-tabs">
            {t("employees.tabs.working")}
          </TabsTrigger>
          <TabsTrigger value="invitations" className="custom-tabs">
            {t("employees.tabs.invitations")}
          </TabsTrigger>
          <TabsTrigger value="blocked" className="custom-tabs">
            {t("employees.tabs.blocked")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="working">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder={t("employees.filters.allCities")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("employees.filters.allCities")}
                </SelectItem>
                <SelectItem value="kazan">
                  {t("employees.filters.kazan")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder={t("employees.filters.post")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("employees.filters.allPosts")}
                </SelectItem>
                <SelectItem value="administrator">
                  {t("employees.filters.administrator")}
                </SelectItem>
                <SelectItem value="partnerEmployee">
                  {t("employees.filters.partnerEmployee")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder={t("employees.filters.partners")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("employees.filters.allPartners")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              placeholder={t("employees.search.fullName")}
              className="bg-zinc-900 border-zinc-700 text-zinc-100"
            />
            <Input
              placeholder={t("employees.search.toFind")}
              className="bg-black border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="card-shape">
            <Table>
              <TableHeader>
                <TableRow className="border-transparent text-slate-300 hover:bg-transparent ">
                  <TableHead>{t("employees.table.fullName")}</TableHead>
                  <TableHead>{t("employees.table.jobTitle")}</TableHead>
                  <TableHead>{t("employees.table.branch")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow
                    key={member.id}
                    className="border-transparent hover:bg-transparent py-2 h-14"
                  >
                    <TableCell className="text-zinc-100">
                      <div className="flex items-center gap-2">
                        {member.name}
                        {member.isOnline && (
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.position}
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.branch}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="invitations">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder={t("employees.filters.allCities")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("employees.filters.allCities")}
                </SelectItem>
                <SelectItem value="kazan">
                  {t("employees.filters.kazan")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder={t("employees.filters.post")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("employees.filters.allPosts")}
                </SelectItem>
                <SelectItem value="administrator">
                  {t("employees.filters.administrator")}
                </SelectItem>
                <SelectItem value="partnerEmployee">
                  {t("employees.filters.partnerEmployee")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder={t("employees.filters.partners")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("employees.filters.allPartners")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              placeholder={t("employees.search.fullName")}
              className="bg-zinc-900 border-zinc-700 text-zinc-100"
            />
            <Input
              placeholder={t("employees.search.toFind")}
              className="bg-black border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="card-shape">
            <Table>
              <TableHeader>
                <TableRow className="border-transparent text-slate-300 hover:bg-transparent ">
                  <TableHead>{t("employees.table.fullName")}</TableHead>
                  <TableHead>{t("employees.table.jobTitle")}</TableHead>
                  <TableHead>{t("employees.table.branch")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow
                    key={member.id}
                    className="border-transparent hover:bg-transparent py-2"
                  >
                    <TableCell className="text-zinc-100">
                      <div className="flex items-center gap-2">
                        {member.name}
                        {member.isOnline && (
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.position}
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.branch}
                    </TableCell>
                    <TableCell className="text-zinc-100 flex gap-4">
                      <Button className="bg-transparent border-green-500 border-2 text-green-500 hover:bg-green-500 hover:text-white p-2 rounded-md">
                        {t("employees.actions.sendAgain")}
                      </Button>
                      <Button className="bg-transparent border-red-500 border-2 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-md">
                        {t("employees.actions.cancel")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="blocked">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder={t("employees.filters.allCities")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("employees.filters.allCities")}
                </SelectItem>
                <SelectItem value="kazan">
                  {t("employees.filters.kazan")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder={t("employees.filters.post")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("employees.filters.allPosts")}
                </SelectItem>
                <SelectItem value="administrator">
                  {t("employees.filters.administrator")}
                </SelectItem>
                <SelectItem value="partnerEmployee">
                  {t("employees.filters.partnerEmployee")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="custom-input">
                <SelectValue placeholder={t("employees.filters.partners")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("employees.filters.allPartners")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              placeholder={t("employees.search.fullName")}
              className="bg-zinc-900 border-zinc-700 text-zinc-100"
            />
            <Input
              placeholder={t("employees.search.toFind")}
              className="bg-black border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="card-shape">
            <Table>
              <TableHeader>
                <TableRow className="border-transparent text-slate-300 hover:bg-transparent ">
                  <TableHead>{t("employees.table.fullName")}</TableHead>
                  <TableHead>{t("employees.table.jobTitle")}</TableHead>
                  <TableHead>{t("employees.table.branch")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow
                    key={member.id}
                    className="border-transparent hover:bg-transparent py-2"
                  >
                    <TableCell className="text-zinc-100 h-14">
                      <div className="flex items-center gap-2">
                        {member.name}
                        {member.isOnline && (
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.position}
                    </TableCell>
                    <TableCell className="text-zinc-100">
                      {member.branch}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
