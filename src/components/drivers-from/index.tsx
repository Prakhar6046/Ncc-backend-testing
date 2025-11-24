// import * as ValidationPattern from "../../utilities/validationPatterns/index";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import {
  AddNewDriver,
  Category,
  SingleCarModelInfo,
  SingleDriverInfo,
} from "../../TSModels/Admin";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  AddNewDriverInfo,
  DeleteDriverInfo,
  UpdateDriverInfo,
} from "../../redux/thunks/admin";
import {
  adminActions,
  SelectAddDoctorSuccess,
  SelectAddDriverLoading,
  selectIsUpdatedLoader,
  selectSuccess,
  SelectUpdateDriverLoading,
  SelectUpdateDriverSuccess,
} from "../../redux/reducers/adminSlice";
import { useEffect, useState } from "react";
import { decryptData, hideBootstrapModal } from "../../utilities/utils";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

import { getAllCategories } from "../../redux/thunks/admin";
import { SelectAllCategories } from "../../redux/reducers/adminSlice";
interface IProps {
  isEdit: boolean;
  info: SingleDriverInfo | undefined;
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  errors: FieldErrors<any>;
  reset: UseFormReset<any>;
  setValue: UseFormSetValue<any>;
  AllCarModelsInfo: SingleCarModelInfo[];
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDriver: React.Dispatch<
    React.SetStateAction<SingleDriverInfo | undefined>
  >;
}
const DriversForm = ({
  isEdit,
  info,
  register,
  handleSubmit,
  errors,
  reset,
  AllCarModelsInfo,
  setCurrentDriver,
  setIsEdit,
}: IProps) => {
  const dispatch = useAppDispatch();
  const isSuccess = useAppSelector(selectSuccess);
  const isLoading = useAppSelector(selectIsUpdatedLoader);
  const addDriverSuccess=useAppSelector(SelectAddDoctorSuccess);
  const addDriverLoading=useAppSelector(SelectAddDriverLoading);
  const updateDriverSuccess=useAppSelector(SelectUpdateDriverSuccess);
  const updateDriverLoading=useAppSelector(SelectUpdateDriverLoading);
  const user = decryptData("nccUser");
  const categories = useAppSelector(SelectAllCategories) as Category[];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const onSubmit = (data: AddNewDriver) => {
    const { confirmPassword, ...rest } = data;

    if (!isEdit) {
      const payload = {
        ...rest,
        accessTheApp: rest.accessTheApp == 1 ? true : false,
      };
      dispatch(AddNewDriverInfo(payload));
    } else {
      const payload: any = {
        ...rest,
        carDriverId: info?._id,
        accessTheApp: rest.accessTheApp == 1 ? true : false,
      };

      if (rest.driverPassword?.trim()) {
        payload.driverPassword = rest.driverPassword.trim();
      }

      dispatch(UpdateDriverInfo(payload));
    }
  };

  const DeleteDriver = () => {
    if (info) {
      dispatch(DeleteDriverInfo({ driverId: info._id }));
    }
  };
  useEffect(() => {
    if (addDriverSuccess|| updateDriverSuccess || isSuccess) {
      reset();
      hideBootstrapModal("addDriver");
      hideBootstrapModal("deleteDriver");
    }
  }, [addDriverSuccess,updateDriverSuccess,isSuccess]);

  useEffect(() => {
    if (isEdit && info) {
      reset({
        ...info,
        carModel:
          typeof info.carModel === "string"
            ? info.carModel
            : info.carModel?._id ?? "",
        accessTheApp: info.accessTheApp ? 1 : 2,
        driverPassword: "",
      });
      setChangePassword(false);
    } else {
      reset({
        driverName: "",
        driverSurname: "",
        driverEmail: "",
        driverPassword: "",
        carModel: "",
        category: "",
        accessTheApp: 1,
        cityOfService: "",
      });
      setChangePassword(false);
    }
  }, [isEdit, info, reset]);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch, user?._id]);

  const validateNotEmpty = (value: any) =>
    (typeof value === "string" ? value.trim() !== "" : Boolean(value)) ||
    ValidationMessage.required;

  return (
    <>
      <div
        className="modal fade"
        id="addDriver"
        data-bs-keyboard="false"
        aria-labelledby="addDriver"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="addDriver">
                  Gestione auto
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    reset();
                    setIsEdit(false);
                    setCurrentDriver(undefined);
                    dispatch(adminActions.resetState());
                    setShowPassword(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form_container form_in_modal"></div>
                <div className="form_container form_in_modal">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <h5>Accesso all'app</h5>
                      <p>
                        Crea le credenziali di accesso all'app. Ricorda di
                        consegnare le credenziali al tuo driver
                      </p>
                      <hr />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label htmlFor="name" className="form-label">
                          Nome driver <span className="mandatory">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          {...register("driverName", {
                            required: true,
                            validate: validateNotEmpty,
                          })}
                        />
                        {errors?.driverName && (
                          <p className="mt-1 text-danger">
                            {ValidationMessage.required}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label htmlFor="secondname" className="form-label">
                          Cognome driver <span className="mandatory">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="secondname"
                          {...register("driverSurname", {
                            required: true,
                            validate: validateNotEmpty,
                          })}
                        />
                        {errors?.driverSurname && (
                          <p className="mt-1 text-danger">
                            {ValidationMessage.required}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label className="form-label">Modello auto</label>

                        <select
                          className="form-select"
                          {...register("carModel")}
                          // defaultValue={info?.carModel ?? ""}
                        >
                          <option value="" disabled>
                            Seleziona un’auto
                          </option>

                          {AllCarModelsInfo?.map((car) => (
                            <option
                              key={car._id}
                              value={car._id}
                              disabled={
                                car.driverAssign &&
                                (!isEdit || info?.carModel !== car._id)
                              }
                            >
                              {car.module} – {car.targa}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label className="form-label">
                          categoria
                          <span className="mandatory"> *</span>
                        </label>

                        <select
                          className="form-select"
                          {...register("category", {
                            required: true,
                            validate: validateNotEmpty,
                          })}
                          // defaultValue={info?.carModel ?? ""}
                        >
                          <option value="" disabled>
                            seleziona la categoria
                          </option>

                          {categories?.map((cat, idx) => (
                            <option key={idx} value={cat.category}>
                              {cat.category}
                            </option>
                          ))}
                        </select>

                        {errors?.category?.type === "required" && (
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
                    <div className="col-12">
                      <div className="former_row">
                        <label htmlFor="mail" className="form-label">
                          Abilita accesso all'app{" "}
                          <span className="mandatory">*</span>
                        </label>
                        <select
                          className="form-select"
                          {...register("accessTheApp", {
                            required: true,
                            validate: validateNotEmpty,
                          })}
                        >
                          <option value={1}>Consenti l'accesso all'app</option>
                          <option value={2}>Blocca accesso all'app</option>
                        </select>
                        {errors?.accessTheApp?.type == "required" && (
                          <p className="mt-1 text-danger">
                            {ValidationMessage.required}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className="former_row">
                          <label htmlFor="mail" className="form-label">
                            E-mail <span className="mandatory">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="mail"
                            {...register("driverEmail", {
                              required: true,
                              validate: validateNotEmpty,
                            })}
                          />
                          {errors?.driverEmail?.type == "required" && (
                            <p className="mt-1 text-danger">
                              {ValidationMessage.required}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <div className="former_row">
                          <label htmlFor="address" className="form-label">
                            Città del servizio{" "}
                            <span className="mandatory">*</span>
                          </label>
                          <select
                            className="form-select"
                            {...register("cityOfService", {
                              required: true,
                              validate: validateNotEmpty,
                            })}
                          >
                            <option value={user?.cityId}>{user?.city}</option>
                          </select>
                          {errors?.cityOfService?.type == "required" && (
                            <p className="mt-1 text-danger">
                              {ValidationMessage.required}
                            </p>
                          )}
                        </div>
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
                            {...register("driverPassword", {
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
                        {errors?.driverPassword && (
                          <p
                            className="mt-1 text-danger"
                            style={{ fontSize: "12px" }}
                          >
                            {errors.driverPassword.message?.toString()}
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
                                  (!isEdit || formValues.driverPassword) &&
                                  !value?.trim()
                                ) {
                                  return ValidationMessage.required;
                                }
                                if (
                                  formValues.driverPassword &&
                                  value !== formValues.driverPassword
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
                    data-bs-target="#deleteDriver"
                    disabled={isLoading ||addDriverLoading||updateDriverLoading}
                  >
                    Elimina
                  </button>
                )}

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={isLoading || addDriverLoading || updateDriverLoading}
                >
                  Salva
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="deleteDriver"
        data-bs-keyboard="false"
        aria-labelledby="deleteDriver"
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
                    <h5>Elimina queste informazioni sul driver</h5>
                    <p>
                      L'operazione è irreversibile. Eliminando le informazioni
                      su questo driver andranno perse per sempre.
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
                onClick={() => DeleteDriver()}
              >
                Elimina conducente
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DriversForm;
