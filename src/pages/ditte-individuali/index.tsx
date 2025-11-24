import { useEffect, useState } from "react";
import DynamicMenu from "../../components/dynamic-menu";
import DittaIndividualeForm from "../../components/ditta-individuale-form";
import Loader from "../../components/Loader";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  SelectIsLoading,
  SelectAllDittaIndividuale,
} from "../../redux/reducers/adminSlice";
import { useForm } from "react-hook-form";
import {
  GetAllDittaIndividuale,
  CreateDittaIndividualePayload,
} from "../../redux/thunks/admin";
import { GetAllAdminCity } from "../../redux/thunks/superAdmin";
import { Admin } from "../../TSModels/Admin";
import { SearchData } from "../../utilities/utils";
import { selectAllCityList } from "../../redux/reducers/superAdminSlice";

const DitteIndividualiPage = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(SelectIsLoading);
  const isSuccess = useAppSelector((state) => state.admin.isSuccess);
  const allDittaData = useAppSelector(SelectAllDittaIndividuale);
  const [dittaList, setDittaList] = useState<Admin[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingDitta, setEditingDitta] = useState<Admin | null>(null);
  const cities = useAppSelector(selectAllCityList);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateDittaIndividualePayload & { confirmPassword: string }>();

  useEffect(() => {
    dispatch(GetAllDittaIndividuale());
    dispatch(GetAllAdminCity());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(GetAllDittaIndividuale());
    }
  }, [isSuccess, dispatch]);

  // Filter data based on search
  useEffect(() => {
    const filtered = search
      ? SearchData(allDittaData, "email", search)
      : allDittaData;
    setDittaList(filtered as Admin[]);
    setCurrentPage(1); // Reset to first page when searching
  }, [search, allDittaData]);

  const totalPages = Math.ceil(dittaList.length / itemsPerPage);
  const paginatedList = dittaList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && !dittaList.length) {
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
                {dittaList?.length || 0} risultati
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
                  data-bs-target="#addDittaIndividuale"
                  onClick={() => {
                    reset();
                    setEditingDitta(null);
                  }}
                >
                  Aggiungi
                </button>
              </div>
            </div>

            <div className="listing_general">
              {!paginatedList?.length && (
                <div className="empty_list">
                  <img src="static/img/icons/hotels.svg" />
                  <p>Ancora nessun dato presente.</p>
                </div>
              )}
              {paginatedList &&
                paginatedList.length !== 0 &&
                paginatedList.map((ditta) => (
                  <div className="single_list" key={ditta._id}>
                    <div className="global_listing">
                      <div className="avatar">
                        <img src="static/img/icons/hotels.svg" />
                      </div>
                      <div className="single_person">
                        <div className="name_person">{ditta.email}</div>
                        <div className="email_person">{ditta.city}</div>
                      </div>
                    </div>
                    <div className="row_end">
                      <div className="pills_sistem">
                        {cities.find((city) => city._id === ditta.cityId)
                          ?.cityName || ditta.city}
                      </div>
                      <button
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#addDittaIndividuale"
                        onClick={() => {
                          setEditingDitta(ditta);
                          setValue("email", ditta.email);
                          setValue("city", ditta.cityId);
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

      <DittaIndividualeForm
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        reset={reset}
        setValue={setValue}
        cityList={cities || []}
        editingDitta={editingDitta}
        setEditingDitta={setEditingDitta}
      />
    </div>
  );
};

export default DitteIndividualiPage;

