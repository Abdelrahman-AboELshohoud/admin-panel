import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import "./global.css";
import ControlPanel from "./pages/ControlPanel";
import Orders from "./pages/orders/Orders";
import Main from "./pages/main/Main";
import Services from "./pages/customers/services/Services";
import Service from "./pages/customers/services/Service";
import Drivers from "./pages/drivers/Drivers";
import Driver from "./pages/drivers/Driver";
import Cars from "./pages/drivers/Cars";
import Car from "./pages/drivers/Car";
import DriversGroups from "./components/pages/drivers/DriversGroup";
import AddGroup from "./components/pages/drivers/AddGroup";
import PhotoControl from "./components/pages/drivers/PhotoControl";
import AddPhoto from "./components/pages/drivers/AddPhoto";
import ListOfOrders from "./pages/reports/ListOfOrders";
import MoneyTransaction from "./pages/reports/MoneyTransaction";
import OrdersReports from "./pages/reports/Orders";
import ProtectedRoutes from "./ProtectedRoutes";
import CorporateClients from "./pages/reports/CorporateClients";
import ForPartner from "./pages/reports/ForPartner";
import Shifts from "./pages/reports/Shifts";
import ForAggregator from "./pages/reports/ForAggregrator";
import PushMails from "./pages/reports/PushMails";
import BranchesManager from "./pages/directories/Branches";
import AddBranch from "./pages/directories/AddBranch";
import Partners from "./pages/directories/Partners";
import AddPartner from "./pages/directories/AddPartner";
import Employees from "./pages/directories/Employees";
import MapPage from "./pages/directories/maps/MapPage";
import Addresses from "./pages/directories/Addresses";
import AddAddress from "./pages/directories/AddAdress";
import News from "./pages/directories/News";
import AddNews from "./pages/directories/AddNews";
import OrganizationDetails from "./pages/settings/Organization";
import Application from "./pages/settings/Application";
import OrdersSettings from "./pages/settings/Orders";
import CMCSettings from "./pages/settings/CMC";
import Notifications from "./pages/settings/CustomerNotifications";
import CarClasses from "./pages/settings/CarClasses";
import AddClass from "./pages/settings/AddClass";
import OnlineCheckout from "./pages/settings/OnlineCheckout";
import ATC from "./pages/settings/ATC";
import DriverSettings from "./pages/settings/Drivers";
import AddDriver from "./pages/drivers/AddDriver";
import ViewOrder from "./pages/drivers/ViewOrder";
import Clients from "./pages/customers/clients/Clients";
import AddClient from "./pages/customers/clients/AddClient";
import Client from "./pages/customers/clients/Client";
import Fleet from "./pages/drivers/Fleet";
import Payment from "./pages/settings/payments/Payment";
import Configuration from "./pages/settings/Configuration";
import SingleNews from "./pages/directories/SingleNews";
import Employee from "./pages/directories/Employee";
import AddEmployee from "./pages/directories/AddEmployee";
import RolesManagement from "./pages/directories/RolesManagement";
import CreateOrder from "./pages/orders/CreateOrder";
import AddService from "./pages/customers/services/AddService";
import Complaints from "./pages/directories/Complaints";
import ReviewsParams from "./pages/directories/ReviewsParams";
import SOSPage from "./pages/reports/SOS";
import ZonesPrices from "./pages/directories/maps/ZonesPrices";

function App() {
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
            path="/control-panel/orders/create"
            element={<ControlPanel children={<CreateOrder />} />}
          />
          <Route
            path="/control-panel/services/add"
            element={<ControlPanel children={<AddService />} />}
          />
          <Route
            path="/control-panel/services/:status"
            element={<ControlPanel children={<Services />} />}
          />

          <Route
            path="/control-panel/services/:status/:id"
            element={<ControlPanel children={<Service />} />}
          />
          <Route
            path="/control-panel/clients/:status"
            element={<ControlPanel children={<Clients />} />}
          />
          <Route
            path="/control-panel/clients/add-client"
            element={<ControlPanel children={<AddClient />} />}
          />
          <Route
            path="/control-panel/clients/:status/:id/profile"
            element={<ControlPanel children={<Client />} />}
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
            path="/control-panel/orders/:orderId"
            element={<ControlPanel children={<ViewOrder />} />}
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
            path="/control-panel/drivers-groups/fleet/:fleetId"
            element={<ControlPanel children={<Fleet />} />}
          />
          <Route
            path="/control-panel/drivers/add-driver"
            element={<ControlPanel children={<AddDriver />} />}
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
            path="/control-panel/reports/sos"
            element={<ControlPanel children={<SOSPage />} />}
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
            path="/control-panel/reports/complaints"
            element={<ControlPanel children={<Complaints />} />}
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
            path="/control-panel/directories/zones-prices"
            element={<ControlPanel children={<ZonesPrices />} />}
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
            path="/control-panel/directories/employees/add"
            element={<ControlPanel children={<AddEmployee />} />}
          />
          <Route
            path="/control-panel/directories/reviews-params"
            element={<ControlPanel children={<ReviewsParams />} />}
          />
          <Route
            path="/control-panel/directories/employees/:id"
            element={<ControlPanel children={<Employee />} />}
          />
          <Route
            path="/control-panel/directories/roles-management"
            element={<ControlPanel children={<RolesManagement />} />}
          />
          <Route
            path="/control-panel/directories/map"
            element={<ControlPanel children={<MapPage />} />}
          />
        </Route>
        <Route
          path="/control-panel/directories/news/:id"
          element={<ControlPanel children={<SingleNews />} />}
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
          path="/control-panel/settings/payment"
          element={<ControlPanel children={<Payment />} />}
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
        <Route
          path="/control-panel/settings/configuration"
          element={<ControlPanel children={<Configuration />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
