import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "./assets/css/style.min.css";
import "primereact/resources/themes/saga-orange/theme.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { LoadScript } from "@react-google-maps/api";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <App />
      </LoadScript>
    </Provider>
  </BrowserRouter>
);
