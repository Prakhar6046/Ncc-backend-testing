import { useEffect, useState } from "react";
import DynamicMenu from "../../components/dynamic-menu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Loader from "../../components/Loader";
import { useForm, useFieldArray } from "react-hook-form";
import * as ValidationMessage from "../../utilities/validationsMessage/index";
import { AdminSettingsForm, MileageBand } from "../../TSModels/Admin";
import { getAdminSettings, saveAdminSettings } from "../../redux/thunks/admin";
import {
  SelectAdminSettings,
  SelectIsLoading,
} from "../../redux/reducers/adminSlice";

const AdminSetting = () => {
  const dispatch = useAppDispatch();
  const isAdminLoading = useAppSelector(SelectIsLoading);
  const adminSettings = useAppSelector(SelectAdminSettings);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 1; 
  
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<AdminSettingsForm>({ mode: "onChange" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mileageBands",
  });

  // Calculate pagination
  const totalPages = Math.ceil(fields.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFields = fields.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onSubmit = (data: AdminSettingsForm) => {
    dispatch(saveAdminSettings(data));
  };

  // Initialize with one band if no settings exist
  useEffect(() => {
    if (adminSettings && adminSettings.mileageBands && adminSettings.mileageBands.length > 0) {
      reset({
        mileageBands: adminSettings.mileageBands,
      });
    } else {
      // Initialize with one empty band
      const defaultBand: MileageBand = {
        kmMin: 0,
        kmMax: 4,
        vehicleTypes: {
          berlina: {
            admin: { fixedCost: 0, costPerKm: 0 },
            cooperative: { fixedCost: 0, costPerKm: 0 },
            driver: { fixedCost: 0, costPerKm: 0 },
            ditta_individuale: { fixedCost: 0, costPerKm: 0 },
          },
          van: {
            admin: { fixedCost: 0, costPerKm: 0 },
            cooperative: { fixedCost: 0, costPerKm: 0 },
            driver: { fixedCost: 0, costPerKm: 0 },
            ditta_individuale: { fixedCost: 0, costPerKm: 0 },
          },
          lusso: {
            admin: { fixedCost: 0, costPerKm: 0 },
            cooperative: { fixedCost: 0, costPerKm: 0 },
            driver: { fixedCost: 0, costPerKm: 0 },
            ditta_individuale: { fixedCost: 0, costPerKm: 0 },
          },
        },
      };
      reset({
        mileageBands: [defaultBand],
      });
    }
  }, [adminSettings, reset]);

  useEffect(() => {
    dispatch(getAdminSettings());
  }, [dispatch]);

  const addMileageBand = () => {
    // Calculate next band range based on existing bands
    let nextKmMin = 0;
    if (fields.length > 0) {
      // Get the last band's kmMax as the new kmMin
      const formValues = control._formValues as any;
      if (formValues?.mileageBands && formValues.mileageBands.length > 0) {
        const lastBandData = formValues.mileageBands[formValues.mileageBands.length - 1];
        nextKmMin = lastBandData?.kmMax || 0;
      }
    }
    
    const defaultBand: MileageBand = {
      kmMin: nextKmMin,
      kmMax: nextKmMin + 20, 
      vehicleTypes: {
        berlina: {
          admin: { fixedCost: 0, costPerKm: 0 },
          cooperative: { fixedCost: 0, costPerKm: 0 },
          driver: { fixedCost: 0, costPerKm: 0 },
          ditta_individuale: { fixedCost: 0, costPerKm: 0 },
        },
        van: {
          admin: { fixedCost: 0, costPerKm: 0 },
          cooperative: { fixedCost: 0, costPerKm: 0 },
          driver: { fixedCost: 0, costPerKm: 0 },
          ditta_individuale: { fixedCost: 0, costPerKm: 0 },
        },
        lusso: {
          admin: { fixedCost: 0, costPerKm: 0 },
          cooperative: { fixedCost: 0, costPerKm: 0 },
          driver: { fixedCost: 0, costPerKm: 0 },
          ditta_individuale: { fixedCost: 0, costPerKm: 0 },
        },
      },
    };
    append(defaultBand);
    // Navigate to the last page where the new band will be
    const newTotalPages = Math.ceil((fields.length + 1) / itemsPerPage);
    setCurrentPage(newTotalPages);
  };

  const vehicleTypes = [
    { key: "berlina", label: "Berlin" },
    { key: "van", label: "By" },
    { key: "lusso", label: "Luxury" },
  ];

  const roles = [
    { key: "admin", label: "Admin" },
    { key: "cooperative", label: "Cooperative" },
    { key: "driver", label: "Driver" },
    { key: "ditta_individuale", label: "Ditta individuale" },
  ];

  if (isAdminLoading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <DynamicMenu />
        <div className="col-12 col-md-9">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form_container">
              <div className="row">
                <div className="col-12 mb-3">
                  <h5>Impostazioni tratte</h5>
                  <p>
                    Definisci le fasce chilometriche e imposta i costi fissi e per
                    chilometro per Admin, Cooperativa e Driver per ogni tipo di veicolo.
                  </p>
                  <hr />
                </div>
              </div>

              {/* Results Counter */}
              <div className="header_add_remove mb-3">
                <div className="label_counter">
                  {fields.length ? fields.length : 0} {fields.length === 1 ? "fascia" : "fasce"} chilometriche
                </div>
              </div>

              {paginatedFields.map((field, paginatedIndex) => {
                const bandIndex = startIndex + paginatedIndex;
                return (
                <div key={field.id} className="mb-5">
                  <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Mileage band {bandIndex + 1}</h6>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            remove(bandIndex);
                            // Adjust page if we removed the last item on current page
                            const newTotalPages = Math.ceil((fields.length - 1) / itemsPerPage);
                            if (currentPage > newTotalPages && newTotalPages > 0) {
                              setCurrentPage(newTotalPages);
                            }
                          }}
                        >
                          Rimuovi
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label">
                        Km Min (eg: 0){" "}
                        <span className="mandatory">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        step="any"
                        {...register(`mileageBands.${bandIndex}.kmMin`, {
                          required: true,
                          valueAsNumber: true,
                          min: 0,
                        })}
                      />
                      {errors?.mileageBands?.[bandIndex]?.kmMin && (
                        <p className="mt-1 text-danger">
                          {ValidationMessage.required}
                        </p>
                      )}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">
                        Km Max (eg: 4){" "}
                        <span className="mandatory">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        step="any"
                        {...register(`mileageBands.${bandIndex}.kmMax`, {
                          required: true,
                          valueAsNumber: true,
                          min: 0,
                        })}
                      />
                      {errors?.mileageBands?.[bandIndex]?.kmMax && (
                        <p className="mt-1 text-danger">
                          {ValidationMessage.required}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-12">
                      <p className="text-muted small">
                        Range: {watch(`mileageBands.${bandIndex}.kmMin` as any) || 0} - {watch(`mileageBands.${bandIndex}.kmMax` as any) || 0} km
                      </p>
                    </div>
                  </div>

                  {vehicleTypes.map((vehicleType) => (
                    <div key={vehicleType.key} className="mb-4 p-3 bg-light rounded">
                      <h6 className="mb-3">{vehicleType.label}</h6>
                      <div className="row">
                        {/* Left Column - Fixed Cost */}
                        <div className="col-12 col-md-6 mb-3">
                          {roles.map((role) => (
                            <div key={role.key} className="mb-3">
                              <label className="form-label">
                                {role.label} - Fixed cost (€){" "}
                                <span className="mandatory">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                step="any"
                                {...register(
                                  `mileageBands.${bandIndex}.vehicleTypes.${vehicleType.key}.${role.key}.fixedCost` as any,
                                  {
                                    required: true,
                                    valueAsNumber: true,
                                  }
                                )}
                              />
                              {errors?.mileageBands?.[bandIndex]?.vehicleTypes &&
                                (errors.mileageBands[bandIndex].vehicleTypes as any)?.[
                                  vehicleType.key
                                ]?.[role.key]?.fixedCost && (
                                  <p className="mt-1 text-danger small">
                                    {ValidationMessage.required}
                                  </p>
                                )}
                            </div>
                          ))}
                        </div>

                        {/* Right Column - Cost per km */}
                        <div className="col-12 col-md-6 mb-3">
                          {roles.map((role) => (
                            <div key={role.key} className="mb-3">
                              <label className="form-label">
                                {role.label} - Cost per km (€){" "}
                                <span className="mandatory">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                step="any"
                                {...register(
                                  `mileageBands.${bandIndex}.vehicleTypes.${vehicleType.key}.${role.key}.costPerKm` as any,
                                  {
                                    required: true,
                                    valueAsNumber: true,
                                  }
                                )}
                              />
                              {errors?.mileageBands?.[bandIndex]?.vehicleTypes &&
                                (errors.mileageBands[bandIndex].vehicleTypes as any)?.[
                                  vehicleType.key
                                ]?.[role.key]?.costPerKm && (
                                  <p className="mt-1 text-danger small">
                                    {ValidationMessage.required}
                                  </p>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )})}

            {/* Pagination Controls */}
            {fields.length > itemsPerPage && (
              <div className="d-flex justify-content-center">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={addMileageBand}
                    >
                      + Add mileage band
                    </button>
                    <button className="btn btn-dark" type="submit">
                      Save changes
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

export default AdminSetting;
