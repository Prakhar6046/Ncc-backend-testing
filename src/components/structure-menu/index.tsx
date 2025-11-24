import { Link, useLocation } from "react-router-dom";
import { Logout, removeSingleCookie } from "../../utilities/utils";

const StructureMenu = () => {
  const location = useLocation();
  return (
    <div className="col-12 col-md-3">
      <div className="card_main_menu mb-5">
        <div className="menu_container">
          <ul className="icons_menu">
            <li
              onClick={() => removeSingleCookie("requestData")}
              className={
                location.pathname === "/hotel-shop" ? "active_menu" : ""
              }
            >
              <Link to="/hotel-shop">
                <span>
                  <img src="static/img/icons/rent.svg" />
                </span>
                <span>Prenota una NCC</span>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/hotel-orders" ? "active_menu" : ""
              }
              onClick={() => removeSingleCookie("requestData")}
            >
              <Link to="/hotel-orders">
                <span>
                  <img src="static/img/icons/invoice.svg" />
                </span>
                <span>I miei ordini</span>
              </Link>
            </li>
            <li
              className={location.pathname === "/" ? "active_menu" : ""}
              onClick={() => removeSingleCookie("requestData")}
            >
              <Link to="/">
                <span>
                  <img src="static/img/icons/profile.svg" />
                </span>
                <span>Il mio profilo</span>
              </Link>
            </li>
            <li onClick={() => Logout()}>
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

export default StructureMenu;
