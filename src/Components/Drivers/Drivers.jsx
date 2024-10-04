import React, { useEffect, useState } from 'react';
import Driver from './Driver';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useSelectedPark } from '../../SelectedParkContext';
import translations from "../translations.json"
import { getAllDrivers, getAllCars } from '../../http';

function Drivers() {
    const [customersData, setCustomersData] = useState([]);
    const { selectedParkId } = useSelectedPark();

    function translate(key) {
        return translations[key] || key;
    }

    const fetchDriversData = async () => {
        try {
            const data = await getAllDrivers();
            setCustomersData(data);
        } catch (error) {
            console.error('Error fetching drivers data:', error);
        }
    };
    const fetchCarsData = async () => {
        try {
            const data = await getAllCars();
            setCarsData(data);
        } catch (error) {
            console.error('Error fetching drivers data:', error);
        }
    };
    useEffect(() => {
        fetchDriversData();
        fetchCarsData();
    }, [selectedParkId]);

    function handleNavigate() {
        navigate(`/driver_create`)

    }

    const [CarsData, setCarsData] = useState([]);
    const navigate = useNavigate();

    return (
        <>
            <div className="container mt-5">
                <div className='d-flex justify-content-between'>
                    <h2>{translate("All Drivers")}</h2>
                    <div className='add_button' onClick={handleNavigate}>
                        <AddIcon style={{ fontSize: '2rem', color: "white", fontWeight: "600" }} />
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table" style={{ textAlign: "center" }}>
                        <thead>
                            <tr>
                                {/* <th className='table_header '></th> */}
                                <th className='table_header '>{translate("First name")}</th>
                                <th className='table_header '>{translate("Last name")}</th>
                                <th className='table_header '>{translate("Phone number")}</th>
                                <th className='table_header '>{translate("Car")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customersData.map((customer, index) => (
                                <Driver key={index}
                                    cars={customer.cars}
                                    first_name={customer.first_name}
                                    last_name={customer.last_name}
                                    experience={customer.experience}
                                    categories={customer.categories}
                                    park_id={customer.park_id}
                                    post={customer.post}
                                    salary={customer.salary}
                                    whatsapp={customer.whatsapp}
                                    phone_number={customer.phone_number}
                                    id={customer.id}
                                    car_brand={customer.car_brand}
                                    car_id={customer.car_id}
                                    car_model={customer.car_model}
                                    photo={customer.photo}
                                    CarsData={CarsData}
                                    onDriverUpdated={fetchDriversData}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

}

export default Drivers;