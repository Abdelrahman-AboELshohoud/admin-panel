import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import "./global.css";
import ControlPanel from "./pages/ControlPanel";
import Orders from "./components/sections/Orders";
import Main from "./components/sections/Main";
import Customers from "./components/sections/customers/Customers";
import Customer from "./components/sections/customers/Customer";
import Drivers from "./components/sections/drivers/Drivers";
import Driver from "./components/sections/drivers/Driver";
import Cars from "./components/sections/drivers/Cars";
import Car from "./components/sections/drivers/Car";
import DriversGroups from "./components/sections/drivers/DriversGroup";
import AddGroup from "./components/sections/drivers/AddGroup";
import PhotoControl from "./components/sections/drivers/PhotoControl";
import AddPhoto from "./components/sections/drivers/AddPhoto";
import ListOfOrders from "./components/sections/reports/ListOfOrders";
import MoneyTransaction from "./components/sections/reports/MoneyTransaction";
import OrdersReports from "./components/sections/reports/Orders";
import ProtectedRoutes from "./ProtectedRoutes";
import CorporateClients from "./components/sections/reports/CorporateClients";
import ForPartner from "./components/sections/reports/ForPartner";
import Shifts from "./components/sections/reports/Shifts";
import ForAggregator from "./components/sections/reports/PushMails";
import PushMails from "./components/sections/reports/PushMails";
import BranchesManager from "./components/sections/directories/Branches";
import AddBranch from "./components/sections/directories/AddBranch";
import Partners from "./components/sections/directories/Partners";
import AddPartner from "./components/sections/directories/AddPartner";
import Employees from "./components/sections/directories/Employees";
import MapPage from "./components/sections/directories/MapPage";
import AddInMap from "./components/sections/directories/AddInMap";
import Addresses from "./components/sections/directories/Addresses";
import AddAddress from "./components/sections/directories/AddAdress";
import News from "./components/sections/directories/News";
import AddNews from "./components/sections/directories/AddNews";
import OrganizationDetails from "./components/sections/settings/Organization";
import Application from "./components/sections/settings/Application";
import OrdersSettings from "./components/sections/settings/Orders";
import CMCSettings from "./components/sections/settings/CMC";
import Notifications from "./components/sections/settings/CustomerNotifications";
import CarClasses from "./components/sections/settings/CarClasses";
import AddClass from "./components/sections/settings/AddClass";
import OnlineCheckout from "./components/sections/settings/OnlineCheckout";
import ATC from "./components/sections/settings/ATC";
import { getFleets } from "./graphql/apis";
import DriverSettings from "./components/sections/settings/Drivers";

