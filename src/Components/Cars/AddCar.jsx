import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import translations from "../translations.json";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import InputMask from 'react-input-mask';
import { getAllBrands, getAllDrivers, AddNewCar } from '../../http';

function AddCar() {
    const [driversData, setDriversData] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [carData, setCarData] = useState({
        brand: "",
        model: "",
        year: "",
        VIN_number: "",
        kms: 0,
        engine: "",
        transmission: "",
        fuel_type: "",
        ti_expiration: "00.00",
        insurance_info: "",
        tire_size: 0,
        color: "",
        reg_number: "",
        kms_per_month: "",
        driver_id: null,
        tire_type: 0,
        image: null,  // Add image field here
    });

    const [serviceInterval, setServiceInterval] = useState({
        service_interval: 15000,
        summer_tire_change: "31.05",
        winter_tire_change: "31.10",
    });

    const handleBrandSelection = (selected) => {
        setSelectedBrand(selected);
        if (selected.length > 0) {
            setCarData(prevData => ({
                ...prevData,
                brand: selected[0].label
            }));
        }
    };

    const handleBrandInputChange = (text) => {
        if (text === '') {
            setSelectedBrand([]);
        }
    };

    function translate(key) {
        return translations[key] || key;
    }

    const handleServiceIntervalChange = (event) => {
        const { name, value } = event.target;
        setServiceInterval(prevInterval => ({
            ...prevInterval,
            [name]: value
        }));
    };

    const fetchBrands = async () => {
        try {
            const data = await getAllBrands();
            const brands = data
                .map(brand => ({ id: brand.id, label: brand.name }))
                .sort((a, b) => a.label.localeCompare(b.label));
            setBrandOptions(brands);
        } catch (error) {
            console.error('Error fetching brands data:', error);
        }
    };

    const fetchDrivers = async () => {
        try {
            const data = await getAllDrivers();
            setDriversData(data);
        } catch (error) {
            console.error('Error fetching drivers data:', error);
        }
    };

    useEffect(() => {
        fetchBrands();
        fetchDrivers();
    }, []);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        const updatedValue = name === "driver_id" && value === "" ? null : value;
        const finalValue = name === "tire_type" ? Number(value) : updatedValue;
        if (files) {
            setCarData(prevData => ({
                ...prevData,
                [name]: files[0]  // Handle file input
            }));
        } else {
            setCarData(prevData => ({
                ...prevData,
                [name]: finalValue
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();

        const defaultValues = {
            VIN_number: carData.VIN_number || "",
            engine: carData.engine || "",
            transmission: carData.transmission || "",
            fuel_type: carData.fuel_type || "",
            ti_expiration: carData.ti_expiration || "",
            insurance_info: carData.insurance_info || "",
            tire_size: carData.tire_size || "",
            color: carData.color || "",
            reg_number: carData.reg_number || "",
            driver_id: carData.driver_id || null,
            tire_type: carData.tire_type || 0,
            image: carData.image || null,
        };

        formData.append('data', JSON.stringify({
            car: { ...carData, ...defaultValues },
            serviceInterval: { ...serviceInterval },
        }));

        // Append image file if uploaded
        if (carData.image) {
            formData.append('image', carData.image, carData.image.name);
        }

        const data = await AddNewCar(formData);
        console.log(data);
        if (data !== null) {
            alert('Auto úspěšně přidáno s servisním intervalem!');
            navigate("/cars");
        } else {
            alert('Chyba: Nepodařilo se přidat auto s servisním intervalem.');
        }
    };

    const navigate = useNavigate();
    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <>
            <Container>
                <Form onSubmit={handleSubmit} className='w-75'>
                    <Form.Group className="mb-3">
                        <Form.Label>{translate("brand")} <span className='requierd_field'>*</span></Form.Label>
                        <Typeahead
                            id="brand-typeahead"
                            onChange={handleBrandSelection}
                            onInputChange={handleBrandInputChange}
                            options={brandOptions}
                            placeholder={`Zadejte Značku`}
                            selected={selectedBrand}
                            clearButton
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{translate("model")} <span className='requierd_field'>*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="model"
                            placeholder={`Zadejte ${translate("model")}`}
                            value={carData.model}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{translate("year")} <span className='requierd_field'>*</span></Form.Label>
                        <Form.Control
                            type="number"
                            name="year"
                            placeholder={`Zadejte ${translate("year")}`}
                            value={carData.year}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>{`Reg. Značka`} <span className='requierd_field'>*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="reg_number"
                            placeholder={`Zadejte reg. značku`}
                            value={carData.reg_number}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{translate("kms_per_month")} <span className='requierd_field'>*</span></Form.Label>
                        <Form.Control
                            type="number"
                            name="kms_per_month"
                            placeholder={`Zadejte ${translate("kms_per_month")}`}
                            value={carData.kms_per_month}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {Object.keys(carData).map(key => {
                        if (key === "brand" || key === "model" || key === "year" || key === "kms_per_month" || key === "reg_number") return null;
                        if (key === "tire_type") {
                            return (
                                <Form.Group className="mb-3" key={key}>
                                    <Form.Label>{translate("tire_type")}</Form.Label>
                                    <Form.Select
                                        name={key}
                                        value={carData[key]}
                                        onChange={handleChange}
                                    >
                                        <option value="0">Zimní</option>
                                        <option value="1">Letní</option>
                                        <option value="-1">Celoroční</option>
                                    </Form.Select>
                                </Form.Group>
                            );
                        } else if (key === "driver_id") {
                            return (
                                <Form.Group className="mb-3" key={key}>
                                    <Form.Label>Řidič</Form.Label>
                                    <Form.Select
                                        name={key}
                                        value={carData[key]}
                                        onChange={handleChange}
                                    >
                                        <option value="">Výběr ovladače</option>
                                        {driversData.map((driver) => (
                                            <option key={driver.id} value={driver.id}>
                                                {driver.first_name} {driver.last_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            );
                        } else {
                            return (
                                <Form.Group className="mb-3" key={key}>
                                    <Form.Label>{translate(key)}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name={key}
                                        placeholder={`Zadejte ${translate(key)}`}
                                        value={carData[key]}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            );
                        }
                    })}
                    <Form.Group className="mb-3">
                        <Form.Label>Car Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <h3>Servisní interval</h3>
                    {Object.keys(serviceInterval).map(key => {
                        if (key === "service_interval") {
                            return (
                                <Form.Group className="mb-3" key={key}>
                                    <Form.Label>{"Interval servisní prohlídky (km)"}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name={key}
                                        value={serviceInterval[key]}
                                        onChange={handleServiceIntervalChange}
                                    />
                                </Form.Group>
                            );
                        } else if (key === "summer_tire_change") {
                            return (
                                <Form.Group className="mb-3" key={key}>
                                    <Form.Label>{"Datum upomínky ohledně přezutí na letní pneumatiky"}</Form.Label>
                                    <InputMask
                                        mask="99.99"
                                        maskChar=" "
                                        type="text"
                                        name={key}
                                        value={serviceInterval[key]}
                                        onChange={handleServiceIntervalChange}
                                        className="form-control"
                                    />
                                </Form.Group>
                            );
                        } else if (key === "winter_tire_change") {
                            return (
                                <Form.Group className="mb-3" key={key}>
                                    <Form.Label>{"Datum upomínky ohledně přezutí na zimní pneumatiky"}</Form.Label>
                                    <InputMask
                                        mask="99.99"
                                        maskChar=" "
                                        type="text"
                                        name={key}
                                        value={serviceInterval[key]}
                                        onChange={handleServiceIntervalChange}
                                        className="form-control"
                                    />
                                </Form.Group>
                            );
                        }
                    })}

                    <div className="d-flex justify-content-between">
                        <Button variant="outline-secondary" type="button" onClick={handleCancel} className='cancel_create'>
                            Zrušit
                        </Button>
                        <Button style={{ background: "rgb(182, 51, 46)", border: "none" }} type="submit">
                            Odeslat
                        </Button>
                    </div>
                </Form>
            </Container>
        </>
    );
}

export default AddCar;
