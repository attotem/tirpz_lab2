import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Park from './Park';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getAllParks } from '../../http';
function Parks(props) {
    const { SuperUser } = props;
    const [customersData, setCustomersData] = useState([]);
    const navigate = useNavigate();
    

    const fetchParks = async () => {

        const data = await getAllParks()
        setCustomersData(data);
              
    };


    useEffect(() => {
        fetchParks()
    }, []);

    const onParkUpdated = () => {
        fetchParks();
    };
    function AddPark() {
        navigate(`/add_park`)
    }

    return (
        <>
            <div className="container">
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {customersData.map((park, index) => (
                        <Park onParkUpdated={onParkUpdated} SuperUser={1} key={index} {...park} />
                    ))}
                    {SuperUser == 1 ? <></> : <>
                        <div className="col" onClick={AddPark} style={{ cursor: 'pointer' }}>
                            <div className="card h-100 d-flex justify-content-center align-items-center">
                                <AddIcon style={{ fontSize: '4rem', color: "#B6332E" }} />
                            </div>
                        </div>
                    </>}

                </div>
            </div>
        </>
    );
}

export default Parks;