function App() {
  // getAllRiders();
  getFleets();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route
            path="/control-panel/main"
            element={<ControlPanel children={<Main />} />}
          />
          <Route
            path="/control-panel/orders"
            element={<ControlPanel children={<Orders />} />}
          />
          <Route
            path="/control-panel/customers"
            element={<ControlPanel children={<Customers />} />}
          />
          <Route
            path="/control-panel/customers/active"
            element={<ControlPanel children={<Customers />} />}
          />
          <Route
            path="/control-panel/customers/blocked"
            element={<ControlPanel children={<Customers />} />}
          />
          <Route
            path="/control-panel/customers/active/:id"
            element={<ControlPanel children={<Customer />} />}
          />
          <Route
            path="/control-panel/drivers/:status"
            element={<ControlPanel children={<Drivers />} />}
          />
          <Route
            path="/control-panel/drivers/:status/:id/:status"
            element={<ControlPanel children={<Driver />} />}
          />
          <Route
            path="/control-panel/cars/:status"
            element={<ControlPanel children={<Cars />} />}
          />
          <Route
            path="/control-panel/cars/:status/:id/:status"
            element={<ControlPanel children={<Car />} />}
          />
          <Route
            path="/control-panel/drivers-groups/:status"
            element={<ControlPanel children={<DriversGroups />} />}
          />
          <Route
            path="/control-panel/drivers-groups/add-group"
            element={<ControlPanel children={<AddGroup />} />}
          />
          <Route
            path="/control-panel/drivers-photo-control/:status"
            element={<ControlPanel children={<PhotoControl />} />}
          />
          <Route
            path="/control-panel/drivers-photo-control/add-photo"
            element={<ControlPanel children={<AddPhoto />} />}
          />
          <Route
            path="/control-panel/reports/list-of-orders"
            element={<ControlPanel children={<ListOfOrders />} />}
          />
          <Route
            path="/control-panel/reports/orders/:status"
            element={<ControlPanel children={<OrdersReports />} />}
          />
          <Route
            path="/control-panel/reports/money-transactions"
            element={<ControlPanel children={<MoneyTransaction />} />}
          />
          <Route
            path="/control-panel/reports/corporation-clients"
            element={<ControlPanel children={<CorporateClients />} />}
          />
          <Route
            path="/control-panel/reports/corporation-clients/:name"
            element={<ControlPanel children={<CorporateClients />} />}
          />
          <Route
            path="/control-panel/reports/for-partner"
            element={<ControlPanel children={<ForPartner />} />}
          />
          <Route
            path="/control-panel/reports/for-aggregator"
            element={<ControlPanel children={<ForAggregator />} />}
          />
          <Route
            path="/control-panel/reports/push-mails"
            element={<ControlPanel children={<PushMails />} />}
          />
          <Route
            path="/control-panel/reports/shifts"
            element={<ControlPanel children={<Shifts />} />}
          />
          <Route
            path="/control-panel/directories/branches"
            element={<ControlPanel children={<BranchesManager />} />}
          />
          <Route
            path="/control-panel/directories/add-branch"
            element={<ControlPanel children={<AddBranch />} />}
          />
          <Route
            path="/control-panel/directories/partners"
            element={<ControlPanel children={<Partners />} />}
          />
          <Route
            path="/control-panel/directories/add-partner"
            element={<ControlPanel children={<AddPartner />} />}
          />
          <Route
            path="/control-panel/directories/employees"
            element={<ControlPanel children={<Employees />} />}
          />
          <Route
            path="/control-panel/directories/map"
            element={<ControlPanel children={<MapPage />} />}
          />
        </Route>
        <Route
          path="/control-panel/directories/add-in-map"
          element={<ControlPanel children={<AddInMap />} />}
        />
        <Route
          path="/control-panel/directories/news"
          element={<ControlPanel children={<News />} />}
        />
        <Route
          path="/control-panel/directories/add-news"
          element={<ControlPanel children={<AddNews />} />}
        />
        <Route
          path="/control-panel/directories/addresses"
          element={<ControlPanel children={<Addresses />} />}
        />
        <Route
          path="/control-panel/directories/add-address"
          element={<ControlPanel children={<AddAddress />} />}
        />
        <Route
          path="/control-panel/settings/organization-details"
          element={<ControlPanel children={<OrganizationDetails />} />}
        />
        <Route
          path="/control-panel/settings/application"
          element={<ControlPanel children={<Application />} />}
        />
        <Route
          path="/control-panel/settings/orders"
          element={<ControlPanel children={<OrdersSettings />} />}
        />
        <Route
          path="/control-panel/settings/cmc"
          element={<ControlPanel children={<CMCSettings />} />}
        />
        <Route
          path="/control-panel/settings/notifications"
          element={<ControlPanel children={<Notifications />} />}
        />
        <Route
          path="/control-panel/settings/car-classes"
          element={<ControlPanel children={<CarClasses />} />}
        />
        <Route
          path="/control-panel/settings/add-car-class"
          element={<ControlPanel children={<AddClass />} />}
        />
        <Route
          path="/control-panel/settings/online-checkout"
          element={<ControlPanel children={<OnlineCheckout />} />}
        />
        <Route
          path="/control-panel/settings/atc"
          element={<ControlPanel children={<ATC />} />}
        />
        <Route
          path="/control-panel/settings/drivers"
          element={<ControlPanel children={<DriverSettings />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
