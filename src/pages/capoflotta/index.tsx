import { useEffect, useState } from "react";
import DynamicMenu from "../../components/dynamic-menu";
import Loader from "../../components/Loader";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  SelectIsLoading,
  SelectAllCapoflotta,
} from "../../redux/reducers/adminSlice";
import { useForm } from "react-hook-form";
import {
  GetAllCapoflotta,
  CreateCapoflottaPayload,
} from "../../redux/thunks/admin";
import { GetAllAdminCity } from "../../redux/thunks/superAdmin";
import { Admin } from "../../TSModels/Admin";
import { SearchData } from "../../utilities/utils";
import { selectAllCityList } from "../../redux/reducers/superAdminSlice";
import CapoflottaForm from "../../components/capoflotta-form";

const CapoflottaPage = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(SelectIsLoading);
  const isSuccess = useAppSelector((state) => state.admin.isSuccess);
  const allCapoflottaData = useAppSelector(SelectAllCapoflotta);
  const [capoflottaList, setCapoflottaList] = useState<Admin[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingCapoflotta, setEditingCapoflotta] = useState<Admin | null>(null);
  const cities = useAppSelector(selectAllCityList);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateCapoflottaPayload & { confirmPassword: string }>();

  useEffect(() => {
    dispatch(GetAllCapoflotta());
    dispatch(GetAllAdminCity());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(GetAllCapoflotta());
    }
  }, [isSuccess, dispatch]);

  // Filter data based on search
  useEffect(() => {
    const filtered = search
      ? SearchData(allCapoflottaData, "email", search)
      : allCapoflottaData;
    setCapoflottaList(filtered as Admin[]);
    setCurrentPage(1); // Reset to first page when searching
  }, [search, allCapoflottaData]);

  const totalPages = Math.ceil(capoflottaList.length / itemsPerPage);
  const paginatedList = capoflottaList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && !capoflottaList.length) {
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
                {capoflottaList?.length || 0} risultati
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
                  data-bs-target="#addCapoflotta"
                  onClick={() => {
                    reset();
                    setEditingCapoflotta(null);
                  }}
                >
                  Aggiungi
                </button>
              </div>
            </div>

            <div className="listing_general">
              {!paginatedList?.length && (
                <div className="empty_list">
                  <img src="static/img/icons/profile.svg" />
                  <p>Ancora nessun dato presente.</p>
                </div>
              )}
              {paginatedList &&
                paginatedList.length !== 0 &&
                paginatedList.map((capoflotta) => (
                  <div className="single_list" key={capoflotta._id}>
                    <div className="global_listing">
                      <div className="avatar">
                        <img src="static/img/icons/profile.svg" />
                      </div>
                      <div className="single_person">
                        <div className="name_person">{capoflotta.email}</div>
                        <div className="email_person">{capoflotta.city}</div>
                      </div>
                    </div>
                    <div className="row_end">
                      <div className="pills_sistem">
                        {cities.find((city) => city._id === capoflotta.cityId)
                          ?.cityName || capoflotta.city}
                      </div>
                      <button
                       className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#addCapoflotta"
                        onClick={() => {
                          setEditingCapoflotta(capoflotta);
                          setValue("email", capoflotta.email);
                          setValue("city", capoflotta.cityId);
                          setValue("password", "");
                          setValue("confirmPassword", "");
                        }}
                      >
                        Modifica
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            {totalPages > 1 && (
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
            )}
          </div>
        </div>
      </div>

      <CapoflottaForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        reset={reset}
        setValue={setValue}
        cityList={cities || []}
        editingCapoflotta={editingCapoflotta}
        setEditingCapoflotta={setEditingCapoflotta}
      />
    </div>
  );
};

export default CapoflottaPage;

