import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import translations from "../translations.json"
import InputMask from 'react-input-mask';
import { getDriver,updateDriver } from '../../http';
function EditDriver() {
    const navigate = useNavigate();
    const { driverId } = useParams();
    const [driverData, setDriverData] = useState({
        first_name: '',
        last_name: '',
        post: '',
        salary: 0,
        experience: 0,
        categories: '',
        phone_number: '',
        tg: '',
        parkId: '',
        image: null,
    });
    const [changedData, setChangedData] = useState({});
    const cookie = document.cookie;
    const sessionId = cookie.split("=")[1];
    function translate(key) {
        return translations[key] || key;
    }
    const getDriverData = async () =>{
        const data = await getDriver(driverId)
        setDriverData(data)
    }
    useEffect(() => {
        getDriverData()
    }, [driverId, sessionId]);

    const handleChange = (event) => {
        const { name, value, type, checked, files } = event.target;
        if (name === 'image') {
            setDriverData(prevData => ({
                ...prevData,
                image: files[0]
            }));
        } else {
            const updatedValue = type === 'checkbox' ? checked : value;
            setDriverData(prevData => ({
                ...prevData,
                [name]: updatedValue
            }));
            setChangedData(prevData => ({
                ...prevData,
                [name]: updatedValue
            }));
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleSubmit =  async (event) => {
        event.preventDefault();

        const formData = new FormData();
        const dataObject = {
            id: driverId,
            fields: changedData,
        };

        formData.append('data', JSON.stringify(dataObject));

        if (driverData.image && driverData.image instanceof File) {
            formData.append('image', driverData.image, driverData.image.name);
        }

       const data = await updateDriver(formData)
       if(data){
        alert('Údaje o řidiči byly úspěšně aktualizovány');
        navigate(-1);
       }
       else{
        alert('Chyba: Nepodařilo se aktualizovat údaje o řidiči.');
       }
                
          
          
    };

    return (
        <>
            <Container>
                <Form onSubmit={handleSubmit} className='w-75'>
                    <Form.Group className="mb-3">
                        <Form.Label>{translate("First Name")}</Form.Label>
                        <Form.Control type="text" placeholder="Enter First Name" name="first_name" value={driverData.first_name} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{translate("Last Name")}</Form.Label>
                        <Form.Control type="text" placeholder="Enter Last Name" name="last_name" value={driverData.last_name} onChange={handleChange} />
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
                        <Form.Label>{translate("Phone Number")}</Form.Label>
                        <Form.Control type="text" placeholder="Enter Phone Number" name="phone_number" value={driverData.phone_number} onChange={handleChange} />
                    </Form.Group> */}

                    <Form.Group className="mb-3">
                        <Form.Label>{translate("Phone Number")}</Form.Label>
                        <InputMask
                            mask="+420 999 999 999"
                            maskChar=" "
                            type="text"
                            name="phone_number"
                            placeholder={translate("Enter Phone Number")}
                            value={driverData.phone_number}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </Form.Group>


                    <Form.Group className="mb-3">
                        <Form.Label>{translate("WhatsApp")}</Form.Label>
                        <Form.Control type="text" placeholder={translate("Enter WhatsApp")} name="tg" value={driverData.tg} onChange={handleChange} />
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
                        <Form.Label>{translate("Image")}</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={handleChange}
                        />
                    </Form.Group> */}



                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={handleCancel}>{translate("Cancel")}</Button>
                        <Button variant="primary" style={{ background: "rgb(182, 51, 46)", border: "none" }} type="submit">
                            {translate("Save Changes")}
                        </Button>
                    </div>
                </Form>
            </Container>
        </>
    );
}

export default EditDriver;
