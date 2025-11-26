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
    SelectIsLoading,
    adminActions,
  } from "../../redux/reducers/adminSlice";
  import { useEffect, useState } from "react";
  import { hideBootstrapModal } from "../../utilities/utils";
  import {
    CreateCapoflotta,
    GetAllCapoflotta,
    UpdateCapoflotta,
    UpdateCapoflottaPayload,
  } from "../../redux/thunks/admin";
  import { CreateCapoflottaPayload } from "../../redux/thunks/admin";
  import { SingleCity } from "../../TSModels/SuperAdmin";
  import { Admin } from "../../TSModels/Admin";
  import Loader from "../Loader";
  import { decryptData } from "../../utilities/utils";
  
  interface IProps {
    register: UseFormRegister<any>;
    handleSubmit: UseFormHandleSubmit<any>;
    errors: FieldErrors<any>;
    reset: UseFormReset<any>;
    setValue: UseFormSetValue<any>;
    cityList: SingleCity[];
    editingCapoflotta: Admin | null;
    setEditingCapoflotta: (capoflotta: Admin | null) => void;
  }
  
  const CapoflottaForm = ({
    register,
    handleSubmit,
    errors,
    reset,
    cityList,
    editingCapoflotta,
    setEditingCapoflotta,
  }: IProps) => {
  const dispatch = useAppDispatch();
  const isSuccess = useAppSelector((state) => state.admin.isSuccess);
  const isLoading = useAppSelector(SelectIsLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Get current logged-in admin's city
  const currentUser = decryptData("nccUser");
  const currentAdminCityId = currentUser?.cityId;
  
  // Filter cities: always show only current admin's city (both create and edit)
  const filteredCityList = cityList.filter((city) => city._id === currentAdminCityId);
  
    const onSubmit = async (data: CreateCapoflottaPayload & { confirmPassword: string }) => {
      const selectedCity = cityList?.find((city) => city._id === data.city);
      
      if (editingCapoflotta) {
        const payload: UpdateCapoflottaPayload = {
          capoflottaId: editingCapoflotta._id,
          email: data.email,
          cityId: selectedCity?._id || "",
          city: selectedCity?.cityName || "",
        };
    
        if (data.password && data.password.trim()) {
          payload.password = data.password;
          payload.confirmPassword = data.confirmPassword;
        }
        const result = await dispatch(UpdateCapoflotta(payload));

        if (UpdateCapoflotta.fulfilled.match(result)) {
          reset();
          hideBootstrapModal("addCapoflotta");
          dispatch(adminActions.resetState());
          dispatch(GetAllCapoflotta());
          setEditingCapoflotta(null);
          setShowPassword(false);
          setShowConfirmPassword(false);
        }
      } else {
        // Create mode
        const payload = {
          email: data.email,
          password: data.password,
          cityId: selectedCity?._id || "",
          city: selectedCity?.cityName || "",
        };
        const result = await dispatch(CreateCapoflotta(payload));
        // Only close modal and reset on success
        if (CreateCapoflotta.fulfilled.match(result)) {
          reset();
          hideBootstrapModal("addCapoflotta");
          dispatch(adminActions.resetState());
          dispatch(GetAllCapoflotta());
          setEditingCapoflotta(null);
          setShowPassword(false);
          setShowConfirmPassword(false);
        }
      }
    };
  
    useEffect(() => {
      if (isSuccess) {
        dispatch(adminActions.resetState());
      }
    }, [isSuccess, dispatch]);
  
    return (
      <>
        {isLoading && <Loader />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className="modal fade"
            id="addCapoflotta"
            data-bs-keyboard="false"
            aria-labelledby="addCapoflotta"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="addCapoflotta">
                    {editingCapoflotta ? "Modifica Capoflotta" : "Crea Capoflotta"}
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      reset();
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                      setEditingCapoflotta(null);
                    }}
                  ></button>
                </div>
  
                <div className="modal-body">
                  <div className="form_container form_in_modal">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <h5>Dati profilo</h5>
                        <p className="opacity-50">
                          Compila i dati per creare un nuovo Capoflotta
                        </p>
                        <hr />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="former_row">
                          <label htmlFor="city" className="form-label">
                            City <span className="mandatory">*</span>
                          </label>
                          <select
                            className="form-select"
                            id="city"
                            {...register("city", {
                              required: true,
                            })}
                          >
                            <option value=""></option>
                            {filteredCityList &&
                              filteredCityList.length !== 0 &&
                              filteredCityList.map((city) => (
                                <option
                                  value={city._id}
                                  key={city._id}
                                //   disabled={city.cityUsed}
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
  
                    <div className="row">
                      <div className="col-12">
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
                    </div>
  
                    <div className="row mt-4">
                      <div className="col-12 mb-3">
                        <h5>{editingCapoflotta ? "Modifica password" : "Imposta password"}</h5>
                        <p className="opacity-50">
                          {editingCapoflotta 
                            ? "Lascia vuoto per mantenere la password attuale." 
                            : "Imposta una password per il nuovo account Capoflotta."}
                        </p>
                        <hr />
                      </div>
                    </div>
  
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className="former_row position-relative">
                          <label htmlFor="password" className="form-label">
                            Password {!editingCapoflotta && <span className="mandatory">*</span>}
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control pe-5"
                            id="password"
                            {...register("password", {
                              required: !editingCapoflotta,
                              validate: (value) => {
                                if (editingCapoflotta && (!value || !value.trim())) {
                                  return true; // Password is optional in edit mode
                                }
                                const trimmed = value?.trim();
                                if (!trimmed) return ValidationMessage.required;
                                if (value !== trimmed) {
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
                          <p className="mt-1 text-danger" style={{ fontSize: "12px" }}>
                            {errors.password.message?.toString()}
                          </p>
                        )}
                      </div>
  
                      <div className="col-12 col-md-6">
                        <div className="former_row position-relative">
                          <label htmlFor="confirmPassword" className="form-label">
                            Conferma password {!editingCapoflotta && <span className="mandatory">*</span>}
                          </label>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-control pe-5"
                            id="confirmPassword"
                            {...register("confirmPassword", {
                              required: !editingCapoflotta,
                              validate: (value, formValues) => {
                                if (editingCapoflotta && (!formValues.password || !formValues.password.trim())) {
                                  return true; // If password is empty in edit mode, confirm password is also optional
                                }
                                if (!value?.trim()) {
                                  return ValidationMessage.required;
                                }
                                if (formValues.password && value !== formValues.password) {
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
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                          >
                            {showConfirmPassword ? (
                              <img src="static/img/icons/ic-eye-open.svg" />
                            ) : (
                              <img src="static/img/icons/ic-eye-closed.svg" />
                            )}
                          </span>
                        </div>
                        {errors?.confirmPassword && (
                          <p className="mt-1 text-danger" style={{ fontSize: "12px" }}>
                            {errors.confirmPassword.message?.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={isLoading}
                  >
                    {editingCapoflotta ? "Aggiorna" : "Salva"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  };
  
  export default CapoflottaForm;
  
  