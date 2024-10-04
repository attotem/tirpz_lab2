import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import translations from "../translations.json";
import { API_BASE_URL } from '../url';
import { getCar,updateServiceInterval} from '../../http';

function EditCar() {
    let { carId } = useParams();
    const navigate = useNavigate();

    const [serviceIntervalData, setServiceIntervalData] = useState(null);
    const [changedServiceIntervalData, setChangedServiceIntervalData] = useState({});

    function translate(key) {
        return translations[key] || key;
    }

    const getCarData = async ()=> {
        const data = await getCar(carId)
        setServiceIntervalData(data.serviceInterval);
    }
    useEffect(() => {
        getCarData()
    }, [carId]);

    const handleChangeServiceIntervalData = (event) => {
        const { name, value } = event.target;
        setServiceIntervalData(prev => ({ ...prev, [name]: value }));
        setChangedServiceIntervalData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedData = {
            id: carId,
            fields: changedServiceIntervalData,
        };

        const data = await updateServiceInterval(JSON.stringify(updatedData))
        
        if(data) {
            alert('Údaje o autě byly úspěšně aktualizovány');
            navigate(-1);
        }
        else{
            alert('Chyba: Nepodařilo se aktualizovat údaje o autě.');

        }
            
    };

    if (!serviceIntervalData) return <div>Načítání...</div>;

    return (
        <>
            <Container>
                <Form onSubmit={handleSubmit} className='w-75'>
                    <h3>{translate("Service Interval Information")}</h3>
                    {serviceIntervalData && Object.keys(serviceIntervalData).map(key => {
                        let baseLabel = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        let label = translate(baseLabel);
                        if (key === "tire_type_change_0") {
                            label = translate("Winter tire type change");
                        } else if (key === "tire_type_change_1") {
                            label = translate("Summer tire type change");
                        }

                        return (
                            <Form.Group className="mb-3" key={key}>
                                <Form.Label>{label}</Form.Label>
                                <Form.Control
                                    type={typeof serviceIntervalData[key] === "number" ? "number" : "text"}
                                    name={key}
                                    value={serviceIntervalData[key] || ''}
                                    onChange={handleChangeServiceIntervalData}
                                />
                            </Form.Group>
                        );
                    })}

                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={() => navigate(-1)}>{translate("Cancel")}</Button>
                        <Button variant="primary" style={{ background: "rgb(182, 51, 46)", border: "none" }} type="submit">
                            Uložit změny
                        </Button>
                    </div>
                </Form>
            </Container>
        </>
    );
}

export default EditCar;
