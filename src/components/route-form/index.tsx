import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
// import * as ValidationPattern from "../../utilities/validationPatterns/index";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  AddNewCityRoute,
  DeleteCityRoute,
  UpdateCityRoute,
} from "../../redux/thunks/admin";
import {
  adminActions,
  selectIsUpdatedLoader,
  selectSuccess,
} from "../../redux/reducers/adminSlice";
import { useEffect } from "react";
import { hideBootstrapModal } from "../../utilities/utils";
import { SingleCityRoute } from "../../TSModels/Admin";
interface Iprops {
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
  route: SingleCityRoute | undefined;
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  errors: FieldErrors<any>;
  reset: UseFormReset<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}
const RouteForm = ({
  isEdit,
  setIsEdit,
  route,
  register,
  handleSubmit,
  errors,
  reset,
  setValue,
  watch,
}: Iprops) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsUpdatedLoader);
  const isSuccess = useAppSelector(selectSuccess);
  const onSubmit = (data: any) => {
    const totalPrice = 
      Number(watch("driverCost") || 0) + 
      Number(watch("adminCost") || 0) + 
      Number(watch("cooperativeCost") || 0) + 
      Number(watch("ditteCost") || 0);
    
    if (!isEdit) {
      const payload = {
        ...data,
        totalPrice,
      };
      dispatch(AddNewCityRoute(payload));
    } else {
      const payload = {
        ...data,
        cityRouteId: route?._id,
        totalPrice,
      };
      dispatch(UpdateCityRoute(payload));
    }
  };
  const DeleteRoute = () => {
    dispatch(DeleteCityRoute({ cityRouteId: route?._id }));
  };
  useEffect(() => {
    if (isSuccess) {
      reset();
      hideBootstrapModal("addProduct");
      hideBootstrapModal("deleteCityRoute");
      dispatch(adminActions.resetState());
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isEdit && route) {
      setValue("from", route.from);
      setValue("to", route.to);
      setValue("averageTravelTime", route.averageTravelTime);
      setValue("driverCost", route.driverCost);
      setValue("adminCost", route.adminCost || (route as any).profit || 0);
      setValue("cooperativeCost", route.cooperativeCost || 0);
      setValue("ditteCost", route.ditteCost || 0);
    }
  }, [isEdit, route, setValue]);
  return (
    <>
      <div
        className="modal fade"
        id="addProduct"
        data-bs-keyboard="false"
        aria-labelledby="addProduct"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="addProduct">
                  Aggiungi tratta
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                 onClick={() => {
                      reset();
                      setIsEdit(false);
                    }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form_container form_in_modal">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <h5>Crea una tratta</h5>
                      <p>
                        Compila i campi per creare una tratta da proporre ai
                        tuoi clienti
                      </p>
                      <hr />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label htmlFor="from" className="form-label">
                          Da <span className="mandatory">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="from"
                          {...register("from", {
                            required: true,
                            validate: (value) =>
                              value.trim() !== "" || ValidationMessage.required,
                          })}
                        />
                        {errors?.from?.type == "required" && (
                          <p className="mt-1 text-danger">
                            {ValidationMessage.required}
                          </p>
                        )}
                        {typeof errors?.from?.message === "string" && (
                          <p className="mt-1 text-danger">
                            {errors.from.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label htmlFor="to" className="form-label">
                          A <span className="mandatory">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="to"
                          {...register("to", {
                            required: true,
                            validate: (value) =>
                              value.trim() !== "" || ValidationMessage.required,
                          })}
                        />
                        {errors?.to?.type == "required" && (
                          <p className="mt-1 text-danger">
                            {ValidationMessage.required}
                          </p>
                        )}
                        {typeof errors?.to?.message === "string" && (
                          <p className="mt-1 text-danger">
                            {errors.to.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-12">
                      <div className="former_row">
                        <label htmlFor="time" className="form-label">
                          Tempo medio percorreza (ore)
                          <span className="mandatory">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="time"
                          step="any"
                          {...register("averageTravelTime", {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                        {errors?.averageTravelTime?.type == "required" && (
                          <p className="mt-1 text-danger">
                            {ValidationMessage.required}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <h5>Prezzo</h5>
                      <p>
                        Inserisci il prezzo per il driver, il costo admin, il costo cooperative e il costo ditte individuali,
                        la struttura pagherà la somma di tutte le cifre
                      </p>
                      <hr />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label htmlFor="driveramount" className="form-label">
                          Costo driver <span className="mandatory">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">€</span>
                          <input
                            id="driveramount"
                            type="number"
                            className="form-control"
                            step="any"
                            {...register("driverCost", {
                              required: true,
                              valueAsNumber: true,
                              min: {
                                value: 0,
                                message: "Il costo driver deve essere positivo",
                              },
                              validate: (value) => {
                                const total =
                                  Number(value) + 
                                  Number(watch("adminCost") || 0) + 
                                  Number(watch("cooperativeCost") || 0) + 
                                  Number(watch("ditteCost") || 0);
                                return (
                                  total <= 25000 ||
                                  "Il prezzo totale non può superare €25.000, limite massimo Stripe"
                                );
                              },
                            })}
                          />
                        </div>
                        {errors?.driverCost?.type == "required" && (
                          <p className="mt-1 text-danger">
                            {ValidationMessage.required}
                          </p>
                        )}
                        {errors?.driverCost && (
                          <p className="mt-1 text-danger">
                            {errors.driverCost.message?.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label htmlFor="adminamount" className="form-label">
                          Costo admin <span className="mandatory">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">€</span>
                          <input
                            id="adminamount"
                            type="number"
                            className="form-control"
                            step="any"
                            {...register("adminCost", {
                              required: true,
                              valueAsNumber: true,
                              min: {
                                value: 0,
                                message: "Il costo admin deve essere positivo",
                              },
                              validate: (value) => {
                                const total =
                                  Number(watch("driverCost") || 0) + 
                                  Number(value) + 
                                  Number(watch("cooperativeCost") || 0) + 
                                  Number(watch("ditteCost") || 0);
                                return (
                                  total <= 25000 ||
                                  "Il prezzo totale non può superare €25.000, limite massimo Stripe"
                                );
                              },
                            })}
                          />
                        </div>
                        {errors?.adminCost?.type == "required" && (
                          <p className="mt-1 text-danger">
                            {ValidationMessage.required}
                          </p>
                        )}

                        {errors?.adminCost && (
                          <p className="mt-1 text-danger">
                            {errors.adminCost.message?.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label htmlFor="cooperativeamount" className="form-label">
                          Costo cooperative <span className="mandatory">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">€</span>
                          <input
                            id="cooperativeamount"
                            type="number"
                            className="form-control"
                            step="any"
                            {...register("cooperativeCost", {
                              required: true,
                              valueAsNumber: true,
                              min: {
                                value: 0,
                                message: "Il costo cooperative deve essere positivo",
                              },
                              validate: (value) => {
                                const total =
                                  Number(watch("driverCost") || 0) + 
                                  Number(watch("adminCost") || 0) + 
                                  Number(value) + 
                                  Number(watch("ditteCost") || 0);
                                return (
                                  total <= 25000 ||
                                  "Il prezzo totale non può superare €25.000, limite massimo Stripe"
                                );
                              },
                            })}
                          />
                        </div>
                        {errors?.cooperativeCost?.type == "required" && (
                          <p className="mt-1 text-danger">
                            {ValidationMessage.required}
                          </p>
                        )}
                        {errors?.cooperativeCost && (
                          <p className="mt-1 text-danger">
                            {errors.cooperativeCost.message?.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label htmlFor="ditteamount" className="form-label">
                          Costo ditte individuali <span className="mandatory">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">€</span>
                          <input
                            id="ditteamount"
                            type="number"
                            className="form-control"
                            step="any"
                            {...register("ditteCost", {
                              required: true,
                              valueAsNumber: true,
                              min: {
                                value: 0,
                                message: "Il costo ditte deve essere positivo",
                              },
                              validate: (value) => {
                                const total =
                                  Number(watch("driverCost") || 0) + 
                                  Number(watch("adminCost") || 0) + 
                                  Number(watch("cooperativeCost") || 0) + 
                                  Number(value);
                                return (
                                  total <= 25000 ||
                                  "Il prezzo totale non può superare €25.000, limite massimo Stripe"
                                );
                              },
                            })}
                          />
                        </div>
                        {errors?.ditteCost?.type == "required" && (
                          <p className="mt-1 text-danger">
                            {ValidationMessage.required}
                          </p>
                        )}
                        {errors?.ditteCost && (
                          <p className="mt-1 text-danger">
                            {errors.ditteCost.message?.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <h5>
                  Prezzo totale:{" "}
                  {`${
                    (Number(watch("driverCost") || 0) + 
                     Number(watch("adminCost") || 0) + 
                     Number(watch("cooperativeCost") || 0) + 
                     Number(watch("ditteCost") || 0)).toFixed(2)
                  }`}
                   €
                </h5>
              </div>
              <div className="modal-footer">
                {isEdit && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteCityRoute"
                    disabled={isLoading}
                  >
                    Elimina
                  </button>
                )}

                <button
                  type="submit"
                  className="btn btn-dark"
                  // data-bs-dismiss="modal"
                  disabled={isLoading}
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
        id="deleteCityRoute"
        data-bs-keyboard="false"
        aria-labelledby="deleteCityRoute"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="viewCityRoute">
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
                    <h5>Elimina questo percorso</h5>
                    <p>
                      L'operazione è irreversibile. Dopo aver eliminato il
                      percorso cittadino, le informazioni relative a questo
                      percorso andranno perse per sempre.
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
                onClick={() => DeleteRoute()}
                disabled={isLoading}
              >
                Elimina percorso
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default RouteForm;
