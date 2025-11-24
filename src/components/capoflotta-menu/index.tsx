import { Link, useLocation } from "react-router-dom";
import { Logout } from "../../utilities/utils";

const CapoflottaMenu = () => {
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

export default CapoflottaMenu;

