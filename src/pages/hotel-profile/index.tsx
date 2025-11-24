import { useForm } from "react-hook-form";
import StructureMenu from "../../components/structure-menu";
import { RegisterForm } from "../../TSModels/Auth";
import * as ValidationPattern from "../../utilities/validationPatterns/index";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  handleDeleteHotel,
  handleGetCompanyData,
  handleUpdateCompanyData,
} from "../../redux/thunks/hotel";
import {
  hotelActions,
  selectHotelData,
  selectIsDelete,
  selectIsLoading,
  selectSuccess,
} from "../../redux/reducers/hotelProfile";
import { HotelData } from "../../TSModels/Hotel";
import Loader from "../../components/Loader";
import { Logout } from "../../utilities/utils";
import { useNavigate } from "react-router-dom";

const HotelProfile = () => {
  const hotelData: HotelData = useAppSelector(selectHotelData);
  const isLoading = useAppSelector(selectIsLoading);
  const isSuccess = useAppSelector(selectSuccess);
  const isDelete = useAppSelector(selectIsDelete);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = useForm<RegisterForm>({ mode: "onChange" });
  const onSubmit = (data: RegisterForm) => {
    const payload = {
      ...data,
      city: hotelData?.city,
    };
    dispatch(handleUpdateCompanyData(payload));
  };

  useEffect(() => {
    if (hotelData) {
      setValue("name", hotelData.name);
      setValue("address", hotelData.address);
      setValue("companyName", hotelData.companyName);
      setValue("email", hotelData.email);
      setValue("pec", hotelData.pec);
      setValue("piva", hotelData.piva);
      setValue("sdi", hotelData.sdi);
      setValue("surname", hotelData.surname);
    }
  }, [hotelData]);
  useEffect(() => {
    dispatch(handleGetCompanyData());
  }, []);
  useEffect(() => {
    if (isSuccess) {
      dispatch(hotelActions.resetHotelState());
      dispatch(handleGetCompanyData());
      setValue("password", "");
      setValue("confirmPassword", "");
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isDelete) {
      Logout();
      navigate("/");
    }
  }, [isDelete]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        <StructureMenu />

        <div className="col-12 col-md-9">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form_container">
              <div className="row">
                <div className="col-12 mb-3">
                  <h5>Dati profilo</h5>
                  <p>
                    Compila i campi indicando il nome di chi sta creando il
                    profilo e tutti i contatti necessari.
                  </p>
                  <hr />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="former_row">
                    <label htmlFor="name" className="form-label">
                      Nome <span className="mandatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      {...register("name", {
                        required: true,
                        pattern: {
                          value: /^[A-Za-zÀ-ÿ\s'-]+$/,
                          message:
                            "Il nome non può contenere numeri o caratteri speciali.",
                        },
                      })}
                    />
                    {errors?.name?.type == "required" && (
                      <p className="mt-1 text-danger">
                        {ValidationMessage.required}
                      </p>
                    )}
                    {errors?.name && (
                      <p className="mt-1 text-danger">{errors.name.message}</p>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="former_row">
                    <label htmlFor="secondname" className="form-label">
                      Cognome <span className="mandatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="secondname"
                      {...register("surname", {
                        required: true,
                        pattern: {
                          value: /^[A-Za-zÀ-ÿ\s'-]+$/,
                          message:
                            "Il cognome nome non può contenere numeri o caratteri speciali.",
                        },
                      })}
                    />
                    {errors?.surname?.type == "required" && (
                      <p className="mt-1 text-danger">
                        {ValidationMessage.required}
                      </p>
                    )}
                    {errors?.surname && (
                      <p className="mt-1 text-danger">{errors.surname.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="former_row">
                    <label htmlFor="mail" className="form-label">
                      E-mail <span className="mandatory">*</span>
                    </label>
                    <input
                      type="e-mail"
                      className="form-control"
                      id="mail"
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
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="former_row">
                    <label htmlFor="password" className="form-label">
                      Password <span className="mandatory">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control pe-5"
                      id="password"
                      {...register("password", {
                        pattern: ValidationPattern.passwordPattern,
                      })}
                    />
                    {errors?.password?.type == "required" && (
                      <p className="mt-1 text-danger">
                        {ValidationMessage.required}
                      </p>
                    )}
                    {errors?.password?.type == "pattern" && (
                      <p className="mt-1 text-danger">
                        {ValidationMessage.passwordPatternMessage}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="former_row">
                    <label htmlFor="repeatpassword" className="form-label">
                      Ripeti password <span className="mandatory">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control pe-5"
                      id="repeatpassword"
                      {...register("confirmPassword", {
                        required: watch("password") ? true : false,
                        validate: (value) =>
                          value === getValues().password?.toString() ||
                          "Confirm Password do not match with password!",
                      })}
                    />
                    {watch("password") &&
                      errors?.confirmPassword?.type == "required" && (
                        <p className="mt-1 text-danger">
                          {ValidationMessage.required}
                        </p>
                      )}
                    {watch("password") &&
                      errors?.confirmPassword?.type == "validate" && (
                        <p className="mt-1 text-danger">
                          {errors?.confirmPassword?.message}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="form_container">
              <div className="row">
                <div className="col-12 mb-3">
                  <h5>Dati aziendali</h5>
                  <p>
                    Indica i dati fiscali per gestire la parte relativa alla
                    fatturazione del servizio.
                  </p>
                  <hr />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="former_row">
                    <label htmlFor="company" className="form-label">
                      Ragione sociale <span className="mandatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="company"
                      {...register("companyName", {
                        required: true,
                      })}
                    />
                    {errors?.companyName?.type == "required" && (
                      <p className="mt-1 text-danger">
                        {ValidationMessage.required}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="former_row">
                    <label htmlFor="vat" className="form-label">
                      P.iva <span className="mandatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="vat"
                      {...register("piva", {
                        required: true,
                      })}
                    />
                    {errors?.piva?.type == "required" && (
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
                    <label htmlFor="address" className="form-label">
                      Indirizzo <span className="mandatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      {...register("address", {
                        required: true,
                      })}
                    />
                    {errors?.address?.type == "required" && (
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
                    <label htmlFor="pec" className="form-label">
                      PEC <span className="mandatory">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="pec"
                      {...register("pec", {
                        required: true,
                      })}
                    />
                    {errors?.pec?.type == "required" && (
                      <p className="mt-1 text-danger">
                        {ValidationMessage.required}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="former_row">
                    <label htmlFor="sdi" className="form-label">
                      SDI <span className="mandatory">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="sdi"
                      {...register("sdi", {
                        required: true,
                      })}
                    />
                    {errors?.sdi?.type == "required" && (
                      <p className="mt-1 text-danger">
                        {ValidationMessage.required}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button className="btn btn-dark" type="submit">
                      Salva le modifiche
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="form_container">
            <div className="row">
              <div className="col-12 mb-3">
                <h5>Rimozione del profilo</h5>
                <p>
                  Elimina il tuo account dalla piattaforma, l'azione è
                  irreversibile
                </p>
                <hr />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#viewDriver"
                  >
                    Elimina il mio account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="viewDriver"
        data-bs-keyboard="false"
        aria-labelledby="viewDriver"
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
                    <h5>Eliminazione del profilo</h5>
                    <p>
                      L'operazione è irreversibile. Eliminando il tuo account i
                      dati verranno persi per sempre.
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
                onClick={() => dispatch(handleDeleteHotel({}))}
              >
                Elimina il mio account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelProfile;
