import { IoIosArrowDown } from "react-icons/io";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.js";
import { useState } from "react";
import Active from "./Active.js";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Customers() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("All");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="w-full p-6 min-h-fit">
      <Tabs
        defaultValue={
          location.pathname.includes("active") ? "active" : "blocked"
        }
        className="w-full"
      >
        <TabsList className="bg-transparent hover:bg-transparent mb-6 w-full">
          <TabsTrigger
            onClick={() => navigate("/control-panel/customers/active")}
            value="active"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
          >
            {t("customers.active")}
          </TabsTrigger>
          <TabsTrigger
            onClick={() => navigate("/control-panel/customers/blocked")}
            value="blocked"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
          >
            {t("customers.blocked")}
          </TabsTrigger>
          <div className="w-[17%] ml-auto relative flex items-center gap-2">
            <button
              onClick={() => setOpen(!open)}
              type="button"
              className="w-full py-3 px-4 bg-[#101010] hover:bg-[#101010]/80 hover:cursor-pointer text-slate-100 rounded-full flex flex-row items-center justify-between"
            >
              {t(`customers.${value.toLowerCase()}`)}
              <IoIosArrowDown size={24} />
            </button>
            <ul
              className="w-full overflow-hidden bg-[#101010] hover:cursor-pointer text-slate-100 rounded-lg absolute top-16 z-10 right-0 "
              style={{ display: open ? "block" : "none" }}
            >
              {["All", "InProgress", "Completed"].map((status) => (
                <li
                  key={status}
                  onClick={() => {
                    setValue(status);
                    setOpen(false);
                  }}
                  value={status.toLowerCase()}
                  className="text-quaternary py-2 hover:bg-quaternary/80 px-4 hover:text-secondary"
                >
                  {t(`customers.${status.toLowerCase()}`)}
                </li>
              ))}
            </ul>
          </div>
        </TabsList>
        <TabsContent value="active" className="bg-transparent h-fit">
          <Active />
        </TabsContent>
        <TabsContent
          value="blocked"
          className="bg-transparent h-fit"
        ></TabsContent>
      </Tabs>
    </div>
  );
}
