import { useEffect, useState } from "react";
import DynamicMenu from "../../components/dynamic-menu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  AllHotelOrders,
  getSingleDriverInfo,
  getSingleHotelInfo,
} from "../../redux/thunks/admin";
import {
  adminActions,
  SelectAllHotelOrders,
  SelectIsLoading,
  SelectSingleDriverInfo,
  SelectSingleHotelInfo,
} from "../../redux/reducers/adminSlice";
import Loader from "../../components/Loader";
import HotelForm from "../../components/hotel-form";
import { SearchData, showBootstrapModal } from "../../utilities/utils";
import { HotelData } from "../../TSModels/Hotel";
import { SingleHotelOrder } from "../../TSModels/Admin";

const AdminOrders = () => {
  const dispatch = useAppDispatch();
  const hotelOrders = useAppSelector(SelectAllHotelOrders);
  const isAdminLoading = useAppSelector(SelectIsLoading);
  const hotelInfo = useAppSelector(SelectSingleHotelInfo);
  const DriverInfo = useAppSelector(SelectSingleDriverInfo);
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [orderList, setOrderList] = useState<SingleHotelOrder[]>();
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState<"complete" | "incomplete">("incomplete");
  const itemsPerPage = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    if (hotelInfo._id) {
      showBootstrapModal("viewUser");
      setHotel(hotelInfo);
    } else if (DriverInfo.carType !== 0) {
      showBootstrapModal("viewDriver");
    } else {
      setHotel(null);
    }
  }, [hotelInfo, DriverInfo]);
  useEffect(() => {
     if (!hotelOrders) return; // early return if undefined
   
     let filtered: SingleHotelOrder[] = [...hotelOrders];
   
     // Apply status filter
     filtered = filtered.filter(order =>
       orderStatusFilter === "complete"
         ? order?.completeOrder === true
         : order?.completeOrder === false
     );
   
     // Apply search filter
     if (search) {
       filtered = SearchData(filtered, "clientName", search) as SingleHotelOrder[];
     }
   
     // Paginate
     const startIndex = (currentPage - 1) * itemsPerPage;
     const endIndex = startIndex + itemsPerPage;
     const paginated = filtered.slice(startIndex, endIndex);
   
     setOrderList(paginated);
   }, [hotelOrders, search, orderStatusFilter, currentPage]);
 
   useEffect(() => {
     setCurrentPage(1); 
   }, [search, orderStatusFilter]);
 
   const totalFilteredOrders = hotelOrders?.filter(order =>
     orderStatusFilter === "complete" ? order?.completeOrder === true : order?.completeOrder === false
   ).filter(order =>
     !search || order?.clientName.toLowerCase().includes(search.toLowerCase())
   ).length || 0;
 
   const totalPages = Math.ceil(totalFilteredOrders / itemsPerPage);
  useEffect(() => {
    dispatch(AllHotelOrders());
  }, []);
  if (isAdminLoading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <DynamicMenu />
          <div className="col-12 col-md-9">
            <div className="header_add_remove">
              <div className="label_counter">
                {hotelOrders?.length ? hotelOrders?.length : 0} risultati
              </div>
              <div className="d-flex g-2">
                <input
                  type="text"
                  className="form-control me-3"
                  placeholder="Cerca"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                 <select
                className="form-select ms-2"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value as "complete" | "incomplete")}
              >
                <option value="incomplete">Ordini incompleti</option>
                <option value="complete">Ordini completati</option>
              </select>
              </div>
            </div>

            <div className="listing_general">
              {/* START SHOW THIS IF DON'T HAVE RECORDS */}
              {!orderList?.length && (
                <div className="empty_list">
                  <img src="static/img/icons/invoice.svg" />
                  <p>Ancora nessun dato presente.</p>
                </div>
              )}

              {/* END SHOW THIS IF DON'T HAVE RECORDS */}
              {orderList &&
                orderList.length !== 0 &&
                orderList.map((order) => (
                  <div className="single_product_container" key={order._id}>
                    <label className="single_product card_review">
                      <span className="metadata_product">
                        <span className="title_product">
                          <span className="fromto">
                            <strong className="order_number">
                              Ordine #{order.orderNumber}
                            </strong>
                            <span className="from">
                              <span className="calm_gray">
                                Da:{order.isReverse ? order.to : order.from}
                              </span>
                            </span>
                            <span className="to">
                              <span className="calm_gray">A:</span>
                              {order.isReverse ? order.from : order.to}
                            </span>
                          </span>
                          <div className="price_billing">
                            {order.totalPrice} €
                          </div>
                        </span>
                        <span className="order_data">
                          <span>
                            <strong>Nome utilizzatore:</strong>{" "}
                            {order.clientName}
                          </span>
                          <span>
                            <strong>Telefono:</strong> {order.telePhone}
                          </span>
                          <span>
                            <strong>Numero passeggeri:</strong>{" "}
                            {order.noOfPassengers}
                          </span>
                          <span>
                            <strong>Data:</strong> {order.appointmentDate}
                          </span>
                          <span>
                            <strong>Ora:</strong> {order.appointmentTime}
                          </span>
                          <span>
                            <strong>Informazioni per il conducente:</strong>{" "}
                            {order.usefulInformation}
                          </span>
                        </span>
                        <span className="button_between">
                          <span
                            className="module_invert_direction"
                            // data-bs-toggle="modal"
                            // data-bs-target="#viewUser"
                            onClick={() => {
                              Promise.all([
                                dispatch(adminActions.resetHotelData()),
                              ]).then(() =>
                                dispatch(
                                  getSingleHotelInfo({
                                    hotelId: order.companyId,
                                  })
                                )
                              );
                            }}
                          >
                            <span className="change_direction">
                              <img src="static/img/icons/hotels.svg" />
                            </span>
                            <span className="invert_places">
                              <strong>Cliente:</strong> {order.clientName}
                            </span>
                          </span>
                          {order.driverAccept && order.driverAccept ? (
                            <span
                              className="module_invert_direction"
                              onClick={() => {
                                Promise.all([
                                  dispatch(adminActions.resetDriverData()),
                                ]).then(() =>
                                  dispatch(
                                    getSingleDriverInfo({
                                      CarDriverId: order.driverId,
                                    })
                                  )
                                );
                              }}
                            >
                              <span className="change_direction">
                                <img src="static/img/icons/hotels.svg" />
                              </span>
                              <span className="invert_places">
                                <strong>Driver</strong> {order.driverName}
                              </span>
                            </span>
                          ) : (
                            <span className="button_end">
                              <span className="module_invert_direction no_driver">
                                <span className="change_direction">
                                  <img src="static/img/icons/car.svg" />
                                </span>
                                <span className="invert_places">
                                  Il driver non ha ancora accettato
                                </span>
                              </span>
                            </span>
                          )}
                        </span>
                      </span>
                    </label>
                  </div>
                ))}
            </div>
            <div className="d-flex justify-content-center">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="viewDriver"
        data-bs-keyboard="false"
        aria-labelledby="viewDriver"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="viewDriver">
                Visualizza driver
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form_container form_in_modal">
                <div className="row">
                  <div className="col-12 mb-3">
                    <h5>Dati profilo</h5>
                    <p>
                      Visualizza il driver che ha preso in carico la richiesta
                    </p>
                    <hr />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 mb-5">
                    <input
                      className="select_product_type"
                      id="berlina"
                      type="radio"
                      name="cartype"
                      value="berlina"
                      // checked
                      hidden
                    />
                    <label htmlFor="berlina" className="single_check">
                      <span className="container_image_icon">
                        <img
                          src={
                            DriverInfo.carType === 4
                              ? "static/img/icons/car.svg"
                              : "static/img/icons/van.svg"
                          }
                        />
                      </span>
                      <span className="type_of_car">
                        {DriverInfo.carType === 4 ? "Berlina" : "Van"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="name" className="form-label">
                        Nome driver
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={
                          DriverInfo.driverName
                            ? DriverInfo.driverName
                            : "Drivername"
                        }
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="secondname" className="form-label">
                        Cognome driver
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="secondname"
                        value={
                          DriverInfo.driverSurname
                            ? DriverInfo.driverSurname
                            : "Secondnamedriver"
                        }
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="carlicenseplate" className="form-label">
                        Targa{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="carlicenseplate"
                        value={DriverInfo.targa ? DriverInfo.targa : "EK198ET"}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="carmodel" className="form-label">
                        Modello{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="carmodel"
                        value={
                          DriverInfo.module
                            ? DriverInfo.module
                            : "Audi A3 Sportback"
                        }
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="former_row">
                      <label htmlFor="numberlicence" className="form-label">
                        Numero licenza{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="numberlicence"
                        value={
                          DriverInfo.licenseNumber
                            ? DriverInfo.licenseNumber
                            : "ITOZSS98"
                        }
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-dark"
                data-bs-dismiss="modal"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      </div>
      <HotelForm hotel={hotel} />
    </div>
  );
};
export default AdminOrders;
