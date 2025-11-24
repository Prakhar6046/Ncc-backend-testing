import { Link } from "react-router-dom";
import Header from "../../components/header";

const Login = () => {
    return(

        <div>
            
            <Header />


            <div className="container">

                <div className="row justify-content-center">
                    <div className="col-12 col-md-4">
                        <div className="message_container">
                            <p>Effettua l'accesso in piattaforma</p>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12 col-md-4">
                        <div className="form_container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="former_row">
                                        <label htmlFor="mail" className="form-label">E-mail <span className="mandatory">*</span></label>
                                        <input type="email" className="form-control" id="mail" />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="former_row">
                                        <label htmlFor="password" className="form-label">Password <span className="mandatory">*</span></label>
                                        <input type="password" className="form-control" id="password" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="former_row">
                                        <Link to="/forgot-password" className="linker">Password dimenticata?</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button className="btn btn-dark">Effettua l'accesso</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12 col-md-4">
                        <div className="form_container form_container_hilight text_center">
                            <p>Non hai ancora un account?</p>
                            <div className="row">
                                <div className="col-12">
                                    <div className="d-grid">
                                        <Link to="/sign-up" className="btn btn-outline-light">Crea un nuovo account</Link>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
};

export default Login;