import { HiMiniSquares2X2 } from "react-icons/hi2";
import { FaClock } from "react-icons/fa6";
import { FaUsers, FaCar, FaFileAlt, FaBook, FaCog } from "react-icons/fa";

export const links = [
  { name: "Main", path: "/control-panel/main", icon: <HiMiniSquares2X2 /> },
  { name: "Orders", path: "/control-panel/orders", icon: <FaClock /> },
];

export const dropDowns = [
  {
    name: "Customers",
    icon: <FaUsers />,
    links: [
      {
        name: "Customers",
        path: "/control-panel/customers/active",
      },
    ],
  },
  {
    name: "Drivers",
    icon: <FaCar />,
    links: [
      { name: "Drivers", path: "/control-panel/drivers/active" },
      { name: "Cars", path: "/control-panel/cars/active" },
      { name: "Drivers groups", path: "/control-panel/drivers-groups/active" },
      {
        name: "Photo control",
        path: "/control-panel/drivers-photo-control/active",
      },
    ],
  },
  {
    name: "Reports",
    icon: <FaFileAlt />,
    links: [
      { name: "List of orders", path: "/control-panel/reports/list-of-orders" },
      { name: "Orders", path: "/control-panel/reports/orders/statistics" },
      {
        name: "Money transactions",
        path: "/control-panel/reports/money-transactions",
      },
      {
        name: "Corporate clients",
        path: "/control-panel/reports/corporation-clients",
      },
      { name: "For partner", path: "/control-panel/reports/for-partner" },
      { name: "For Aggregator", path: "/control-panel/reports/for-aggregator" },
      { name: "Shifts of employees", path: "/control-panel/reports/shifts" },
    ],
  },
  {
    name: "Directories",
    icon: <FaBook />,
    links: [
      { name: "Branches", path: "/control-panel/directories/branches" },
      { name: "Partners", path: "/control-panel/directories/partners" },
      { name: "Employees", path: "/control-panel/directories/employees" },
      { name: "Map", path: "/control-panel/directories/map" },
      { name: "News", path: "/control-panel/directories/news" },
      { name: "Addresses", path: "/control-panel/directories/addresses" },
    ],
  },
  {
    name: "Settings",
    icon: <FaCog />,
    links: [
      {
        name: "Organization details",
        path: "/control-panel/settings/organization-details",
      },
      {
        name: "Application for clients",
        path: "/control-panel/settings/application",
      },
      {
        name: "Orders settings",
        path: "/control-panel/settings/orders",
      },
      {
        name: "CMC",
        path: "/control-panel/settings/cmc",
      },
      {
        name: "Notifications to clients",
        path: "/control-panel/settings/notifications",
      },
      {
        name: "Drivers settings",
        path: "/control-panel/settings/drivers",
      },
      {
        name: "Car classes",
        path: "/control-panel/settings/car-classes",
      },
      {
        name: "Online checkout",
        path: "/control-panel/settings/online-checkout",
      },
      {
        name: "ATC",
        path: "/control-panel/settings/atc",
      },
    ],
  },
];
