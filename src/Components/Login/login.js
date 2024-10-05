import React, { useEffect, useState } from 'react';
import './login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { json, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useAuth } from '../../AuthProvider';
import { API_BASE_URL } from '../url';
import { Login } from '../../http';
const defaultState = {
  name: null,
  identifier: null, 
  password: null,
  nameError: null,
  identifierError: null,
  passwordError: null,
};

function CustomFormValidation() {
  const navigate = useNavigate();
  const [state, setState] = React.useState({ ...defaultState });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [passwordError, setpasswordError] = useState(false);
  const [identifierError, setidentifierError] = useState(false);
  const [verification, setVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleInputChange = (event) => {
    if (passwordError) {
      setpasswordError(false);
    }
    if (identifierError) {
      setidentifierError(false);
    }
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setState({
      ...state,
      [name]: value,
    });
  };

  const expiration = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  const isEmail = (identifier) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(identifier);
  };

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setVerificationSent(false); 
    }
  }, [timer]);

 
  const submit = async (event) => {
    event.preventDefault();
    const { identifier, password } = state;
    const body = isEmail(identifier)
      ? { email: identifier, password }
      : { park_name: identifier, password };
  
    const data = await Login(JSON.stringify(body));
  
    if (data) {
      if (data.detail === 'Invalid username' || data.detail === 'Invalid email') {
        setidentifierError(true);
      } else if (data.detail === 'User is not verified') {
        setVerification(true);
      } else if (data.session_id) {
        console.log("nen");
        setCookie('session_id', '', { path: '/', expires: new Date(0) });
        setCookie('session_id', data.session_id, { path: '/', expires: expiration });
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('isSuperuser', data.is_superuser);
        navigate('/dashboard');
      } else {
        setpasswordError(true);
      }
    } else {
      setpasswordError(true);
    }
  };
  

  const [cookies, setCookie] = useCookies(['session_id']);

  const ReSend = () => {
      const { identifier } = state;

    const body = isEmail(identifier)
    ? { email: identifier }
    : { park_name: identifier };

    if (!verificationSent) {
      fetch(`${API_BASE_URL}api/parks/resend_verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache',
        body: JSON.stringify(body),
      })
      .then((response) => response.json())
      .then((data) => {
        setVerificationSent(true);
        setTimer(60); 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
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
                    <h3 className="login-heading mb-4">Vítejte zpět!</h3>
                    <form onSubmit={submit}>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className={`form-control ${identifierError ? 'invalid' : ''}`}
                          id="floatingInput"
                          name="identifier"
                          placeholder="Název parku nebo e-mail"
                          onChange={handleInputChange}
                        />
                        <label htmlFor="floatingInput">Název parku nebo e-mail</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className={`form-control ${passwordError ? 'invalid' : ''}`}
                          id="floatingPassword"
                          name="password"
                          placeholder="Heslo"
                          value={state.password || ''}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="floatingPassword">Heslo</label>
                      </div>

                      <div className="d-grid">
                        <button
                          className="btn btn-lg appoinment_button btn-login text-uppercase fw-bold mb-2"
                          type="submit" 
                        >
                          Přihlásit se
                        </button>
                      </div>
                      {verification && (
                          <div>
                            Prosím, potvrďte svůj e-mail.
                            <span className={verificationSent ? "link disabled_link" : "link"} onClick={ReSend}>
                              Klikněte zde
                            </span>
                            {verificationSent && ` Ověření e-mailu bylo odesláno. Prosím, zkontrolujte svou schránku. (${timer}s)`}
                          </div>
                        )}


                      <div className="registration_btn" onClick={() => navigate('/registration')}>
                        Vytvořit účet
                      </div>

                      <div className='link' onClick={() => navigate('/email')}>
                        Zapomenuté heslo
                      </div>
                    </form>
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

export default CustomFormValidation;
