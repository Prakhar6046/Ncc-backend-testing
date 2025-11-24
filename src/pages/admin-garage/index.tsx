import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DynamicMenu from "../../components/dynamic-menu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { AddNewDriver, SingleCarModelInfo } from "../../TSModels/Admin";
import Loader from "../../components/Loader";
import CarModelForm from "../../components/carModel-form";
import {
  SelectAllCarModelInfo,
  SelectIsLoading,
  SelectIsSuccess,
} from "../../redux/reducers/carModelSlice";
import { AllCarModels } from "../../redux/thunks/admin";

const AdminGarage = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddNewDriver>();
  const AllCarModelsInfo = useAppSelector(SelectAllCarModelInfo);
  const isAdminLoading = useAppSelector(SelectIsLoading);
  const isSuccess = useAppSelector(SelectIsSuccess);

  const [isEdit, setIsEdit] = useState(false);
  const [currentCarModel, setCurrentCarModel] = useState<SingleCarModelInfo>();
  const [carModelList, setCarModelList] = useState<SingleCarModelInfo[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5;

  // Calculate filtered list based on search
  const filteredList = search
    ? AllCarModelsInfo?.filter((item) =>
        item.module?.toLowerCase().includes(search.toLowerCase())
      )
    : AllCarModelsInfo || [];

  // Calculate total pages based on filtered list length
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (filteredList) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedList = filteredList.slice(startIndex, endIndex);
      setCarModelList(paginatedList);
    }
  }, [filteredList, currentPage]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(AllCarModels());
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    dispatch(AllCarModels());
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
                {carModelList?.length ? carModelList.length : 0} risultati
              </div>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-3"
                  placeholder="Cerca"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1); // Reset to page 1 on new search
                  }}
                />

                <button
                  className="btn btn-dark"
                  data-bs-toggle="modal"
                  data-bs-target="#addCarModel"
                  onClick={() => {
                    setIsEdit(false);
                    reset();
                  }}
                >
                  Aggiungi
                </button>
              </div>
            </div>

            <div className="listing_general">
              {/* START SHOW THIS IF DON'T HAVE RECORDS */}
              {!carModelList?.length && (
                <div className="empty_list">
                  <img src="static/img/icons/garage.svg" alt="No data" />
                  <p>Ancora nessun dato presente.</p>
                </div>
              )}
              {/* END SHOW THIS IF DON'T HAVE RECORDS */}

              {carModelList &&
                carModelList.length !== 0 &&
                carModelList.map((info) => (
                  <div className="single_list" key={info._id}>
                    <div className="global_listing">
                      <div className="avatar">
                        <img
                          src={
                            info.carType === 6
                              ? "static/img/icons/van.svg"
                              : "static/img/icons/car.svg"
                          }
                          alt={
                            info.carType === 6
                              ? "Van"
                              : info.carType === 8
                              ? "Lusso"
                              : "Berlina"
                          }
                        />
                      </div>
                      <div className="single_person">
                        <div className="name_person">{info.module}</div>
                        <div className="email_person">{info.targa}</div>
                      </div>
                    </div>
                    <div className="row_end">
                      <div className="pills_sistem">
                        {info.carType === 6
                          ? "Van"
                          : info.carType === 8
                          ? "Lusso"
                          : "Berlina"}
                      </div>
                      {info.driverAssign && (
                        <div className="pills_sistem disabled_user">
                          Già assegnato
                        </div>
                      )}

                      <button
                        className="btn btn-dark"
                        onClick={() => {
                          setIsEdit(true);
                          setCurrentCarModel(info);
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#addCarModel"
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

          <CarModelForm
            isEdit={isEdit}
            info={currentCarModel}
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

export default AdminGarage;
