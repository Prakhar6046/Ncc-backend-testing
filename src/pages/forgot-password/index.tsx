import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as ValidationPattern from "../../utilities/validationPatterns/index";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import { useAppDispatch } from "../../redux/hooks";
import { handleForgotPassword } from "../../redux/thunks/auth";
const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ email: string }>();
  const onSubmit = (data: { email: string }) => {
    dispatch(handleForgotPassword(data));
  };
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-4">
          <div className="message_container">
            <p>Inserisci la tua e-mail per generare una nuova password</p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-4">
          <form onSubmit={handleSubmit(onSubmit)}>
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
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="former_row">
                    <Link to="/sign-in" className="linker">
                      Torna al login
                    </Link>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button className="btn btn-dark" type="submit">
                      Reset password
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

export default ForgotPassword;
