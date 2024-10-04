import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import CarsCard from './CarsCard';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useSelectedPark } from '../../SelectedParkContext';
import { API_BASE_URL } from '../url';
import { getAllCars } from '../../http';
function Cars() {
    const cookie = document.cookie
    const [customersData, setCustomersData] = useState([]);
    const navigate = useNavigate();

    const { selectedParkId } = useSelectedPark();

    const fetchCarsData = async () => {
     const data = await getAllCars()
     setCustomersData(data);
            
    }
    useEffect(() => {
        fetchCarsData()
    }, [selectedParkId]);


    function AddCar() {
        navigate(`/add_car`)
    }
    return (
        <>
            <div className="container">
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {customersData.map((car, index) => (
                        <CarsCard fetchCars={fetchCarsData} key={index} {...car} />
                    ))}
                    <div className="col" onClick={AddCar} style={{ cursor: 'pointer' }}>
                        <div className="card h-100 d-flex justify-content-center align-items-center">
                            <AddIcon style={{ fontSize: '4rem', color: "#B6332E" }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Cars