import { useEffect, useState } from "react";
import DynamicMenu from "../../components/dynamic-menu";
import RouteForm from "../../components/route-form";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { AllCityRoutes } from "../../redux/thunks/admin";
import {
  SelectAllCityRoutes,
  SelectIsLoading,
  selectSuccess,
} from "../../redux/reducers/adminSlice";
import { SingleCityRoute } from "../../TSModels/Admin";
import { useForm } from "react-hook-form";
import Loader from "../../components/Loader";
import { SearchData } from "../../utilities/utils";

const AdminProducts = () => {
  const dispatch = useAppDispatch();
  const cityRoutes = useAppSelector(SelectAllCityRoutes);
  const isAdminLoading = useAppSelector(SelectIsLoading);
  const isSuccess = useAppSelector(selectSuccess);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<SingleCityRoute>();
  const [routes, setRoutes] = useState<SingleCityRoute[]>();
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = cityRoutes
    ? Math.ceil(cityRoutes.length / itemsPerPage)
    : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    if (cityRoutes) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentRoutes = cityRoutes?.slice(startIndex, endIndex);
      setRoutes(currentRoutes);
    }
  }, [cityRoutes, currentPage]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(AllCityRoutes());
    }
  }, [isSuccess]);
  useEffect(() => {
    if (cityRoutes) {
      const filterRoutes = SearchData(cityRoutes, "from", search);
      setRoutes(filterRoutes);
    }
  }, [search]);
  useEffect(() => {
    dispatch(AllCityRoutes());
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
                {cityRoutes?.length} risultati
              </div>
              <div className="d-flex g-2">
                <input
                  type="text"
                  className="form-control me-3"
                  placeholder="Cerca"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button
                  className="btn btn-dark"
                  data-bs-toggle="modal"
                  data-bs-target="#addProduct"
                  onClick={() => {
                    setIsEdit(false), reset();
                  }}
                >
                  Aggiungi
                </button>
              </div>
            </div>

            <div className="listing_general">
              {/* START SHOW THIS IF DON'T HAVE RECORDS */}
              {!routes?.length && (
                <div className="empty_list">
                  <img src="static/img/icons/products.svg" />
                  <p>Ancora nessun dato presente.</p>
                </div>
              )}

              {/* END SHOW THIS IF DON'T HAVE RECORDS */}
              {routes &&
                routes.length !== 0 &&
                routes.map((route) => (
                  <div className="single_list" key={route._id}>
                    <div className="global_listing">
                      <div className="single_person">
                        <div className="name_person">
                          Da: {route.from} A: {route.to}
                        </div>
                        <div className="email_person">
                          {route.averageTravelTime} ore
                        </div>
                      </div>
                    </div>
                    <div className="row_end">
                      <div className="pills_sistem">{route.totalPrice} €</div>
                      <button
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#addProduct"
                        onClick={() => {
                          setIsEdit(true), setCurrentRoute(route);
                        }}
                      >
                        Modifica
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
          <RouteForm
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            route={currentRoute}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            reset={reset}
            setValue={setValue}
            watch={watch}
          />
        </div>
      </div>
    </div>
  );
};
export default AdminProducts;
