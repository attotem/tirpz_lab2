import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import translations from "../translations.json";
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { getCar, updateCar, getAllDrivers, getAllBrands } from '../../http';

function EditCar() {
    let { carId } = useParams();
    const navigate = useNavigate();

    function translate(text) {
        return translations[text] || text.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const [changedData, setChangedData] = useState({});
    const [carData, setCarData] = useState({});
    const [serviceIntervalData, setServiceIntervalData] = useState({});
    const [driversData, setDriversData] = useState([]);
    const [brandsData, setBrandsData] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState([]);

    const getCarData = async () => {
        const data = await getCar(carId);
        setCarData(data.car);
        setServiceIntervalData(data.serviceInterval);
    };

    const fetchDrivers = async () => {
        try {
            const data = await getAllDrivers();
            setDriversData(data);
        } catch (error) {
            console.error('Error fetching drivers data:', error);
        }
    };

    const fetchBrandsData = async () => {
        try {
            const data = await getAllBrands();
            const sortedBrands = data
                .map(brand => ({ id: brand.id, label: brand.name }))
                .sort((a, b) => a.label.localeCompare(b.label));
            setBrandsData(sortedBrands);
        } catch (error) {
            console.error('Error fetching brands data:', error);
        }
    };

    useEffect(() => {
        getCarData();
        fetchDrivers();
        fetchBrandsData();
    }, [carId]);

    useEffect(() => {
        if (brandsData.length > 0 && carData.brand) {
            const selected = brandsData.find(brand => brand.label === carData.brand);
            if (selected) {
                setSelectedBrand([selected]);
            }
        }
    }, [brandsData, carData.brand]);

    const handleChangeCarData = (event) => {
        const { name, value, files } = event.target;
        if (name === 'image') {
            setCarData(prevData => ({
                ...prevData,
                [name]: files[0]
            }));
            setChangedData(prevData => ({
                ...prevData,
                [name]: files[0]
            }));
        } else {
            setCarData(prevData => ({
                ...prevData,
                [name]: value
            }));
            setChangedData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleBrandSelection = (selected) => {
        setSelectedBrand(selected);
        if (selected.length > 0) {
            const updatedCarData = {
                ...carData,
                brand: selected[0].label
            };
            setChangedData(updatedCarData);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        const { status, ...fieldsToSend } = changedData;

        const dataObject = {
            id: carId,
            fields: { ...fieldsToSend },
        };

        delete dataObject.fields.image;

        formData.append('data', JSON.stringify(dataObject));

        // Append image file if it was selected.
        if (changedData.image instanceof File) {
            formData.append('image', changedData.image, changedData.image.name);
        }

        const data = await updateCar(formData);

        if (data) {
            alert('Údaje o autě byly úspěšně aktualizovány');
            navigate(-1);
        } else {
            alert('Chyba: Nepodařilo se aktualizovat údaje o autě.');
        }
    };

    if (!carData || !serviceIntervalData) return <div>Načítání...</div>;

    const excludedFields = ['image', 'park_id', 'service_interval_id', 'id'];

    return (
        <Container>
            <Form onSubmit={handleSubmit} className='w-75'>
                {Object.keys(carData).filter(key => !excludedFields.includes(key)).map(key => {
                    if (key === "photo") return ( <Form.Group className="mb-3">
                        <Form.Label>Car Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChangeCarData}
                        />
                    </Form.Group>);
                    if (key === "status") return null;
                    if (key === "next_service_mileage") return null;
                    if (key === "next_tire_change") return null;

                    const label = translate(key);
                    if (key === "brand") {
                        return (
                            <Form.Group className="mb-3" key={key}>
                                <Form.Label>{label}</Form.Label>
                                <Typeahead
                                    id="brand-typeahead"
                                    onChange={handleBrandSelection}
                                    options={brandsData}
                                    placeholder="Select a brand"
                                    selected={selectedBrand}
                                    clearButton
                                />
                            </Form.Group>
                        );
                    } else if (key === "image") {
                        return (
                            <Form.Group className="mb-3" key={key}>
                                <Form.Label>{translate("image")}</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChangeCarData}
                                />
                            </Form.Group>
                        );
                    } else {
                        const isSelectField = key === "tire_type" || key === "driver_id";
                        const selectOptions = key === "tire_type" ? [
                            { value: "0", label: "Zimní" },
                            { value: "1", label: "Letní" },
                            { value: "-1", label: "Celoroční" },
                        ] : driversData.map(driver => ({
                            value: driver.id.toString(),
                            label: `${driver.first_name} ${driver.last_name}`
                        }));

                        return (
                            <Form.Group className="mb-3" key={key}>
                                <Form.Label>{label}</Form.Label>
                                {isSelectField ? (
                                    <Form.Select
                                        name={key}
                                        value={carData[key]}
                                        onChange={handleChangeCarData}
                                    >
                                        <option>Zadejte</option>
                                        {selectOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                ) : (
                                    <Form.Control
                                        type="text"
                                        name={key}
                                        placeholder={`Zadejte ${label}`}
                                        value={carData[key]}
                                        onChange={handleChangeCarData}
                                    />
                                )}
                            </Form.Group>
                        );
                    }
                })}

                <div className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>Zrušit</Button>
                    <Button variant="primary" style={{ background: "rgb(182, 51, 46)", border: "none" }} type="submit">
                        Uložit změny
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default EditCar;
