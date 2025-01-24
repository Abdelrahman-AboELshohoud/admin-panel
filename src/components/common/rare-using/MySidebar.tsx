import { Link, useLocation } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { useState } from "react";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { FaClock } from "react-icons/fa6";
import { FaUsers, FaCar, FaFileAlt, FaBook, FaCog } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { useTranslation } from "react-i18next";
import ChangeLanguageBtn from "./ChangeLanguageBtn";

const MySidebar = () => {
  const [_menu, setMenu] = useState<string>("Main");
  const location = useLocation();
  const pathname = location.pathname;
  const { t } = useTranslation();

  const links = [
    {
      name: t("links.main"),
      path: "/control-panel/main",
      icon: <HiMiniSquares2X2 />,
    },
    {
      name: t("links.orders"),
      path: "/control-panel/orders",
      icon: <FaClock />,
    },
  ];

  const dropDowns = [
    {
      name: t("links.customers.title"),
      icon: <FaUsers />,
      links: [
        {
          name: t("links.customers.services"),
          path: "/control-panel/services/active",
        },
        {
          name: t("links.customers.clients"),
          path: "/control-panel/clients/active",
        },
      ],
    },
    {
      name: t("links.drivers.title"),
      icon: <FaCar />,
      links: [
        {
          name: t("links.drivers.title"),
          path: "/control-panel/drivers/active",
        },
        { name: t("links.drivers.cars"), path: "/control-panel/cars/active" },
        {
          name: t("links.drivers.groups"),
          path: "/control-panel/drivers-groups/active",
        },
        {
          name: t("links.drivers.photoControl"),
          path: "/control-panel/drivers-photo-control/active",
        },
      ],
    },
    {
      name: t("links.reports.title"),
      icon: <FaFileAlt className="" />,
      links: [
        {
          name: t("links.reports.listOfOrders"),
          path: "/control-panel/reports/list-of-orders",
        },
        { name: "Orders", path: "/control-panel/reports/orders/statistics" },
        {
          name: t("links.reports.moneyTransactions"),
          path: "/control-panel/reports/money-transactions",
        },
        // {
        //   name: t("links.reports.sos"),
        //   path: "/control-panel/reports/sos",
        // },
        {
          name: t("links.reports.corporationClients"),
          path: "/control-panel/reports/corporation-clients",
        },
        {
          name: t("links.reports.forPartner"),
          path: "/control-panel/reports/for-partner",
        },
        {
          name: t("links.reports.forAggregator"),
          path: "/control-panel/reports/for-aggregator",
        },
        {
          name: t("links.reports.complaints"),
          path: "/control-panel/reports/complaints",
        },
        {
          name: t("links.reports.shifts"),
          path: "/control-panel/reports/shifts",
        },
      ],
    },
    {
      name: t("links.directories.title"),
      icon: <FaBook />,
      links: [
        {
          name: t("links.directories.branches"),
          path: "/control-panel/directories/branches",
        },
        {
          name: t("links.directories.partners"),
          path: "/control-panel/directories/partners",
        },
        {
          name: t("links.directories.zonesPrices"),
          path: "/control-panel/directories/zones-prices",
        },
        {
          name: t("links.directories.employees"),
          path: "/control-panel/directories/employees",
        },
        {
          name: t("links.directories.reviewsParams"),
          path: "/control-panel/directories/reviews-params",
        },
        {
          name: t("links.directories.map"),
          path: "/control-panel/directories/map",
        },
        {
          name: t("links.directories.news"),
          path: "/control-panel/directories/news",
        },
        {
          name: t("links.directories.addresses"),
          path: "/control-panel/directories/addresses",
        },
      ],
    },
    {
      name: t("links.settings.title"),
      icon: <FaCog />,
      links: [
        {
          name: t("links.settings.payment"),
          path: "/control-panel/settings/payment",
        },
        {
          name: t("Organization details"),
          path: "/control-panel/settings/organization-details",
        },
        {
          name: t("links.settings.application"),
          path: "/control-panel/settings/application",
        },
        {
          name: t("links.settings.orders"),
          path: "/control-panel/settings/orders",
        },
        {
          name: t("links.settings.cmc"),
          path: "/control-panel/settings/cmc",
        },
        {
          name: t("links.settings.notifications"),
          path: "/control-panel/settings/notifications",
        },
        {
          name: t("links.settings.drivers"),
          path: "/control-panel/settings/drivers",
        },
        {
          name: t("links.settings.carClasses"),
          path: "/control-panel/settings/car-classes",
        },
        {
          name: t("links.settings.onlineCheckout"),
          path: "/control-panel/settings/online-checkout",
        },
        {
          name: t("links.settings.atc"),
          path: "/control-panel/settings/atc",
        },
        {
          name: t("links.settings.configuration"),
          path: "/control-panel/settings/configuration",
        },
      ],
    },
  ];

  return (
    <aside className="h-screen bg-senary asideM col-span-2 rounded-r-3xl overflow-hidden">
      <nav className="w-full h-full flex flex-col items-start gap-20 pt-10 overflow-y-auto mysidebar">
        <img
          src="/logo.svg"
          alt="logo"
          draggable={false}
          className="w-32 h-32 mx-auto"
        />
        <div className="flex flex-col w-full text-slate-100 py-10">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenu(link.name)}
              className={cn(
                "px-4 py-3 w-full text-lg font-medium flex items-center gap-2 transition-colors hover:bg-stone-200/20",
                pathname.split("/")[2] === link.name.toLowerCase() &&
                  "bg-stone-200/20"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          <Accordion type="single" collapsible className="w-full">
            {dropDowns.map((dropdown) => (
              <AccordionItem
                key={dropdown.name}
                value={dropdown.name}
                className="border-none"
              >
                <AccordionTrigger className="px-4 py-3 w-full text-lg font-medium gap-2 flex items-center hover:underline-none transition-colors hover:bg-stone-200/20 border-none">
                  <div>{dropdown.icon}</div>
                  {dropdown.name}
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="">
                    {dropdown.links.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setMenu(link.name)}
                        className={cn(
                          "flex w-full items-center p-2 hover:bg-stone-200/20",
                          pathname.split("/")[2] === link.name.toLowerCase() &&
                            "bg-stone-200/20"
                        )}
                      >
                        <span className="ml-2">{link.name}</span>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className=" mt-10 pl-6 pb-4">
            <ChangeLanguageBtn />
          </div>
        </div>
      </nav>
    </aside>
  );
};
export default MySidebar;
