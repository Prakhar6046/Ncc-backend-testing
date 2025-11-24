import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import SuperAdminMenu from "../../components/superadmin-menu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectAllCityList,
  selectIsLoading,
  selectSuccess,
} from "../../redux/reducers/superAdminSlice";
import { useForm } from "react-hook-form";
import { GetAllAdminCity } from "../../redux/thunks/superAdmin";
import { CreateCityPayload, SingleCity } from "../../TSModels/SuperAdmin";
import { SearchData } from "../../utilities/utils";
import AdminCityForm from "../../components/admin-city-form";

const SuperAdminCity = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const isSuccess = useAppSelector(selectSuccess);
  const cities = useAppSelector(selectAllCityList);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateCityPayload>();
  const [cityList, setcityList] = useState<SingleCity[]>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentCity, setCurrentCity] = useState<SingleCity | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = cities ? Math.ceil(cities.length / itemsPerPage) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    if (cities) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentCities = cities?.slice(startIndex, endIndex);
      setcityList(currentCities);
    }
  }, [cities, currentPage]);
  useEffect(() => {
    if (cities) {
      const filterCities = SearchData(cities, "cityName", search);
      setcityList(filterCities);
    }
  }, [search]);
  useEffect(() => {
    if (isSuccess) {
      dispatch(GetAllAdminCity());
    }
  }, [isSuccess]);
  useEffect(() => {
    dispatch(GetAllAdminCity());
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <SuperAdminMenu />

          <div className="col-12 col-md-9">
            <div className="header_add_remove">
              <div className="label_counter">
                {cities?.length ? cities.length : 0} risultati
              </div>
              <div className="d-flex">
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
                  data-bs-target="#addSuperAdminCity"
                  onClick={() => {
                    setIsEdit(false), reset();
                  }}
                >
                  Aggiungi
                </button>
              </div>
            </div>

            <div className="listing_general">
              {!cityList?.length && (
                <div className="empty_list">
                  <img src="static/img/icons/profile.svg" />
                  <p>Ancora nessun dato presente.</p>
                </div>
              )}
              {cityList &&
                cityList.length !== 0 &&
                cityList.map((city) => (
                  <div className="single_list" key={city._id}>
                    <div className="global_listing">
                      <div className="avatar">
                        <img src="static/img/icons/profile.svg" />
                      </div>
                      <div className="single_person">
                        <div className="name_person">{city.cityName}</div>
                      </div>
                    </div>
                    <div className="row_end">
                      <button
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#addSuperAdminCity"
                        onClick={() => {
                          setIsEdit(true), setCurrentCity(city);
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
        </div>
      </div>

      <AdminCityForm
        isEdit={isEdit}
        cityInfo={currentCity}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        reset={reset}
        setValue={setValue}
        // watch={watch}
      />
    </div>
  );
};

export default SuperAdminCity;
