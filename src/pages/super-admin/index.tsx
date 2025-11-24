import { useEffect, useState } from "react";
import AdminForm from "../../components/admin-form";
import Loader from "../../components/Loader";
import SuperAdminMenu from "../../components/superadmin-menu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectAllAdminList,
  selectAllCityList,
  selectIsLoading,
  selectSuccess,
} from "../../redux/reducers/superAdminSlice";
import { useForm } from "react-hook-form";
import { GetAllAdminCity, GetAllAdmins } from "../../redux/thunks/superAdmin";
import { SingleAdmin } from "../../TSModels/SuperAdmin";
import { SearchData } from "../../utilities/utils";

const SuperAdmin = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const isSuccess = useAppSelector(selectSuccess);
  const admins = useAppSelector(selectAllAdminList);
  const cities = useAppSelector(selectAllCityList);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const [adminList, setAdminList] = useState<SingleAdmin[]>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<SingleAdmin | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const totalPages = admins ? Math.ceil(admins.length / itemsPerPage) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    if (admins) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentAdmins = admins?.slice(startIndex, endIndex);
      setAdminList(currentAdmins);
    }
  }, [admins, currentPage]);
  useEffect(() => {
    if (admins) {
      const filterAdmins = SearchData(admins, "email", search);
      setAdminList(filterAdmins);
    }
  }, [search]);
  useEffect(() => {
    if (isSuccess) {
      dispatch(GetAllAdmins());
      dispatch(GetAllAdminCity());
    }
  }, [isSuccess]);
  useEffect(() => {
    dispatch(GetAllAdmins());
    dispatch(GetAllAdminCity());
  }, []);

  useEffect(() => {
    setSearch("");
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
                {admins?.length ? admins.length : 0} risultati
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
                  data-bs-target="#addSuperAdmin"
                  onClick={() => {
                    setIsEdit(false), reset();
                  }}
                >
                  Aggiungi
                </button>
              </div>
            </div>

            <div className="listing_general">
              {!adminList?.length && (
                <div className="empty_list">
                  <img src="static/img/icons/profile.svg" />
                  <p>Ancora nessun dato presente.</p>
                </div>
              )}
              {adminList &&
                adminList.length !== 0 &&
                adminList.map((admin) => (
                  <div className="single_list" key={admin._id}>
                    <div className="global_listing">
                      <div className="avatar">
                        <img src="static/img/icons/profile.svg" />
                      </div>
                      <div className="single_person">
                        <div className="name_person">{admin.email}</div>
                      </div>
                    </div>
                    <div className="row_end">
                      <div className="pills_sistem">
                        {" "}
                        {cities.find((city) => city._id === admin.cityId)
                          ?.cityName || ""}
                      </div>

                      <button
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#addSuperAdmin"
                        onClick={() => {
                          setIsEdit(true), setCurrentAdmin(admin);
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

      <AdminForm
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        adminInfo={currentAdmin}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        reset={reset}
        setValue={setValue}
        cityList={cities}
        // watch={watch}
      />
    </div>
  );
};

export default SuperAdmin;
