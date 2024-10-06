import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import translations from "../translations.json";
import InputMask from 'react-input-mask';
import { addDriver } from '../../http';

function AddDriver() {
    const [driverData, setDriverData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        whatsapp: '',
        parkId: '',
        image: null, // Added for image field
    });
    const navigate = useNavigate();

    function translate(key) {
        return translations[key] || key;
    }

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (files) {
            setDriverData(prevData => ({
                ...prevData,
                [name]: files[0] // Handling image file input
            }));
        } else {
            setDriverData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('data', JSON.stringify({
            first_name: driverData.firstName,
            last_name: driverData.lastName,
            phone_number: driverData.phoneNumber,
            whatsapp: driverData.whatsapp,
            park_id: driverData.parkId,
            photo: null
        }));

        if (driverData.image) {
            formData.append('image', driverData.image, `${driverData.firstName}_${driverData.lastName}.jpg`); // Append image
        }

        const data = await addDriver(formData);
        if (data) {
            alert('Řidič úspěšně přidán!');
            navigate(-1);
        } else {
            alert('Chyba: Nepodařilo se přidat řidiče.');
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <>
            <Container>
                <Form onSubmit={handleSubmit} className='w-75'>
                    <Form.Group className="mb-3">
                        <Form.Label>{translate("First Name")}</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            placeholder={translate("Enter First Name")}
                            value={driverData.firstName}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{translate("Last Name")}</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            placeholder={translate("Enter Last Name")}
                            value={driverData.lastName}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{translate("Phone Number")}</Form.Label>
                        <InputMask
                            mask="+420 999 999 999"
                            maskChar=" "
                            type="text"
                            name="phoneNumber"
                            placeholder={translate("Enter Phone Number")}
                            value={driverData.phoneNumber}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{translate("WhatsApp")}</Form.Label>
                        <Form.Control
                            type="text"
                            name="whatsapp"
                            placeholder={translate("Enter WhatsApp")}
                            value={driverData.whatsapp}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* New form group for image input */}
                    <Form.Group className="mb-3">
                        <Form.Label>{translate("Upload Driver Photo")}</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button variant="outline-secondary" type="button" onClick={handleCancel}>
                            {translate("Cancel")}
                        </Button>
                        <Button style={{ background: "rgb(182, 51, 46)", border: "none" }} type="submit">
                            {translate("Submit")}
                        </Button>
                    </div>
                </Form>
            </Container>
        </>
    );
}

export default AddDriver;
