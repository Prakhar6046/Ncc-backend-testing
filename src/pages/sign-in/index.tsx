import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  authActions,
  selectIsLoading,
  selectSuccess,
} from "../../redux/reducers/authSlice";
import { LoginForm } from "../../TSModels/Auth";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import * as ValidationPattern from "../../utilities/validationPatterns/index";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import { handleCompanyLogin } from "../../redux/thunks/auth";
import { decryptData } from "../../utilities/utils";

const SignIn = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const isSuccess = useAppSelector(selectSuccess);
  const [showPassword, setShowPassword] = useState(false);
  // const user = decryptData("nccUser");
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<LoginForm>();
  const onSubmit = (data: LoginForm) => {
    dispatch(handleCompanyLogin(data));
  };
  useEffect(() => {
    dispatch(authActions.resetAuthStates());
  }, []);
  // useEffect(() => {
  //   if (isSuccess && user) {
  //     reset();
  //     navigate("/");
  //   }
  // }, [isSuccess, user]);
  useEffect(() => {
    if (isSuccess) {
      const loggedInUser = decryptData("nccUser");
      reset();

      if (loggedInUser?.superAdmin === true) {
        navigate("/");
      } else if (loggedInUser?.superAdmin === false) {
        navigate("/");
      } else {
        navigate("/hotel-shop");
      }
    }
  }, [isSuccess, reset, navigate]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-4">
          <div className="message_container">
            <p>Effettua l'accesso in piattaforma</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-4">
            <div className="form_container">
              <div className="row">
                <div className="col-12">
                  <div className="former_row">
                    <label htmlFor="mail" className="form-label">
                      E-mail <span className="mandatory">*</span>
                    </label>
                    <input
                      type="email"
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
                <div className="col-12">
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
                      })}
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
                    {errors?.password?.type == "required" && (
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
                    <Link to="/forgot-password" className="linker">
                      Password dimenticata?
                    </Link>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button className="btn btn-dark" type="submit">
                      Effettua l'accesso
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="row justify-content-center">
        <div className="col-12 col-md-4">
          <div className="form_container form_container_hilight text_center">
            <p>Non hai ancora un account?</p>
            <div className="row">
              <div className="col-12">
                <div className="d-grid">
                  <Link to="/sign-up" className="btn btn-outline-light">
                    Crea un nuovo account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
