import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../url';
import './EmailInput.css';

function EmailInput() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    const isEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        if (emailError) {
            setEmailError(false);
        }
    };

    const sendVerificationCode = (event) => {
        event.preventDefault();

        if (!isEmail(email)) {
            setEmailError(true);
            return;
        }

        fetch(`${API_BASE_URL}api/parks/reset_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setEmailSent(true);
                } else {
                    setEmailError(true);
                }
            })
            .catch((error) => {
                console.error('Chyba při odesílání ověřovacího kódu:', error);
            });
    };

    return (
        <div className="email-input-container">
            <div className="container-fluid ps-md-0">
                <div className="row g-0">
                    <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
                    <div className="col-md-8 col-lg-6">
                        <div className="login d-flex align-items-center py-5">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-9 col-lg-8 mx-auto">
                                        <h3 className="login-heading mb-4">Obnova hesla</h3>
                                        <form onSubmit={sendVerificationCode}>
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="email"
                                                    className={`form-control ${emailError ? 'invalid' : ''}`}
                                                    id="floatingEmail"
                                                    name="email"
                                                    placeholder="E-mail"
                                                    onChange={handleEmailChange}
                                                />
                                                <label htmlFor="floatingEmail">E-mail</label>
                                                {emailError && <div className="error-text">Neplatná e-mailová adresa</div>}
                                            </div>
                                            <div className="d-grid">
                                                <button
                                                    className="btn btn-lg appoinment_button btn-login text-uppercase fw-bold mb-2"
                                                    type="submit"
                                                >
                                                    Odeslat ověřovací kód
                                                </button>
                                            </div>
                                            {emailSent && <div className="success-text">Ověřovací kód byl odeslán na váš e-mail.</div>}
                                        </form>
                                        <div>Již máte účet <span className='link' onClick={() => navigate('/login')}>Přihlásit se</span> </div>

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

export default EmailInput;
