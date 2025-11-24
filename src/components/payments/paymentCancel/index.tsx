import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Payment Successful Section Start */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7">
            <div className="form_container">
              <div className="row">
                <div className="col text-center">
                  <img
                    src="static/img/icons/cancel-square.svg"
                    className="mb-5"
                  />
                  <h2>Il pagamento non è andato a buon fine</h2>
                  <p>
                    Siamo spiacenti ma l'ordine non può essere processato. Torna
                    indietro e controlla i campi.
                  </p>
                  <button
                    onClick={() => navigate("/hotel-shop")}
                    className="btn btn-dark"
                  >
                    Riprova
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Successful Section End */}
    </>
  );
};

export default PaymentCancel;
