import { useEffect, useState } from "react";
import StructureMenu from "../../components/structure-menu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { handleGetHotelOrders } from "../../redux/thunks/hotel";
import {
  selectHotelOrders,
  selectIsLoading,
} from "../../redux/reducers/hotelProfile";
import Loader from "../../components/Loader";
import { SearchData, showBootstrapModal } from "../../utilities/utils";
import { SingleHotelOrder } from "../../TSModels/Hotel";
import {
  adminActions,
  SelectSingleDriverInfo,
} from "../../redux/reducers/adminSlice";
import { getSingleDriverInfo } from "../../redux/thunks/admin";

const HotelOrders = () => {
  const dispatch = useAppDispatch();
  const hotelOrders = useAppSelector(selectHotelOrders);
  const DriverInfo = useAppSelector(SelectSingleDriverInfo);
  const isHotelLoading = useAppSelector(selectIsLoading);
  const [orderList, setOrderList] = useState<SingleHotelOrder[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState<"complete" | "incomplete">("incomplete");
  const itemsPerPage = 3;

  // Load orders on component mount
  useEffect(() => {
    dispatch(handleGetHotelOrders());
  }, []);

  // Handle driver info modal
  useEffect(() => {
    if (DriverInfo.carType !== 0) {
      showBootstrapModal("viewDriver");
    }
  }, [DriverInfo]);

  // Filter and paginate orders
  useEffect(() => {
    if (!hotelOrders) return; 
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

  if (isHotelLoading) return <Loader />;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <StructureMenu />
        <div className="col-12 col-md-9">
          <div className="header_add_remove">
            <div className="label_counter">{totalFilteredOrders} risultati</div>
            <div className="d-flex">
              <input
                type="text"
                className="form-control"
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
            {orderList?.length === 0 && (
              <div className="empty_list">
                <img src="static/img/icons/invoice.svg" />
                <p>Ancora nessun dato presente.</p>
              </div>
            )}

            {orderList.map((order) => (
              <div className="single_product_container mt-3" key={order?._id}>
                <label className="single_product card_review">
                  <span className="metadata_product">
                    <span className="title_product">
                      <span className="fromto">
                        <strong className="order_number">Ordine #{order?.hotelOrderNumber}</strong>
                        <span className="from">
                          <span className="calm_gray">
                            Da:{order?.isReverse ? order?.to : order?.from}
                          </span>
                        </span>
                        <span className="to">
                          <span className="calm_gray">A:</span>
                          {order?.isReverse ? order?.from : order?.to}
                        </span>
                      </span>
                      <div className="price_billing">{order?.totalPrice} €</div>
                    </span>

                    <span className="order_data">
                      <span><strong>Nome utilizzatore:</strong> {order?.clientName}</span>
                      <span><strong>Telefono:</strong> {order?.telePhone}</span>
                      <span><strong>Numero passeggeri:</strong> {order?.noOfPassengers}</span>
                      <span><strong>Data:</strong> {order?.appointmentDate}</span>
                      <span><strong>Ora:</strong> {order?.appointmentTime}</span>
                      <span><strong>Informazioni per il conducente:</strong> {order?.usefulInformation}</span>
                    </span>

                    {order?.driverAccept ? (
                      <span className="button_between">
                        <span
                          className="module_invert_direction"
                          onClick={() => {
                            Promise.all([dispatch(adminActions.resetDriverData())]).then(() =>
                              dispatch(getSingleDriverInfo({ CarDriverId: order?.driverId }))
                            );
                          }}
                        >
                          <span className="change_direction">
                            <img src="static/img/icons/car.svg" />
                          </span>
                          <span className="invert_places">
                            <strong>Driver: </strong> {order?.driverName}
                          </span>
                        </span>
                      </span>
                    ) : (
                      <span className="button_between">
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
                </label>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* DRIVER MODAL */}
      <div className="modal fade" id="viewDriver" aria-labelledby="viewDriver" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Visualizza driver</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="form_container form_in_modal">
                <div className="row mb-3">
                  <div className="col-12">
                    <h5>Dati profilo</h5>
                    <p>Visualizza il driver che ha preso in carico la richiesta</p>
                    <hr />
                  </div>
                </div>

                <div className="row mb-5">
                  <div className="col-12">
                    <input
                      className="select_product_type"
                      id="berlina"
                      type="radio"
                      name="cartype"
                      value="berlina"
                      hidden
                    />
                    <label htmlFor="berlina" className="single_check">
                      <span className="container_image_icon">
                        <img src={DriverInfo?.carType === 4 ? "static/img/icons/car.svg" : "static/img/icons/van.svg"} />
                      </span>
                      <span className="type_of_car">
                        {DriverInfo?.carType === 4 ? "Berlina" : "Van"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="name" className="form-label">Nome driver</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={DriverInfo?.driverName || "Drivername"}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="secondname" className="form-label">Cognome driver</label>
                      <input
                        type="text"
                        className="form-control"
                        id="secondname"
                        value={DriverInfo?.driverSurname || "Secondnamedriver"}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Chiudi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelOrders;
