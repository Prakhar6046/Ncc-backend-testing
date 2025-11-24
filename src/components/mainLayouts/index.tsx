import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "../../protectedRoutes";
import { decryptData } from "../../utilities/utils";
import HotelProfile from "../../pages/hotel-profile";

import HotelOrders from "../../pages/hotel-orders";
import AdminOrders from "../../pages/admin-orders";
import AdminGarage from "../../pages/admin-garage";
import AdminProducts from "../../pages/admin-products";
import AdminUsers from "../../pages/admin-users";
import AdminBi from "../../pages/admin-bi";
import HotelShop from "../../pages/hotel-shop";
import SuperAdmin from "../../pages/super-admin";
import SuperAdminCity from "../../pages/super-admin-cities";
import AdminSetting from "../../pages/admin-setting";
import AdminDrivers from "../../pages/admin-driver";
import DriverWeeklyAmount from "../../pages/weekly-cost";
import Categories from "../../pages/categories";
import CapoflottaPage from "../../pages/capoflotta";
import DitteIndividualiPage from "../../pages/ditte-individuali";

const MainLayoutRoutes = () => {
  const user = decryptData("nccUser");
  const isAdmin = user?.superAdmin === false && user?.userType === "admin";
  const isCapoflotta = user?.userType === "capoflotta";
  const isDittaIndividuale = user?.userType === "ditta_individuale";
  
  return (
    <>
      <Routes>
        <Route path="/" element={<ProtectedRoutes />}>
          {isDittaIndividuale ? (
            <>
              {/* Ditta Individuale - Limited access */}
              <Route path="/" element={<AdminOrders />}></Route>
              <Route path="/admin-garage" element={<AdminGarage />}></Route>
              <Route
                path="/admin-car-Models"
                element={<AdminDrivers />}
              ></Route>
              <Route path="/admin-bi" element={<AdminBi />}></Route>
            </>
          ) : user?.superAdmin === false || isCapoflotta ? (
            <>
              {/* Admin and Capoflotta - Full access except restricted routes */}
              <Route path="/" element={<AdminOrders />}></Route>
              <Route path="/admin-garage" element={<AdminGarage />}></Route>
              <Route path="/admin-products" element={<AdminProducts />}></Route>
              {isAdmin && (
                <>
                  <Route path="/admin-users" element={<AdminUsers />}></Route>
                  <Route path="/capoflotta" element={<CapoflottaPage />}></Route>
                </>
              )}
              {(isAdmin || isCapoflotta) && (
                <Route path="/ditte-individuali" element={<DitteIndividualiPage />}></Route>
              )}
              <Route path="/admin-bi" element={<AdminBi />}></Route>
              <Route path="/admin-setting" element={<AdminSetting />}></Route>
              <Route
                path="/admin-car-Models"
                element={<AdminDrivers />}
              ></Route>
              <Route
                path="/weekly-cost"
                element={<DriverWeeklyAmount />}
              ></Route>
              <Route path="/categories" element={<Categories />}></Route>
            </>
          ) : user?.superAdmin ? (
            <>
              <Route path="/" element={<SuperAdmin />}></Route>
              <Route path="/admin-cities" element={<SuperAdminCity />}></Route>
              <Route path="/hotels" element={<AdminUsers />}></Route>
              <Route path="/admin-bi" element={<AdminBi />}></Route>
            </>
          ) : (
            <>
              <Route path="/" element={<HotelProfile />}></Route>
              <Route path="/hotel-shop" element={<HotelShop />}></Route>
              <Route path="/hotel-orders" element={<HotelOrders />}></Route>
            </>
          )}
        </Route>
      </Routes>
    </>
  );
};

export default MainLayoutRoutes;
