import { useForm } from "react-hook-form";
import * as ValidationPattern from "../../utilities/validationPatterns/index";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import { RegisterForm } from "../../TSModels/Auth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  authActions,
  selectIsLoading,
  selectSuccess,
} from "../../redux/reducers/authSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { handleCompanyRegister } from "../../redux/thunks/auth";
import { GetAllAdminCity, GetAllCityWithAdmin } from "../../redux/thunks/superAdmin";
import { selectAllCityList} from "../../redux/reducers/superAdminSlice";
const SignUp = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const cities = useAppSelector(selectAllCityList);
  const filteredCities=cities.filter((e)=>e.cityUsed==true)

  const isSuccess = useAppSelector(selectSuccess);
   const [showPassword, setShowPassword] = useState(false);
    const [retypeShowPassword, setRetypeShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm<RegisterForm>();
  const onSubmit = (data: RegisterForm) => {
    dispatch(handleCompanyRegister(data));
  };

  useEffect(() => {
    dispatch(authActions.resetAuthStates());
    dispatch(GetAllAdminCity());
  }, []);
    useEffect(() => {
    dispatch(GetAllCityWithAdmin());
  }, []);
  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate("/sign-in");
    }
  }, [isSuccess]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <div className="message_container">
              <p>
                <strong>Benvenuto</strong>, se gestisci una struttura ricettiva
                crea subito un profilo gratuito sulla piattaforma per prenotare
                NCC nella tua città.
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row justify-content-center">
            <div className="col-12 col-md-8">
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
                          validate: (value) =>
                            value.trim() !== "" || ValidationMessage.required,
                        })}
                      />
                      {errors?.name?.type == "required" && (
                        <p className="mt-1 text-danger">
                          {ValidationMessage.required}
                        </p>
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
                          validate: (value) =>
                            value.trim() !== "" || ValidationMessage.required,
                        })}
                      />
                      {errors?.surname?.type == "required" && (
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
                    <div className="former_row position-relative">
                      <label htmlFor="password" className="form-label">
                        Password <span className="mandatory">*</span>
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        {...register("password", {
                          required: true,
                          pattern: ValidationPattern.passwordPattern,
                        })}
                        style={{
                          paddingRight: "34px",
                        }}
                      />
                       <span
                      style={{position: "absolute", bottom: "7px", right: "6px"}}
                      onClick={()=>setShowPassword((prev)=>!prev)}
                    >
                      {" "}
                      {showPassword ? (
                        <img src="static/img/icons/ic-eye-open.svg" />
                      ) : (
                        <img src="static/img/icons/ic-eye-closed.svg" />
                      )}
                    </span>
                    
                    </div>
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
                  <div className="col-12 col-md-6">
                    <div className="former_row position-relative" >
                      <label htmlFor="repeatpassword" className="form-label">
                        Ripeti password <span className="mandatory">*</span>
                      </label>
                      <input
                         type={retypeShowPassword ? "text" : "password"}
                        className="form-control"
                        id="repeatpassword"
                        {...register("confirmPassword", {
                          required: true,
                          validate: (value) =>
                            value === getValues().password?.toString() ||
                            "Confirm Password do not match with password!",
                        })}
                        style={{
                          paddingRight: "34px",
                        }}
                      />
                       <span
                      style={{position: "absolute", bottom: "7px", right: "6px"}}
                      onClick={()=>setRetypeShowPassword((prev)=>!prev)}
                    >
                      {" "}
                      {retypeShowPassword ? (
                        <img src="static/img/icons/ic-eye-open.svg" />
                      ) : (
                        <img src="static/img/icons/ic-eye-closed.svg" />
                      )}
                    </span>
                    
                    </div>
                      {errors?.confirmPassword?.type == "required" && (
                        <p className="mt-1 text-danger" style={{fontSize:"12px"}}>
                          {ValidationMessage.required}
                        </p>
                      )}
                      {errors?.confirmPassword?.type == "validate" && (
                        <p className="mt-1 text-danger" style={{fontSize:"12px"}}>
                          {errors?.confirmPassword?.message}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-md-8">
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
                          validate: (value) =>
                            value.trim() !== "" || ValidationMessage.required,
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
                          validate: (value) =>
                            value.trim() !== "" || ValidationMessage.required,
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
                          validate: (value) =>
                            value.trim() !== "" || ValidationMessage.required,
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
                  <div className="col-12">
                    <div className="former_row">
                      <label htmlFor="address" className="form-label">
                        Città del servizio <span className="mandatory">*</span>
                      </label>
                      <select
                        className="form-select"
                        {...register("city", {
                          required: true,
                        })}
                      >
                        {filteredCities &&
                          filteredCities.length !== 0 &&
                          filteredCities.map((city) => (
                            <option value={city._id}>{city.cityName}</option>
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
                          validate: (value) =>
                            value.trim() !== "" || ValidationMessage.required,
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
                          validate: (value) =>
                            value.trim() !== "" || ValidationMessage.required,
                          pattern: {
                            value: ValidationPattern.sdiPattern,
                            message: ValidationMessage.sdiPatternMessage,
                          },
                        })}
                      />
                      {errors?.sdi?.type == "required" && (
                        <p className="mt-1 text-danger">
                          {ValidationMessage.required}
                        </p>
                      )}
                      {errors?.sdi?.type === "pattern" && (
                        <p className="mt-1 text-danger">
                          {errors?.sdi?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="former_row form-check">
                     

                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="termscondition"
                        {...register("termsAccepted", {
                          validate: (value) =>
                            value === true ||
                            ValidationMessage.termsAndConditionsMessage,
                        })}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="termscondition"
                      >
                        Accetto{" "}
                        <Link
                          to="https://nethgo.com/termini-e-condizioni/"
                          className="linker"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          i termini e condizioni
                        </Link>
                        del servizio
                        <span className="mandatory">*</span>
                      </label>
                       {errors?.termsAccepted?.type === "validate" && (
                        <p className="mt-1 text-danger">
                          {errors?.termsAccepted?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button className="btn btn-dark" type="submit">
                        Crea un nuovo account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div
        className="modal fade"
        id="readTermsConditions"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="readTermsConditionsLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="readTermsConditionsLabel">
                Termini e condizioni del servizio
              </h1>
            </div>
            <div className="modal-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                tincidunt dolor quam, et rhoncus nisi tristique gravida. Donec
                vulputate dui risus, sit amet vestibulum massa mollis quis. Ut
                varius magna at lacus pretium, a porttitor velit scelerisque.
                Maecenas malesuada convallis nisi vitae hendrerit. Curabitur
                gravida rutrum felis at sagittis. Vivamus auctor et arcu ut
                vestibulum. Phasellus commodo sagittis dictum. Sed ut congue
                justo. In hac habitasse platea dictumst. Vivamus vel elementum
                diam. Donec blandit dui non augue posuere cursus. Vivamus et
                orci sed nunc tempor cursus.
              </p>
              <p>
                Vivamus in facilisis arcu. Cras odio purus, dignissim eu
                hendrerit eget, sodales eget nisi. Aliquam vitae magna massa.
                Pellentesque ac sapien tempor nunc lobortis pretium. Integer
                egestas sagittis lorem nec pulvinar. In quis ex sed tellus
                auctor sollicitudin eget et lacus. Pellentesque sed diam vitae
                tortor rutrum elementum quis ultricies risus.
              </p>
              <p>
                Sed suscipit mauris in nisl pulvinar, quis luctus tellus
                laoreet. Ut eros dui, tempus id urna at, efficitur posuere nisi.
                Suspendisse potenti. Vivamus sagittis sem quis sollicitudin
                commodo. Suspendisse varius elit nec fringilla blandit.
                Vestibulum imperdiet fermentum gravida. Etiam feugiat ligula
                augue, luctus fringilla felis rhoncus convallis. Donec sit amet
                bibendum eros. Cras fringilla nisi libero, a commodo lectus
                auctor eget. Sed gravida urna risus, tristique tempor lectus
                lobortis sed. Etiam at ullamcorper felis. Cras consequat ex eget
                consectetur varius. Aenean id venenatis ipsum, ut facilisis
                nulla. Curabitur molestie luctus sapien, sed ornare eros
                pellentesque rhoncus. Vestibulum sed diam nisi. Donec ut enim
                elit.
              </p>
              <p>
                Aenean eget lobortis lectus. Nam congue mauris turpis, non
                dignissim velit fringilla sed. Nullam diam enim, porta fermentum
                velit vel, venenatis dictum augue. Vestibulum ante ipsum primis
                in faucibus orci luctus et ultrices posuere cubilia curae; In
                rhoncus pulvinar interdum. Curabitur suscipit feugiat magna, sed
                elementum leo. Proin dapibus metus ac nunc congue convallis a in
                quam. Aliquam et mauris felis. Vivamus sapien augue, vehicula
                quis porttitor suscipit, molestie ut nunc. Duis eu sem ut quam
                imperdiet pretium. Duis fringilla erat quis risus pretium, at
                condimentum dui congue. Aliquam bibendum placerat convallis.
                Integer tristique mauris elit, nec tristique elit maximus eget.
                Fusce in diam in nibh malesuada interdum eget in leo.
              </p>
              <p>
                Nam ac tellus quis nibh imperdiet lobortis. Class aptent taciti
                sociosqu ad litora torquent per conubia nostra, per inceptos
                himenaeos. Nullam finibus convallis convallis. Proin dapibus est
                eros, sed iaculis lorem molestie a. Mauris quis posuere lectus,
                in porttitor turpis. Praesent euismod viverra enim, at suscipit
                lectus ornare nec. Mauris magna tellus, auctor eget nisl sit
                amet, venenatis interdum felis. Maecenas ante velit, tristique
                eget tincidunt vel, facilisis non tellus. Vestibulum in dolor
                nulla. Nam luctus ipsum vitae nisi egestas, imperdiet finibus
                tellus dapibus. Quisque tempus lacinia ultrices.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-dark"
                data-bs-dismiss="modal"
              >
                Accetto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
