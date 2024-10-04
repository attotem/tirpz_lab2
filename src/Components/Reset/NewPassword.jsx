import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../url';
import bcrypt from 'bcryptjs';

function Reset() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetError, setResetError] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    const secret = searchParams.get('code');

    useEffect(() => {
        if (!email || !secret) {
            setResetError(true);
            setErrorMessage('Neplatný odkaz na obnovení hesla.');
        }
    }, [email, secret]);

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        if (passwordMismatch) {
            setPasswordMismatch(false);
        }
    };

    const resetPassword = (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMismatch(true);
            return;
        }

        fetch(`${API_BASE_URL}api/parks/change_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, secret, new_password: bcrypt.hashSync(newPassword, 10) }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.detail === "Success") {
                    navigate('/login');
                } else {
                    setResetError(true);
                    setErrorMessage(data.message || 'Chyba při resetování hesla.');
                }
            })
            .catch((error) => {
                console.error('Chyba při resetování hesla:', error);
                setResetError(true);
                setErrorMessage('Neočekávaná chyba. Zkuste to prosím znovu později.');
            });
    };

    return (
        <div className="reset-password-container">
            <div className="container-fluid ps-md-0">
                <div className="row g-0">
                    <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
                    <div className="col-md-8 col-lg-6">
                        <div className="login d-flex align-items-center py-5">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-9 col-lg-8 mx-auto">
                                        <h3 className="login-heading mb-4">Obnovení hesla</h3>
                                        <form onSubmit={resetPassword}>
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="password"
                                                    className={`form-control ${passwordMismatch ? 'invalid' : ''}`}
                                                    id="floatingNewPassword"
                                                    name="newPassword"
                                                    placeholder="Nové heslo"
                                                    onChange={handleNewPasswordChange}
                                                />
                                                <label htmlFor="floatingNewPassword">Nové heslo</label>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="password"
                                                    className={`form-control ${passwordMismatch ? 'invalid' : ''}`}
                                                    id="floatingConfirmPassword"
                                                    name="confirmPassword"
                                                    placeholder="Potvrďte nové heslo"
                                                    onChange={handleConfirmPasswordChange}
                                                />
                                                <label htmlFor="floatingConfirmPassword">Potvrďte nové heslo</label>
                                                {passwordMismatch && <div className="error-text">Hesla se neshodují</div>}
                                            </div>
                                            <div className="d-grid">
                                                <button
                                                    className="btn btn-lg appoinment_button btn-login text-uppercase fw-bold mb-2"
                                                    type="submit"
                                                >
                                                    Obnovit heslo
                                                </button>
                                            </div>
                                            {resetError && <div className="error-text">{errorMessage}</div>}
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

export default Reset;
