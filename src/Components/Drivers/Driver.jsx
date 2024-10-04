import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./driver.css";
import { useNavigate } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import translations from "../translations.json"
import VisibilityIcon from '@mui/icons-material/Visibility';
import { removeDriver } from '../../http';

const Driver = ({ cars = [], first_name, phone_number, last_name, experience, categories, park_id, post, salary, whatsapp, id, car_brand, car_id, car_model, photo, CarsData = [], onDriverUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const navigate = useNavigate();

  console.log(cars)

  function EditDriver() {
    navigate(`/edit_driver/${id}`)
  }

  function translate(key) {
    return translations[key] || key;
  }


  const  DeleteDriver = async() => {
    await removeDriver(JSON.stringify({ id: id }))
    alert('Řidič byl smazán');
    onDriverUpdated();
    
  }




  return (
    <>
      <tr className='TableRow' >
       
        <td className="py-3 table_text align-middle">{first_name}</td>
        <td className="py-3 table_text align-middle">{last_name}</td>
        <td className="py-3 table_text align-middle">{phone_number}</td>
        <td className="py-3 table_text align-middle">
          <div className='status_active' onClick={handleShow}><VisibilityIcon /></div>
        </td>
      </tr>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{last_name} {first_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="driver-info">
            <div className="d-flex">
              <div className="nameInfoCar">{translate("First Name")}:</div>
              <div className="infoCar">{first_name}</div>
            </div>
            <div className="d-flex">
              <div className="nameInfoCar">{translate("Last Name")}:</div>
              <div className="infoCar">{last_name}</div>
            </div>
            <div className="d-flex">
              <div className="nameInfoCar">{translate("Phone Number")}:</div>
              <div className="infoCar">{phone_number}</div>
            </div>
            <div className="d-flex">
              <div className="nameInfoCar">{translate("WhatsApp")}:</div>
              <div className="infoCar">{whatsapp}</div>
            </div>
          </div>
          <div className="d-flex">
            <div className="nameInfoCar">{translate("Car Info")}:</div>
            <div className="infoCar">
              {cars.map((car, index) => (
                <div key={index}>
                  {car[1]} {car[2]}
                </div>
              ))}
            </div>
          </div>

        </Modal.Body>

        <Modal.Footer className='d-flex justify-content-between'>
          <Button variant="outline-secondary" type="button" className='d-flex align-items-center' onClick={DeleteDriver}>
            <DeleteForeverIcon /> {translate("Delete")}
          </Button>
          <button className='edit_modal' onClick={EditDriver}>{translate("Edit driver")}</button>
        </Modal.Footer>
      </Modal >
    </>
  );
};

export default Driver;
