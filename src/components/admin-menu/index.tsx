import { Link, useLocation } from "react-router-dom";
import { Logout } from "../../utilities/utils";

const AdminMenu = () => {
  const location = useLocation();
  return (
    <div className="col-12 col-md-3">
      <div className="card_main_menu mb-5">
        <div className="menu_container">
          <ul className="icons_menu">
            <li className={location.pathname === "/" ? "active_menu" : ""}>
              <Link to="/">
                <span>
                  <img src="static/img/icons/invoice.svg" />
                </span>
                <span>I miei ordini</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/admin-garage" ? "active_menu" : ""
              }
            >
              <Link to="/admin-garage">
                <span>
                  <img src="static/img/icons/garage.svg" />
                </span>
                <span>Parco auto</span>
              </Link>
            </li>

            <li
              className={
                location.pathname === "/categories" ? "active_menu" : ""
              }
            >
              <Link to="/categories">
                <span>
                  <img src="static/img/icons/category.svg" />
                </span>
                <span>Categorie</span>
              </Link>
            </li>

            <li
              className={
                location.pathname === "/admin-car-Models" ? "active_menu" : ""
              }
            >
              <Link to="/admin-car-Models">
                <span>
                  <img src="static/img/icons/drivers.svg" />
                </span>
                <span>I miei driver</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/capoflotta" ? "active_menu" : ""
              }
            >
              <Link to="/capoflotta">
                <span>
                  <img src="static/img/icons/hotels.svg" />
                </span>
                <span>Cooperative</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/ditte-individuali" ? "active_menu" : ""
              }
            >
              <Link to="/ditte-individuali">
                <span>
                  <img src="static/img/icons/hotels.svg" />
                </span>
                <span>Ditte individuali</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/admin-products" ? "active_menu" : ""
              }
            >
              <Link to="/admin-products">
                <span>
                  <img src="static/img/icons/products.svg" />
                </span>
                <span>Tratte offerte</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/admin-users" ? "active_menu" : ""
              }
            >
              <Link to="/admin-users">
                <span>
                  <img src="static/img/icons/hotels.svg" />
                </span>
                <span>Anagrafica strutture</span>
              </Link>
            </li>
            <li
              className={location.pathname === "/admin-bi" ? "active_menu" : ""}
            >
              <Link to="/admin-bi">
                <span>
                  <img src="static/img/icons/business-intelligence.svg" />
                </span>
                <span>Business intelligence</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/weekly-cost" ? "active_menu" : ""
              }
            >
              <Link to="/weekly-cost">
                <span>
                  <img src="static/img/icons/costo-settimanale.svg" />
                </span>
                <span>Sezione pagamenti</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/admin-setting" ? "active_menu" : ""
              }
            >
              <Link to="/admin-setting">
                <span>
                  <img src="static/img/icons/impostazioni.svg" />
                </span>
                <span>Impostazioni tratte</span>
              </Link>
            </li>
            <li
              onClick={() => {
                Logout();
              }}
            >
              <Link to="/">
                <span>
                  <img src="static/img/icons/logout.svg" />
                </span>
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
