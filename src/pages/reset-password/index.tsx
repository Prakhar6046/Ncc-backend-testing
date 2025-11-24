import { useForm } from "react-hook-form";
import * as ValidationPattern from "../../utilities/validationPatterns/index";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { handleResetPassword } from "../../redux/thunks/auth";
import { authActions, selectSuccess } from "../../redux/reducers/authSlice";
import { useEffect, useState } from "react";
const ResetPassword = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const isSuccess = useAppSelector(selectSuccess);
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<{ password: string; confirmPassword: string }>();
  const onSubmit = (data: { password: string; confirmPassword: string }) => {
    const payload = {
      password: data.password,
      userId: params?.userId,
      token: params?.resetToken,
    };
    dispatch(handleResetPassword(payload));
  };
  useEffect(() => {
    dispatch(authActions.resetAuthStates());
  }, []);
  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
    }
  }, [isSuccess]);
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-4">
          <div className="message_container">
            <p>Scegli una nuova password</p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form_container">
              <div className="row">
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
                        pattern: ValidationPattern.passwordPattern,
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
                        <img src="/static/img/icons/ic-eye-open.svg" />
                      ) : (
                        <img src="/static/img/icons/ic-eye-closed.svg" />
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
                <div className="col-12">
                  <div className="former_row position-relative">
                    <label htmlFor="repassword" className="form-label">
                      Ripeti Password <span className="mandatory">*</span>
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="reppassword"
                      {...register("confirmPassword", {
                        required: true,
                        validate: (value) =>
                          value === getValues().password?.toString() ||
                          "Confirm Password do not match with password!",
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
                        <img src="/static/img/icons/ic-eye-open.svg" />
                      ) : (
                        <img src="/static/img/icons/ic-eye-closed.svg" />
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

              <div className="row">
                <div className="col-12">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button className="btn btn-dark" type="submit">
                      Salva nuova password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
