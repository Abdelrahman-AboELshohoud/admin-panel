import { IoIosArrowDown } from "react-icons/io";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.js";
import { useState } from "react";
import Active from "./Active.js";
import Blocked from "./Blocked.js";
import Customer from "./Customer.js";
import Performers from "../drivers/Drivers.js";
import Cars from "../drivers/Cars.js";
import Driver from "../drivers/Driver.js";
import EmailAndPassword from "../drivers/EmailAndPassword.js";
import Balance from "../drivers/Balance.js";
import Reports from "../reports/Orders.js";
import Orders from "../reports/Orders.js";
import ListOfOrders from "../reports/ListOfOrders.js";
import ByTheClock from "../reports/ByTheClock.js";
import { useNavigate, useLocation } from "react-router-dom";
export default function Customers() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("All");
  const navigate = useNavigate();
  const location = useLocation();

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
            Active Customers
          </TabsTrigger>
          <TabsTrigger
            onClick={() => navigate("/control-panel/customers/blocked")}
            value="blocked"
            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-slate-300 text-quaternary"
          >
            Blocked Customers
          </TabsTrigger>
          <div className="w-[17%] ml-auto relative flex items-center gap-2">
            <button
              onClick={() => setOpen(!open)}
              type="button"
              className="w-full py-3 px-4 bg-[#101010] hover:bg-[#101010]/80 hover:cursor-pointer text-slate-100 rounded-full flex flex-row items-center justify-between"
            >
              {value}
              <IoIosArrowDown size={24} />
            </button>
            <ul
              className="w-full overflow-hidden bg-[#101010] hover:cursor-pointer text-slate-100 rounded-lg absolute top-16 z-10 right-0 "
              style={{ display: open ? "block" : "none" }}
            >
              <li
                onClick={() => {
                  setValue("All");
                  setOpen(false);
                }}
                value="all"
                className="text-quaternary py-2 hover:bg-quaternary/80 px-4 hover:text-secondary"
              >
                All
              </li>
              <li
                onClick={() => {
                  setValue("In progress");
                  setOpen(false);
                }}
                value="in progress"
                className="text-quaternary py-2 hover:bg-quaternary/80 px-4 hover:text-secondary"
              >
                In progress
              </li>
              <li
                onClick={() => {
                  setValue("Completed");
                  setOpen(false);
                }}
                value="completed"
                className="text-quaternary py-2 hover:bg-quaternary/80 px-4 hover:text-secondary"
              >
                Completed
              </li>
            </ul>
          </div>
        </TabsList>
        <TabsContent value="active" className="bg-transparent h-fit">
          <Active />
          {/* <Customer /> */}
          {/* <Performers /> */}
          {/* <Cars /> */}
          {/* <Driver /> */}
          {/* <EmailAndPassword /> */}
          {/* <Balance /> */}
          {/* <Orders /> */}
          {/* <ListOfOrders /> */}
          {/* <ByTheClock /> */}
        </TabsContent>
        <TabsContent value="blocked" className="bg-transparent h-fit">
          <Blocked />
        </TabsContent>
      </Tabs>
    </div>
  );
}
