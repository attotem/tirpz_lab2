import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./cars.css";
import { useNavigate } from 'react-router-dom';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import translations from "../translations.json"
import { getCar,removeCar,getAllDrivers } from '../../http';

const CarsCard = ({
    brand,
    id,
    kms,
    model,
    status,
    image,
    fetchCars

}) => {
    const [DriverData, setDriversData] = useState([]);
    const [DriverId, setDriverId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [carInfo, setCarInfo] = useState(null);
    const [Info, setInfo] = useState(true);
    const handleClose = () => setShowModal(false);
    const navigate = useNavigate();

    function EditCar() {
        navigate(`/edit_car/${id}`)
    }

    const cookie = document.cookie;
    let sessionId = cookie.split("=")[1];



    function translate(key) {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return translations[key] ? translations[key] : formattedKey;
    }


    const ShowInfo = async ()=> {
        setShowModal(true);
        const data = await getCar(id)
        console.log(data);
        const roundedCarData = roundNumericValues(data.car);
        const roundedServiceIntervalData = roundNumericValues(data.serviceInterval);

        setDriverId(data.car.driver_id)
        setCarInfo({
            ...data,
            car: roundedCarData,
            serviceInterval: roundedServiceIntervalData
        });

           

    }
    const DeleteCar = async()=> {
        await removeCar(JSON.stringify({ id: id }))
        setShowModal(false);
        fetchCars()
            
    }

    useEffect(() => {
        if (DriverId) {
            fetchDrivers();
        }
    }, [DriverId]);

    const fetchDrivers = async () => {
        try {
            const data = await getAllDrivers();
             const driver = data.find(driver => driver.id === DriverId);
                if (driver) {
                    setDriversData(driver);
                    console.log("DriverData", driver);
                }
        } catch (error) {
            console.error('Error fetching drivers data:', error);
        }
    };
   
    const renderCarInfo = (car) => {
        const getTireTypeLabel = (value) => {
            const tireTypes = {
                "0": "Zimní",
                "1": "Letní",
                "-1": "Všechna roční období"
            };
            return tireTypes[value] || "Neznámý typ";
        };

        const appendKmIfNeeded = (key, value) => {
            const fieldsWithKm = [
                'kms', 'air_filter_change', 'brake_disks_change', 'brake_pads_change',
                'cabin_filter_change', 'fuel_filter_change', 'pendant_change',
                'kms_per_month', 'spark_plugs_change', 'tire_change', 'valvetrain_change', 'oil_change', 'service_interval'
            ];
            if (fieldsWithKm.includes(key)) {
                return `${value} km`;
            }
            return value;
        };

        const appendDayIfNeeded = (key, value) => {
            if (key === 'antifreeze_change' || key === 'brake_fluid_change') {
                return `${value} dní`;
            }
            return value;
        };

        const formatValue = (key, value) => {
            if (key === 'tire_type') {
                return getTireTypeLabel(value.toString());
            }
            let formattedValue = appendKmIfNeeded(key, value);
            formattedValue = appendDayIfNeeded(key, formattedValue);
            return formattedValue;
        };

        const excludedFields = ['id', 'image', 'driver_id', 'photo', 'park', 'service_interval_id', 'status'];
        const filteredEntries = Object.entries(car).filter(([key, _]) => !excludedFields.includes(key));

        const partSize = Math.ceil(filteredEntries.length / 4);
        const firstHalf = filteredEntries.slice(0, partSize);
        const all = filteredEntries.slice(0, partSize * 4);
        const secondHalf = filteredEntries.slice(partSize, 2 * partSize - 1);
        const thirdHalf = filteredEntries.slice(2 * partSize - 1, 3 * partSize - 2);
        const fourthHalf = filteredEntries.slice(3 * partSize - 2);

        const renderSection = (entries) => (
            entries.map(([key, value], index) => (
                <div className="d-flex" key={index}>
                    <div className="nameInfoCar">{translate(key)}:</div>
                    <div className="infoCar">{formatValue(key, value)}</div>
                </div>
            ))
        );

        return {
            firstHalf: renderSection(firstHalf),
            secondHalf: renderSection(secondHalf),
            thirdHalf: renderSection(thirdHalf),
            fourthHalf: renderSection(fourthHalf),
            all: renderSection(all)
        };
    };






    function roundNumericValues(obj) {
        const roundedObj = {};
        Object.entries(obj).forEach(([key, value]) => {
            roundedObj[key] = typeof value === 'number' ? Math.round(value) : value;
        });
        return roundedObj;
    }

    function swap() {
        setInfo(!Info)
    }

    function EditInfo(id) {
        navigate(`/edit_info/${id}`)
    }

    return (
        <div className="col">
            <div className="card" onClick={ShowInfo} >
                <div className='car_status'>
                    {status === "serviced" ?
                        <div className='blambda green_blambda'>Servisované</div>
                        : null}
                    {status === "need service" ?
                        <div className='blambda yellow_blambda'>Je čas na servis</div>
                        : null}
                    {status === "urgently service" ?
                        <div className='blambda red_blambda'>Termín Překročen</div>
                        : null}
                </div>


                <div className="card-body text-center">
                    <div className='image_container'>
                        <img src={image} alt={brand} className="card-img-top" />
                    </div>
                    <h5 className="card-title">{brand} {model}</h5>
                    <p className="card-text" style={{ fontSize: "1rem" }}>{kms} km</p>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose} size="lg">
                {carInfo && (
                    <>
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='car_top_container'>

                                <div className='d-flex driver_car'>

                                    {/* <img className='car_card_driver_img' src={DriverId == null ? nophoto : DriverData.photo}></img> */}

                                    <div className='d-flex flex-md-column '>


                                        <div className='car_card_driver_name'>{DriverId == null ? "Vyberte řidiče" : <>{DriverData.first_name} {DriverData.last_name}</>}</div>



                                        <div className='d-flex justify-content-star'>
                                            {status === "serviced" ?
                                                <div className='car_card_blambda green_blambda'>Servisované</div>
                                                : null}
                                            {status === "need service" ?
                                                <div className='car_card_blambda yellow_blambda'>Je čas na servis</div>
                                                : null}
                                            {status === "urgently service" ?
                                                <div className='car_card_blambda red_blambda'>Termín Překročen</div>
                                                : null}
                                        </div>
                                    </div>
                                </div>

                                <div className='img_container'>
                                    <img className='img_car' src={carInfo.car.photo}></img>
                                </div>
                                <div className='car_card_name'>
                                    {carInfo.car.brand} {carInfo.car.model}
                                    <div className='park_name' style={{ fontSize: "20px" }}>
                                        Park: {carInfo.park.name}
                                    </div>
                                </div>
                            </div>


                            {Info ?
                                <div onClick={swap} className='Switch_container'>Přepnout na interval servisu <SwapHorizIcon /></div>
                                :
                                <div onClick={swap} className='Switch_container'>Přepnout na informace o autě <SwapHorizIcon /></div>
                            }
                            <hr></hr>
                            <div className="row">
                                {Info ?
                                    <>

                                        <div className="col-md-6">
                                            {renderCarInfo(carInfo.car).firstHalf}
                                        </div>



                                        <div className="col-md-6">
                                            {renderCarInfo(carInfo.car).secondHalf}
                                        </div>


                                        <hr />

                                        <div className="col-md-6">
                                            {renderCarInfo(carInfo.car).thirdHalf}
                                        </div>



                                        <div className="col-md-6">
                                            {renderCarInfo(carInfo.car).fourthHalf}
                                        </div>
                                    </>
                                    :
                                    <>


                                        <div className="col-md-6">
                                            {renderCarInfo(carInfo.serviceInterval).all}
                                        </div>


                                    </>
                                }
                            </div>
                        </Modal.Body>
                        <Modal.Footer className='d-flex justify-content-between'>
                            <Button variant="outline-secondary" type="button" className='d-flex align-items-center' onClick={DeleteCar}>
                                <DeleteForeverIcon /> {translate("Delete")}
                            </Button>
                            {Info ?
                                <button className='edit_modal' onClick={EditCar}>Upravit auto</button>
                                :
                                <button className='edit_modal' onClick={() => EditInfo(carInfo.car.id)}>Upravit info</button>
                            }
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default CarsCard;
