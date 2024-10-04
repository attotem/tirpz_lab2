import React, { useState } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import "./Payments.css";
import translations from "../translations.json"
import { deleteService,getService } from '../../http';

function translate(key) {
    return translations[key] || key;
}


const Service = ({ reg_number, id, car_brand, car_model, service = [], setTrigger,trigger}) => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [serviceDetails, setServiceDetails] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    console.log(trigger)
    const handleOpenModal = () => {
        handleClick(id);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleDelete = async () => {
       
        await deleteService(service.id)
            setTrigger(prev => !prev);
            handleCloseDeleteModal();       
        
    };

    const handleCopy = () => {
        const textToCopy = `REG(${reg_number})`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => {
                    setCopySuccess(false);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                setCopySuccess(false);
            });
    };
    const handleClick = async () => {
        const data = await getService(service.id)
        setServiceDetails(data);
    }

    const getServiceTypeDisplay = (type) => {
        return type === "tire_change" ? "Přezutí" : translate(type);
    };

    return (
        <div className="payment-card my-3 card_calendar">
            <Card.Title className=''>{translate("Service №")}{service.id}</Card.Title>
            <hr className='hr_info'></hr>

            <div className='d-flex justify-content-between'>
                <div className='d-flex flex-column'>
                    <div className='info_card_label'>{translate("Note")}</div>
                    <div className='info_card_info'>{getServiceTypeDisplay(`${service.type}`)}</div>
                    <div className='info_card_label'>{translate("Deadline")}</div>
                    <div className='info_card_info'>{service.deadline}</div>
                </div>
                <div className='d-flex flex-column'>
                    <div className='info_card_label'>{translate("Car")}</div>
                    <div className='info_card_info'>{car_brand} {car_model}</div>
                </div>
            </div>
            {service.status === "upcoming" &&
                <div className='button_upcoming' onClick={() => handleOpenModal()}>
                    {translate("Details")}
                </div>
            }
            {service.status === "enroll" &&
                <div className='button_enroll' onClick={() => setShowDeleteModal(true)}>
                    {translate("Enroll")}
                </div>
            }
            {service.status === "urgently" &&
                <div className='button_urgently' onClick={() => setShowDeleteModal(true)}>
                    {translate("Urgently")}
                </div>
            }
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Jste si jisti, že chcete toto upozornění smazat? </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <div className='d-flex'>

                        <div className='d-flex justify-content-between flex-column '>

                            <Button variant="secondary" onClick={handleCloseDeleteModal}>{translate("No")} </Button>
                            <Button variant="danger" onClick={handleDelete}>
                            <a className='text_solo' href='https://rezervace.drivelab.cz' target="_blank">{translate("Yes")}</a>
                            </Button>
                        </div>

                        <div className='text_modal'>
                            V takovém případě prosím pokračujte a proveďte rezervaci.
                            Při rezervaci prosím uveďte v informacích o vozidle registrační značku vozidla.
                        </div>



                    </div>

                    <div className='reg'>
                        Reg. znacka - REG({reg_number})  - <span className='reg_btn' onClick={handleCopy}>{copySuccess ? "Zkopírováno!" : "Zkopirovat"}</span>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{translate("Service Details")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {serviceDetails ? (
                        <>
                            <div className="service-details">
                                <div className="d-flex">
                                    <div className="nameInfoCar">{translate("Car Brand")}:</div>
                                    <div className="infoCar">{serviceDetails.car_brand}</div>
                                </div>
                                <div className="d-flex">
                                    <div className="nameInfoCar">{translate("Car Model")}:</div>
                                    <div className="infoCar">{serviceDetails.car_model}</div>
                                </div>
                                <div className="d-flex">
                                    <div className="nameInfoCar">{translate("Service")}:</div>
                                    <div className="infoCar">{serviceDetails.service.name}</div>
                                </div>
                                <div className="d-flex">
                                    <div className="nameInfoCar">{translate("Deadline")}:</div>
                                    <div className="infoCar">{serviceDetails.service.deadline}</div>
                                </div>
                                {serviceDetails.service.type && (
                                    <div className="d-flex">
                                        <div className="nameInfoCar">{translate("Service Type")}:</div>
                                        <div className="infoCar">{serviceDetails.service.type}</div>
                                    </div>
                                )}
                                {serviceDetails.service.quantity && (
                                    <div className="d-flex">
                                        <div className="nameInfoCar">{translate("Quantity")}:</div>
                                        <div className="infoCar">{serviceDetails.service.quantity}</div>
                                    </div>
                                )}
                                {serviceDetails.service.unit_price && (
                                    <div className="d-flex">
                                        <div className="nameInfoCar">{translate("Unit Price")}:</div>
                                        <div className="infoCar">{serviceDetails.service.unit_price}</div>
                                    </div>
                                )}
                                {serviceDetails.service.total_price && (
                                    <div className="d-flex">
                                        <div className="nameInfoCar">{translate("Total Price")}:</div>
                                        <div className="infoCar">{serviceDetails.service.total_price}</div>
                                    </div>
                                )}
                                <div className="d-flex">             
                                     <div className="nameInfoCar">{translate("Status")}:</div>
                                    <div className="infoCar">{translate(serviceDetails.service.status)}</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Loading service details...</p>
                    )}
                </Modal.Body>
            </Modal>



        </div>
    );
};

export default Service;