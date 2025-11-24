import { useEffect, useMemo } from "react";
import { decryptData, removeSingleCookie } from "../../../utilities/utils";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RequestService } from "../../../redux/thunks/hotel";
import {
  hotelActions,
  selectSuccess,
} from "../../../redux/reducers/hotelProfile";
import { useNavigate } from "react-router-dom";
const PaymentSuccess = () => {
  const dispatch = useAppDispatch();
  const isSuccess = useAppSelector(selectSuccess);
  const navigate = useNavigate();
  const data = useMemo(() => decryptData("requestData"), []);
  const saveRequest = () => {
    navigate("/hotel-orders");
  };
  useEffect(() => {
    if (isSuccess) {
      removeSingleCookie("requestData");
      dispatch(hotelActions.resetHotelState());
    }
  }, [isSuccess]);
  useEffect(() => {
    if (data && !isSuccess) {
      const payload = {
        appointmentTime: `${data.hour}:${data.minutes}`,
        selectedRouteId: JSON.parse(data.product)?._id,
        preferVehicel: Number(data.cartype),
        clientName: data.clientName,
        telePhone: data.telePhone,
        customerEmail: data.customerEmail,
        isReverse: JSON.parse(data.product)?.isReversed,
        noOfPassengers: data.noOfPassengers,
        appointmentDate: data.appointmentDate,
        usefulInformation: data.usefulInformation,
        customFrom: data.customFrom,
        customPrice: data.customPrice,
        customTo: data.customTo,
        customDriver: data.customDriver,
        customTime: data.customTime,
        customAdminCost: data.customAdminCost ? Number(data.customAdminCost) : undefined,
        customCooperativeCost: data.customCooperativeCost ? Number(data.customCooperativeCost) : undefined,
        customDittaIndividualeCost: data.customDittaIndividualeCost ? Number(data.customDittaIndividualeCost) : undefined,
        fromLat: data.customFrom?.lat || null,
        fromLong: data.customFrom?.lng || null,
        fromDescription: data.customFrom?.description || "",

        toLat: data.customTo?.lat || null,
        toLong: data.customTo?.lng || null,
        toDescription: data.customTo?.description || "",
      };
      if (payload) {
        dispatch(RequestService(payload));
      }
    }
  }, [data]);
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
                    src="static/img/icons/check-square.svg"
                    className="mb-5"
                  />
                  <h2>Pagamento effettuato con successo</h2>
                  <p>
                    Hai appena effettuato l'ordine, monitora lo stato dai tuoi
                    ordini.
                  </p>
                  <button
                    onClick={() => saveRequest()}
                    className="btn btn-dark"
                  >
                    Torna ai miei ordini
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

export default PaymentSuccess;
