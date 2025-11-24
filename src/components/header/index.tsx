import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="navigation">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col">
            <div className="inner_heading">
              <div className="logo_container">
                <Link to="/">
                  <img src="/static/img/structure/logo_orange_neth.svg" />
                </Link>
              </div>
              <div className="payoff">
                <p>Your journey, our passion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
