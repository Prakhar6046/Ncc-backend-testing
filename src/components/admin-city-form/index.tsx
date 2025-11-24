import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  SelectIsUpdatedLoading,
  selectSuccess,
  superAdminActions,
} from "../../redux/reducers/superAdminSlice";
import { useEffect } from "react";
import { hideBootstrapModal } from "../../utilities/utils";
import {
  CreateNewCity,
  DeleteAdminCity,
  UpdateCityData,
} from "../../redux/thunks/superAdmin";
import { CreateCityPayload, SingleCity } from "../../TSModels/SuperAdmin";
interface IProps {
  isEdit: boolean;
  cityInfo: SingleCity | null;
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  errors: FieldErrors<any>;
  reset: UseFormReset<any>;
  setValue: UseFormSetValue<any>;
}
const AdminCityForm = ({
  isEdit,
  cityInfo,
  register,
  handleSubmit,
  errors,
  reset,
  setValue,
}: IProps) => {
  const dispatch = useAppDispatch();
  const isSuccess = useAppSelector(selectSuccess);
  const isLoading = useAppSelector(SelectIsUpdatedLoading);

  const onSubmit = (data: CreateCityPayload) => {
    if (!isEdit) {
      dispatch(CreateNewCity(data));
    } else {
      const payload = {
        ...data,
        cityId: cityInfo?._id,
      };
      dispatch(UpdateCityData(payload));
    }
  };
  const handleDeleteCity = () => {
    if (cityInfo) {
      dispatch(DeleteAdminCity({ cityId: cityInfo._id }));
    }
  };
  useEffect(() => {
    if (isSuccess) {
      reset();
      hideBootstrapModal("addSuperAdminCity");
      hideBootstrapModal("deleteCity");
      dispatch(superAdminActions.resetsuperAdminStates());
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isEdit && cityInfo) {
      setValue("cityName", cityInfo.cityName);
    }
  }, [isEdit, cityInfo]);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="modal fade"
          id="addSuperAdminCity"
          data-bs-keyboard="false"
          aria-labelledby="addSuperAdminCity"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="addSuperAdmin">
                  Dati della città
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
                      <h5>Dati della città</h5>
                      <p>Compila i dati relativi alla città</p>
                      <hr />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="former_row">
                        <label htmlFor="numberlicence" className="form-label">
                          Nome della città <span className="mandatory">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          {...register("cityName", {
                            required: true,
                          })}
                        />
                      </div>
                      {errors?.city?.type == "required" && (
                        <p className="mt-1 text-danger">
                          {ValidationMessage.required}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {isEdit && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    disabled={isLoading}
                    data-bs-target={
                      cityInfo?.cityUsed ? "#messageModal" : "#deleteCity"
                    }
                  >
                    Elimina
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={isLoading}
                >
                  Salva
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div
        className="modal fade"
        id="deleteCity"
        data-bs-keyboard="false"
        aria-labelledby="deleteCity"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="viewDriver">
                Attenzione
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
                  <div className="col-12">
                    <h5>Elimina questi dati della città</h5>
                    <p>
                      Questa operazione è irreversibile dopo aver eliminato la
                      città, tutti i dati relativi alla città andranno persi
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                // data-bs-dismiss="modal"
                disabled={isLoading}
                onClick={() => handleDeleteCity()}
              >
                Elimina città
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="messageModal"
        data-bs-keyboard="false"
        aria-labelledby="messageModal"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="viewDriver">
                Attenzione
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
                  <div className="col-12">
                    {/* <h5></h5> */}
                    <p>
                      Questa città ha un amministratore, non puoi eliminare
                      questa città se desideri eliminare questa città, quindi
                      elimina prima l'amministratore e poi potrai eliminare
                      questa città
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                // onClick={() => handleDeleteCity()}
              >
                vicino
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminCityForm;
