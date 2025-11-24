import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HotelData } from "../../TSModels/Hotel";

interface HotelFormProps {
  hotel: HotelData | null;
}

const HotelForm: React.FC<HotelFormProps> = ({ hotel }) => {
  const { register, setValue } = useForm<HotelData>();

  useEffect(() => {
    if (hotel) {
      setValue("name", hotel.name);
      setValue("surname", hotel.surname);
      setValue("email", hotel.email);
      setValue("companyName", hotel.companyName);
      setValue("piva", hotel.piva);
      setValue("address", hotel.address);
      setValue("pec", hotel.pec);
      setValue("sdi", hotel.sdi);
    }
  }, [hotel, setValue]);

  return (
    <div
      className="modal fade"
      id="viewUser"
      data-bs-keyboard="false"
      aria-labelledby="viewUser"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Visualizza utente</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form>
            <div className="modal-body">
              <div className="form_container form_in_modal">
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
                        Nome
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        {...register("name")}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="surname" className="form-label">
                        Cognome
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="surname"
                        {...register("surname")}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="former_row">
                      <label htmlFor="email" className="form-label">
                        E-mail
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        {...register("email")}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form_container form_in_modal">
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
                      <label htmlFor="companyName" className="form-label">
                        Ragione sociale
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        {...register("companyName")}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="piva" className="form-label">
                        P.iva
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="piva"
                        {...register("piva")}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="former_row">
                      <label htmlFor="address" className="form-label">
                        Indirizzo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        {...register("address")}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="pec" className="form-label">
                        PEC
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="pec"
                        {...register("pec")}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="former_row">
                      <label htmlFor="sdi" className="form-label">
                        SDI
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="sdi"
                        {...register("sdi")}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-dark"
              data-bs-dismiss="modal"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelForm;
