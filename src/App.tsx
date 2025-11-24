import { Route, Routes, useLocation } from "react-router-dom";
import SignUp from "./pages/sign-up";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import Header from "./components/header";
import InnerFooter from "./components/inner-footer";
import SignIn from "./pages/sign-in";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayoutRoutes from "./components/mainLayouts";
import PaymentSuccess from "./components/payments/paymentSuccess";
import PaymentCancel from "./components/payments/paymentCancel";


function App() {
  const location = useLocation();
  const showFooterRoutes = [
    "/admin-garage",
    "/admin-products",
    // "/admin-orders",
    "/admin-users",
    "/hotel-orders",
    "/hotel-shop",
    "/",
  ];
  const hideHeader = ["/payment-failed", "/payment-success"];
  const shouldShowFooter = showFooterRoutes.includes(location.pathname);
  const shouldHideHide = hideHeader.includes(location.pathname);
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
      {!shouldHideHide && <Header />}

      <Routes>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/payment-success" element={<PaymentSuccess />}></Route>
        <Route path="/payment-failed" element={<PaymentCancel />}></Route>
        <Route
          path="/reset-password/:userId/:resetToken"
          element={<ResetPassword />}
        ></Route>
        <Route path="*" element={<MainLayoutRoutes />} />
      </Routes>
      {shouldShowFooter && <InnerFooter />}
    </div>
  );
}

export default App;
