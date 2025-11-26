// import * as ValidationPattern from "../../utilities/validationPatterns/index";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import { AddNewCarModel, SingleCarModelInfo } from "../../TSModels/Admin";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  AllCarModels,
  CreateCarModel,
  DeleteCarModel,
  UpdateCarModel,
} from "../../redux/thunks/admin";

import { useEffect } from "react";
import { decryptData, hideBootstrapModal } from "../../utilities/utils";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  carModelActions,
  SelectIsCreateLoading,
  SelectIsCreateSuccess,
  SelectIsDeleteLoading,
  SelectIsDeleteSuccess,
} from "../../redux/reducers/carModelSlice";
interface IProps {
  isEdit: boolean;
  info: SingleCarModelInfo | undefined;
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  errors: FieldErrors<any>;
  reset: UseFormReset<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}
const CarModelForm = ({
  isEdit,
  info,
  register,
  handleSubmit,
  errors,
  reset,
  setValue,
  watch,
}: IProps) => {
  const dispatch = useAppDispatch();
  const isSuccess = useAppSelector(SelectIsCreateSuccess);
  const isLoading = useAppSelector(SelectIsCreateLoading);
  const isSuccessDelete = useAppSelector(SelectIsDeleteSuccess);
  const isLoadingDelete = useAppSelector(SelectIsDeleteLoading);

  const user = decryptData("nccUser");
  const onSubmit = (data: AddNewCarModel) => {
    // Trim all string fields to remove leading/trailing spaces
    const trimmedData = {
      ...data,
      targa: data.targa?.trim(),
      module: data.module?.trim(),
      licenseNumber: data.licenseNumber?.trim(),
    };
    
    if (!isEdit) {
      const payload = {
        ...trimmedData,
      };
      dispatch(CreateCarModel(payload));
    } else {
      const payload = {
        ...trimmedData,
        carModelId: info?._id,
      };
      dispatch(UpdateCarModel(payload));
    }
  };
  const deleteCarModel = () => {
    if (info) {
      dispatch(DeleteCarModel({ carModelId: info._id }));
    }
  };
  useEffect(() => {
    if (isSuccess) {
      reset();
      hideBootstrapModal("addCarModel");
      dispatch(carModelActions.resetCreateState());
      dispatch(AllCarModels());
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessDelete) {
      reset();
      hideBootstrapModal("deleteCarModel");
      dispatch(carModelActions.resetDeleteState());
      dispatch(AllCarModels());
    }
  }, [isSuccessDelete]);

  useEffect(() => {
    if (isEdit && info) {
      setValue("carType", info.carType);
      setValue("module", info.module);
      setValue("targa", info.targa);
      setValue("cityOfService", info.cityOfService);
      setValue("licenseNumber", info.licenseNumber);
    }
  }, [isEdit, info]);

  return (
    <>
      <div
        className="modal fade"
        id="addCarModel"
        data-bs-keyboard="false"
        aria-labelledby="addCarModel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="addCarModel">
                  Gestione auto
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => reset()}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form_container form_in_modal">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <h5>Dati profilo</h5>
                      <p>Compila i dati inerenti all'auto e al conducente</p>
                      <hr />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 col-md-4 mb-5">
                      <input
                        className="select_product_type"
                        id="berlina"
                        type="radio"
                        value={4}
                        hidden
                        {...register("carType", {
                          required: "Seleziona un tipo di veicolo",
                        })}
                        checked={watch("carType") == 4 ? true : false}
                        onChange={() => {
                          setValue("carType", 4, { shouldValidate: true });
                        }}
                      />
                      <label htmlFor="berlina" className="single_check">
                        <span className="container_image_icon">
                          <img src="static/img/icons/car.svg" />
                        </span>
                        <span className="type_of_car">Berlina</span>
                      </label>
                    </div>
                    <div className="col-12 col-md-4 mb-5">
                      <input
                        className="select_product_type"
                        id="van"
                        type="radio"
                        value={6}
                        hidden
                        checked={watch("carType") == 6 ? true : false}
                        {...register("carType", {
                          required: "Seleziona un tipo di veicolo",
                        })}
                        onChange={() => {
                          setValue("carType", 6, { shouldValidate: true });
                        }}
                      />
                      <label htmlFor="van" className="single_check">
                        <span className="container_image_icon">
                          <img src="static/img/icons/van.svg" />
                        </span>
                        <span className="type_of_car">Van</span>
                      </label>
                    </div>
                    <div className="col-12 col-md-4 mb-5">
                      <input
                        className="select_product_type"
                        id="lusso"
                        type="radio"
                        value={8}
                        hidden
                        checked={watch("carType") == 8 ? true : false}
                        {...register("carType", {
                          required: "Seleziona un tipo di veicolo",
                        })}
                        onChange={() => {
                          setValue("carType", 8, { shouldValidate: true });
                        }}
                      />
                      <label htmlFor="lusso" className="single_check">
                        <span className="container_image_icon">
                          <img src="static/img/icons/car.svg" />
                        </span>
                        <span className="type_of_car">Lusso</span>
                      </label>
                    </div>
                  </div>
                  {errors?.carType && (
                    <div className="row">
                      <div className="col-12">
                        <p className="mt-1 text-danger mb-3">
                          {errors.carType.message?.toString() || ValidationMessage.required}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label htmlFor="carlicenseplate" className="form-label">
                          Targa <span className="mandatory">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="carlicenseplate"
                          {...register("targa", {
                            required: ValidationMessage.required,
                            validate: (value) => {
                              const trimmed = value?.trim();
                              if (!trimmed) {
                                return ValidationMessage.required;
                              }
                              if (value !== trimmed) {
                                return "Il campo non può iniziare o terminare con spazi";
                              }
                              return true;
                            },
                          })}
                        />
                        {errors?.targa && (
                          <p className="mt-1 text-danger">
                            {errors.targa.message?.toString() || ValidationMessage.required}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="former_row">
                        <label htmlFor="carmodel" className="form-label">
                          Modello <span className="mandatory">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="carmodel"
                          {...register("module", {
                            required: ValidationMessage.required,
                            validate: (value) => {
                              const trimmed = value?.trim();
                              if (!trimmed) {
                                return ValidationMessage.required;
                              }
                              if (value !== trimmed) {
                                return "Il campo non può iniziare o terminare con spazi";
                              }
                              return true;
                            },
                          })}
                        />
                        {errors?.module && (
                          <p className="mt-1 text-danger">
                            {errors.module.message?.toString() || ValidationMessage.required}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="former_row">
                        <label htmlFor="address" className="form-label">
                          Città del servizio{" "}
                          <span className="mandatory">*</span>
                        </label>
                        <select
                          className="form-select"
                          {...register("cityOfService", {
                            required: true,
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

                  <div className="row">
                    <div className="col-12">
                      <div className="former_row">
                        <label htmlFor="numberlicence" className="form-label">
                          Numero licenza <span className="mandatory">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="numberlicence"
                          {...register("licenseNumber", {
                            required: ValidationMessage.required,
                            validate: (value) => {
                              const trimmed = value?.trim();
                              if (!trimmed) {
                                return ValidationMessage.required;
                              }
                              if (value !== trimmed) {
                                return "Il campo non può iniziare o terminare con spazi";
                              }
                              return true;
                            },
                          })}
                        />
                        {errors?.licenseNumber && (
                          <p className="mt-1 text-danger">
                            {errors.licenseNumber.message?.toString() || ValidationMessage.required}
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
                    data-bs-target="#deleteCarModel"
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
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="deleteCarModel"
        data-bs-keyboard="false"
        aria-labelledby="deleteCarModel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteCarModel">
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
                disabled={isLoadingDelete}
                onClick={() => deleteCarModel()}
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
export default CarModelForm;
