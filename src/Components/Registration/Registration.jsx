import React, { useEffect, useState } from 'react';
import './registration.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { useAuth } from '../../AuthProvider';
import { API_BASE_URL } from '../url';

const defaultState = {
    email: '',
    park_name: '',
    password: '',
    confirmPassword: '',
    emailError: null,
    park_nameError: null,
    passwordError: null,
    confirmPasswordError: null,
};

function Registration() {
    const navigate = useNavigate();
    const [state, setState] = useState({ ...defaultState });
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [verify, setVerify] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState({ ...state, [name]: value });
        setPasswordError(false);
        setConfirmPasswordError(false);
        setEmailError(false);
        setNameError(false)
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const submit = () => {
        if (!validateEmail(state.email)) {
            setEmailError(true);
            return;
        }

        if (state.password !== state.confirmPassword) {
            setConfirmPasswordError(true);
            return;
        }

        fetch(`${API_BASE_URL}api/parks/signUp`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
            },
            body: JSON.stringify({
                email: state.email,
                park_name: state.park_name,
                password: bcrypt.hashSync(state.password, 10),
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.detail === "email error") {
                    setEmailError(true);
                } else if (data.detail === "name error") {
                    setNameError(true);
                }
                setVerify(true)
            })
            .catch(error => console.error("Error fetching data:", error));
    };

    return (
        <div className="App">
            <div className="container-fluid ps-md-0">
                <div className="row g-0">
                    <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
                    <div className="col-md-8 col-lg-6">
                        <div className="login d-flex align-items-center py-5">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-9 col-lg-8 mx-auto">

                                        {verify ?
                                            <>
                                                <div className='verify_text'>Vám na e-mail přišel potvrzovací e-mail. Otevřete ho, potvrďte svůj e-mail a můžete se přihlásit do svého účtu s vaším uživatelským jménem a heslem.</div>
                                                <button onClick={() => navigate("/login")} className='to_login'>Zpět k přihlášení</button>
                                            </>
                                            :
                                            <>

                                                <h3 className="login-heading mb-4">Vytvořit účet</h3>
                                                <form>
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="email"
                                                            className={`form-control ${emailError ? 'invalid' : ''}`}
                                                            id="floatingEmail"
                                                            name="email"
                                                            placeholder="Vaše email"
                                                            onChange={handleInputChange}
                                                        />
                                                        <label htmlFor="floatingEmail">Vaše email</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            className={`form-control ${nameError ? 'invalid' : ''}`}
                                                            id="floatingParkName"
                                                            name="park_name"
                                                            placeholder="Název parku"
                                                            onChange={handleInputChange}
                                                        />
                                                        <label htmlFor="floatingParkName">Název parku</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="password"
                                                            className={`form-control ${passwordError ? 'invalid' : ''}`}
                                                            id="floatingPassword"
                                                            name="password"
                                                            placeholder="Heslo"
                                                            value={state.password}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label htmlFor="floatingPassword">Heslo</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input
                                                            type="password"
                                                            className={`form-control ${confirmPasswordError ? 'invalid' : ''}`}
                                                            id="floatingConfirmPassword"
                                                            name="confirmPassword"
                                                            placeholder="Potvrdit heslo"
                                                            value={state.confirmPassword}
                                                            onChange={handleInputChange}
                                                        />
                                                        <label htmlFor="floatingConfirmPassword">Potvrdit heslo</label>
                                                    </div>

                                                    <div className="d-grid">
                                                        <button
                                                            className="btn btn-lg appoinment_button btn-login text-uppercase fw-bold mb-2"
                                                            type="button"
                                                            onClick={submit}
                                                        >
                                                            Přihlásit se
                                                        </button>
                                                    </div>
                                                </form>
                                                <div>Již máte účet <span className='link' onClick={() => navigate('/login')}>Přihlásit se</span> </div>
                                            </>

                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registration;
