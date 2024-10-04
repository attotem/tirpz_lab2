import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import translations from "../translations.json";
import { getPark,removePark, editPark } from '../../http';

function EditPark({ parkId, show, onHide, onParkUpdated }) {
    const [parkData, setParkData] = useState({ park: { name: "", iso: "" }, owner: {} });
    const [changedData, setChangedData] = useState({});
    const [trigger, setTrigger] = useState(true);

    useEffect(() => {
        if (show) {
            fetchParkData();
        }
    }, [parkId, show, trigger]);

    const fetchParkData = async () => {

        const data = await getPark(parkId)
        setParkData(data);
          
    };

    function translate(text) {
        return translations[text] || text;
    }

    const handleChange = (event) => {
        const { name, value, type, checked, files } = event.target;
        if (name === 'image') {
            setParkData(prevData => ({
                ...prevData,
                park: {
                    ...prevData.park,
                    image: files[0]
                }
            }));
        } else {
            const updatedValue = type === 'checkbox' ? checked : value;
            const [section, field] = name.split('.');
            setParkData(prevData => ({
                ...prevData,
                [section]: {
                    ...prevData[section],
                    [field]: updatedValue
                }
            }));
            setChangedData(prevData => ({
                ...prevData,
                [section]: {
                    ...prevData[section],
                    [field]: updatedValue
                }
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const dataObject = {
            id: parkId,
            fields: changedData,
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(dataObject));

        if (parkData.park.image && parkData.park.image instanceof File) {
            formData.append('image', parkData.park.image, `${parkData.park.name}.jpg`);
        } else {
            console.log("No image or invalid image file");
        }

        const data = await editPark(formData)
        if(data){
            alert('Údaje o parku byly úspěšně aktualizovány');
            onParkUpdated();
        }
        else{
            alert('Údaje o parku byly úspěšně aktualizovány');
        }
                
           
                
           
    };

    const deletePark = async () => {
        setTrigger(false);
        const data = await removePark(JSON.stringify({ id: parkId }))
        if(data){
            alert('Park vymazán');
            onParkUpdated();
        }
        else{
            alert('Chyba: Nelze smazat park.');
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{translate("Edit Park")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>{translate("Park Name")}</Form.Label>
                            <Form.Control
                                type="text"
                                name="park.name"
                                placeholder={translate("Enter park name")}
                                value={parkData.park.name || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>IČO:</Form.Label>
                            <Form.Control
                                type="text"
                                name="park.iso"
                                placeholder="IČO:"
                                value={parkData.park.iso || ''}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{translate("Owner Email")}</Form.Label>
                            <Form.Control
                                type="text"
                                name="owner.email"
                                placeholder={translate("Enter owner email")}
                                value={parkData.owner.email || ''}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{translate("Is Superuser")}</Form.Label>
                            <Form.Check
                                type="checkbox"
                                name="owner.is_superuser"
                                label={translate("Is Superuser")}
                                checked={parkData.owner.is_superuser || false}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{translate("Verified")}</Form.Label>
                            <Form.Check
                                type="checkbox"
                                name="owner.verified"
                                label={translate("Verified")}
                                checked={parkData.owner.verified || false}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{translate("Image")}</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center">
                            <Button variant="outline-secondary" type="button" className='d-flex align-items-center' onClick={deletePark}>
                                <DeleteForeverIcon /> {translate("Delete")}
                            </Button>
                            <Button style={{ background: "rgb(182, 51, 46)", border: "none" }} type="submit">
                                {translate("Submit")}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default EditPark;
