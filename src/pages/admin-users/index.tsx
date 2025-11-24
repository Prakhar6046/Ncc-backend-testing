import { useEffect, useState } from "react";
import DynamicMenu from "../../components/dynamic-menu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {} from "../../redux/reducers/adminSlice";
import { SingleHotel } from "../../TSModels/Admin";
import Loader from "../../components/Loader";
import { SearchData } from "../../utilities/utils";
import {
  SelectAllHotelInfo,
  selectIsLoading,
} from "../../redux/reducers/superAdminSlice";
import { AllHotelsList } from "../../redux/thunks/superAdmin";

const AdminUsers = () => {
  // const user = decryptData("nccUser");
  const dispatch = useAppDispatch();
  const allHotels = useAppSelector(SelectAllHotelInfo);
  const isAdminLoading = useAppSelector(selectIsLoading);
  const [currentHotel, setCurrentHotel] = useState<SingleHotel>();
  const [hotelList, setHotelList] = useState<SingleHotel[]>();
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  // Calculate total pages based on filtered hotels
 
  const filteredHotels :any = allHotels ? SearchData(allHotels, "companyName", search) : [];
 const totalPages = filteredHotels.length > 0 ? Math.ceil(filteredHotels.length / itemsPerPage) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentHotels = filteredHotels.slice(startIndex, endIndex);
    setHotelList(currentHotels);
  }, [filteredHotels, currentPage]);
  useEffect(() => {
    dispatch(AllHotelsList());
  }, [dispatch]);
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
                {allHotels?.length || 0} risultati
              </div>

              <div className="d-flex g-2">
                <input
                  type="text"
                  className="form-control me-3"
                  placeholder="Cerca"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="listing_general">
              {/* START SHOW THIS IF DON'T HAVE RECORDS */}
              {!hotelList?.length && (
                <div className="empty_list">
                  <img src="static/img/icons/hotels.svg" />
                  <p>Ancora nessun dato presente.</p>
                </div>
              )}
              {/* END SHOW THIS IF DON'T HAVE RECORDS */}
              {hotelList &&
                hotelList.length !== 0 &&
                hotelList.map((hotel) => (
                  <div className="single_list" key={hotel._id}>
                    <div className="global_listing">
                      <div className="avatar">
                        <img src="static/img/icons/hotels.svg" />
                      </div>
                      <div className="single_person">
                        <div className="name_person">{hotel.companyName}</div>
                        <div className="email_person">{hotel.pec}</div>
                      </div>
                    </div>
                    <div className="row_end">
                      <button
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#addUser"
                        onClick={() => setCurrentHotel(hotel)}
                      >
                        Visualizza
                      </button>
                    </div>
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
        id="addUser"
        data-bs-keyboard="false"
        aria-labelledby="addUser"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addUser">
                Visualizza utente
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
                      Compila i campi indicando il nome di chi sta creando il
                      profilo e tutti i contatti necessari.
                    </p>
                    <hr />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="name" className="form-label">
                        Nome
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={currentHotel?.name}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="secondname" className="form-label">
                        Cognome
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="secondname"
                        value={currentHotel?.surname}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="former_row">
                      <label htmlFor="mail" className="form-label">
                        E-mail
                      </label>
                      <input
                        type="e-mail"
                        className="form-control"
                        id="mail"
                        value={currentHotel?.email}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form_container form_in_modal">
                <div className="row">
                  <div className="col-12 mb-3">
                    <h5>Dati aziendali</h5>
                    <p>
                      Indica i dati fiscali per gestire la parte relativa alla
                      fatturazione del servizio.
                    </p>
                    <hr />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="company" className="form-label">
                        Ragione sociale
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="company"
                        value={currentHotel?.companyName}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="vat" className="form-label">
                        P.iva
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vat"
                        value={currentHotel?.piva}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="former_row">
                      <label htmlFor="address" className="form-label">
                        Indirizzo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        value={currentHotel?.address}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="pec" className="form-label">
                        PEC
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="pec"
                        value={currentHotel?.pec}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="sdi" className="form-label">
                        SDI
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="sdi"
                        value={currentHotel?.sdi}
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
    </div>
  );
};
export default AdminUsers;
