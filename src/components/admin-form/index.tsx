import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import * as ValidationPattern from "../../utilities/validationPatterns/index";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  SelectIsUpdatedLoading,
  selectSuccess,
  superAdminActions,
} from "../../redux/reducers/superAdminSlice";
import { useEffect, useState } from "react";
import { hideBootstrapModal } from "../../utilities/utils";
import {
  CreateNewAdmin,
  DeleteAdmin,
  GetAllAdmins,
  UpdateAdminData,
} from "../../redux/thunks/superAdmin";
import {
  CreateAdminPayload,
  SingleAdmin,
  SingleCity,
} from "../../TSModels/SuperAdmin";
import Loader from "../Loader";

interface IProps {
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
  adminInfo: SingleAdmin | null;
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  errors: FieldErrors<any>;
  reset: UseFormReset<any>;
  setValue: UseFormSetValue<any>;
  cityList: SingleCity[];
}
const AdminForm = ({
  isEdit,
  setIsEdit,
  adminInfo,
  register,
  handleSubmit,
  errors,
  reset,
  setValue,
  cityList,
}: IProps) => {
  const dispatch = useAppDispatch();
  const isSuccess = useAppSelector(selectSuccess);
  const isLoading = useAppSelector(SelectIsUpdatedLoading);
  const [changePassword, setChangePassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const onSubmit = (data: CreateAdminPayload) => {
    const selectedCity = cityList?.find((city) => city._id === data.city);
    if (!isEdit) {
      const payload = {
        ...data,
        cityId: selectedCity?._id,
        city: selectedCity?.cityName,
      };

      dispatch(CreateNewAdmin(payload));
    } else {
      const payload: any = {
        ...data,
        adminId: adminInfo?._id,
        city: selectedCity?.cityName,
        newCityId: selectedCity?._id,
        oldCityId: adminInfo?.cityId,
      };
      if (!changePassword || !data.password) {
        delete payload.password;
      }
      dispatch(UpdateAdminData(payload));
    }
  };
  const handleDeleteAdmin = async () => {
    if (adminInfo) {
      await dispatch(
        DeleteAdmin({ removeAdminId: adminInfo._id, cityId: adminInfo.cityId })
      );
      dispatch(GetAllAdmins());
    }
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      hideBootstrapModal("addSuperAdmin");
      hideBootstrapModal("deleteAdmin");
      dispatch(superAdminActions.resetsuperAdminStates());
      setChangePassword(false);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isEdit && adminInfo) {
      setValue("city", adminInfo.cityId);
      setValue("email", adminInfo.email);
      // setValue("password", adminInfo.password);
    }
  }, [isEdit, adminInfo]);
  return (
    <>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="modal fade"
          id="addSuperAdmin"
          data-bs-keyboard="false"
          aria-labelledby="addSuperAdmin"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <>
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="addSuperAdmin">
                    Gestione admin
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      reset();
                      setIsEdit(false);
                      setChangePassword(false);
                      setShowPassword(false);
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="form_container form_in_modal">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <h5>Dati profilo</h5>
                        <p className="opacity-50">
                          Compila i dati inerenti all'auto e al conducente
                        </p>
                        <hr />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="former_row">
                          <label htmlFor="numberlicence" className="form-label">
                            City <span className="mandatory">*</span>
                          </label>
                          <select
                            className="form-select"
                            id=""
                            {...register("city", {
                              required: true,
                            })}
                          >
                            <option value=""></option>
                            {cityList &&
                              cityList.length !== 0 &&
                              cityList.map((city) => (
                                <option
                                  value={city._id}
                                  key={city._id}
                                  disabled={city.cityUsed}
                                >
                                  {city.cityName}
                                </option>
                              ))}
                          </select>
                          {errors?.city?.type == "required" && (
                            <p className="mt-1 text-danger">
                              {ValidationMessage.required}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`row ${
                        isEdit && !changePassword
                          ? "align-items-end"
                          : "align-items-start"
                      }`}
                    >
                      <div className="col-12 col-md-6">
                        <div className="former_row">
                          <label htmlFor="email" className="form-label">
                            E-mail <span className="mandatory">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="email"
                            {...register("email", {
                              required: true,
                              pattern: ValidationPattern.emailPattern,
                            })}
                          />
                          {errors?.email?.type == "required" && (
                            <p className="mt-1 text-danger">
                              {ValidationMessage.required}
                            </p>
                          )}
                          {errors?.email?.type == "pattern" && (
                            <p className="mt-1 text-danger">
                              {ValidationMessage.emailPatternMessage}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-12 mb-3">
                          <h5>
                            {isEdit
                              ? "Imposta o modifica la password"
                              : "Imposta password"}
                          </h5>
                          <p className="opacity-50">
                            {isEdit
                              ? "Se hai effettuato l'accesso con un provider come Google, puoi impostare una password qui. Se hai già impostato una password, puoi modificarla qui."
                              : "Imposta una password per il nuovo account amministratore."}
                          </p>
                          <hr />
                        </div>
                      </div>

                      <div className="row">
                        {/* Password Field */}
                        <div className="col-12 col-md-6">
                          <div className="former_row position-relative">
                            <label htmlFor="password" className="form-label">
                              Password{" "}
                              {!isEdit && <span className="mandatory">*</span>}
                            </label>
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-control pe-5"
                              id="password"
                              {...register("password", {
                                validate: (value) => {
                                  const trimmed = value?.trim();
                                  if (!isEdit) {
                                    if (!trimmed)
                                      return ValidationMessage.required;
                                    if (value !== trimmed) {
                                      return "La password non può iniziare o terminare con spazi";
                                    }
                                  }
                                  if (isEdit && value && value !== trimmed) {
                                    return "La password non può iniziare o terminare con spazi";
                                  }
                                  return true;
                                },
                              })}
                            />
                            <span
                              style={{
                                position: "absolute",
                                bottom: "7px",
                                right: "6px",
                              }}
                              onClick={() => setShowPassword((prev) => !prev)}
                            >
                              {showPassword ? (
                                <img src="static/img/icons/ic-eye-open.svg" />
                              ) : (
                                <img src="static/img/icons/ic-eye-closed.svg" />
                              )}
                            </span>
                          </div>
                          {errors?.password && (
                            <p
                              className="mt-1 text-danger"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.password.message?.toString()}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="col-12 col-md-6">
                          <div className="former_row position-relative">
                            <label
                              htmlFor="confirmPassword"
                              className="form-label"
                            >
                              Conferma password{" "}
                              {!isEdit && <span className="mandatory">*</span>}
                            </label>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className="form-control pe-5"
                              id="confirmPassword"
                              {...register("confirmPassword", {
                                validate: (value, formValues) => {
                                  if (
                                    (!isEdit || formValues.password) &&
                                    !value?.trim()
                                  ) {
                                    return ValidationMessage.required;
                                  }
                                  if (
                                    formValues.password &&
                                    value !== formValues.password
                                  ) {
                                    return "Passwords do not match";
                                  }
                                  return true;
                                },
                              })}
                            />
                            <span
                              style={{
                                position: "absolute",
                                bottom: "7px",
                                right: "6px",
                              }}
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                            >
                              {showConfirmPassword ? (
                                <img src="static/img/icons/ic-eye-open.svg" />
                              ) : (
                                <img src="static/img/icons/ic-eye-closed.svg" />
                              )}
                            </span>
                          </div>
                          {errors?.confirmPassword && (
                            <p
                              className="mt-1 text-danger"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.confirmPassword.message?.toString()}
                            </p>
                          )}
                        </div>
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
                      data-bs-target="#deleteAdmin"
                      disabled={isLoading}
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
            </>
          </div>
        </div>
      </form>
      <div
        className="modal fade"
        id="deleteAdmin"
        data-bs-keyboard="false"
        aria-labelledby="deleteAdmin"
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
                    <h5>Elimina queste informazioni di amministratore</h5>
                    <p>
                      L'operazione di eliminazione è irreversibile e dopo aver
                      eliminato le informazioni di questo amministratore non
                      sarà accessibile
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
                onClick={() => handleDeleteAdmin()}
              >
                Elimina amministratore
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminForm;
