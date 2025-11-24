import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DynamicMenu from "../../components/dynamic-menu";
import DriversForm from "../../components/drivers-from";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { AllCarModels, GetAllDriverInfo } from "../../redux/thunks/admin";
import {
  adminActions,
  SelectAddDoctorSuccess,
  SelectAllDriverInfo,
  selectIsUpdatedLoader,
  selectSuccess,
  SelectUpdateDriverSuccess,
} from "../../redux/reducers/adminSlice";
import { AddNewDriver, SingleDriverInfo } from "../../TSModels/Admin";
import Loader from "../../components/Loader";
import { SearchData } from "../../utilities/utils";
import { SelectAllCarModelInfo } from "../../redux/reducers/carModelSlice";

const AdminDrivers = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddNewDriver>();
  const AllDriverInfo = useAppSelector(SelectAllDriverInfo);
  const AllCarModelsInfo = useAppSelector(SelectAllCarModelInfo);
  const isAdminLoading = useAppSelector(selectIsUpdatedLoader);
  const [isEdit, setIsEdit] = useState(false);
  const addDriverSuccess=useAppSelector(SelectAddDoctorSuccess);
  const updateDriverSuccess=useAppSelector(SelectUpdateDriverSuccess);
  const [currentDriver, setCurrentDriver] = useState<SingleDriverInfo>();

  const [driverList, setDriverList] = useState<SingleDriverInfo[]>();
  const [search, setSearch] = useState<string>("");
  const isSuccess = useAppSelector(selectSuccess);
  const [currentPage, setCurrentPage] = useState<number>(1);
 
  const itemsPerPage = 5;
  const totalPages = AllDriverInfo
    ? Math.ceil(AllDriverInfo.length / itemsPerPage)
    : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    if (AllDriverInfo) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentDrivers = AllDriverInfo?.slice(startIndex, endIndex);
      setDriverList(currentDrivers);
    }
  }, [AllDriverInfo, currentPage]);
  useEffect(() => {
    if (AllDriverInfo) {
      const filterDrivers = SearchData(AllDriverInfo, "driverName", search);
      setDriverList(filterDrivers);
    }
  }, [search]);
  useEffect(() => {
    if (isSuccess|| addDriverSuccess|| updateDriverSuccess) {
      dispatch(GetAllDriverInfo());
      dispatch(AllCarModels());
      setCurrentDriver(undefined);
      setIsEdit(false);
    }
     dispatch(adminActions.resetDriverState());
  }, [isSuccess,addDriverSuccess,updateDriverSuccess]);
  useEffect(() => {
    dispatch(GetAllDriverInfo());
    dispatch(AllCarModels());
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
                {driverList?.length ? driverList?.length : 0} risultati
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
                  data-bs-target="#addDriver"
                  onClick={() => {
                    setIsEdit(false);
                    setCurrentDriver(undefined); // ✅ no driver preselected
                    reset(); // ✅ clear form values manually
                    dispatch(adminActions.resetState());
                  }}
                >
                  Aggiungi
                </button>
              </div>
            </div>

            <div className="listing_general">
              {/* START SHOW THIS IF DON'T HAVE RECORDS */}
              {!driverList?.length && (
                <div className="empty_list">
                  <img src="static/img/icons/garage.svg" />
                  <p>Ancora nessun dato presente.</p>
                </div>
              )}
              {/* END SHOW THIS IF DON'T HAVE RECORDS */}

              {driverList &&
                driverList.length !== 0 &&
                driverList.map((info) => (
                  <div className="single_list" key={info._id}>
                    <div className="global_listing">
                      <div className="avatar">
                        <img
                          src={
                            info.carModel?.carType === 6
                              ? "static/img/icons/van.svg"
                              : "static/img/icons/car.svg"
                          }
                        />
                      </div>
                      <div className="single_person">
                        <div className="name_person">
                          {info?.driverName} {info?.driverSurname}
                        </div>
                        <div className="email_person">{info?.driverEmail}</div>
                      </div>
                    </div>
                    <div className="row_end">
                      {/* <div className="pills_sistem">
                        {info.carType === 6 ? "Van" : "Berlina"}
                      </div> */}
                      {!info?.accessTheApp && (
                        <div className="pills_sistem disabled_user">
                          Disabilitato
                        </div>
                      )}

                      <button
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#addDriver"
                        onClick={() => {
                          setCurrentDriver(info), setIsEdit(true);
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
          <DriversForm
            isEdit={isEdit}
            info={currentDriver}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            reset={reset}
            setValue={setValue}
            AllCarModelsInfo={AllCarModelsInfo}
            setIsEdit={setIsEdit}
            setCurrentDriver={setCurrentDriver}
          />
        </div>
      </div>
    </div>
  );
};
export default AdminDrivers;
