import { Link, useLocation } from "react-router-dom";
import { Logout } from "../../utilities/utils";

const SuperAdminMenu = () => {
  const location = useLocation();
  return (
    <div className="col-12 col-md-3">
      <div className="card_main_menu mb-5">
        <div className="menu_container">
          <ul className="icons_menu">
            <li className={location.pathname === "/" ? "active_menu" : ""}>
              <Link to="/">
                <span>
                  <img src="static/img/icons/profile.svg" />
                </span>
                <span>Admin users</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/admin-cities" ? "active_menu" : ""
              }
            >
              <Link to="/admin-cities">
                <span>
                  <img src="static/img/icons/profile.svg" />
                </span>
                <span>Admin cities</span>
              </Link>
            </li>
            <li
              className={location.pathname === "/hotels" ? "active_menu" : ""}
            >
              <Link to="/hotels">
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

export default SuperAdminMenu;
