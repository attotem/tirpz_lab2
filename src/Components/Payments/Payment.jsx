import React, { useState, useEffect } from 'react';
import { Card, Form, Modal, Table } from 'react-bootstrap';
import "./Payments.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import translations from "../translations.json";
import DownloadIcon from '@mui/icons-material/Download';
import { getInvoice, downloadPdf,updateInvoice} from '../../http';
const Payment = ({ id, issued_on, total_amount, note, number, client_name, status, carData }) => {

    const [invoiceData, setInvoiceData] = useState({
        client_name: "",
        issued_on: "",
        total_amount: 0,
        note: "",
        number: "",
        status: "",
        lines: []
    });
    const [showModal, setShowModal] = useState(false);

    const fetchInvoiceData = async () => {
        const headers = {
            "Authorization": `Bearer ${document.cookie.split("=")[1]}`,
            "ngrok-skip-browser-warning": "69420",
        };

        const data = await getInvoice(id)
        setInvoiceData(data);
          
    };
    const DownloadPdf = async() => {
        const blob = await downloadPdf(id)
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Invoice_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    };

    const updateStatus = async (newStatus) => {
       await updateInvoice(JSON.stringify({ id, fields: { status: newStatus } }))
       setInvoiceData(prevData => ({ ...prevData, status: newStatus }));   
    };

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        updateStatus(newStatus);
    };

    const translate = (key) => {
        return translations[key] || key;
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        fetchInvoiceData();
    }

    return (
        <div className="payment-card my-3 card_calendar">
            <CardHeader number={number} status={status} onChange={handleStatusChange} translate={translate} />
            <CardBody client_name={client_name} issued_on={issued_on} carData={carData} total_amount={total_amount} translate={translate} />
            <ModalComponent showModal={showModal} onHide={toggleModal} invoiceData={invoiceData} translate={translate} DownloadPdf={DownloadPdf} />
            <div className={`button_upcoming ${status === "unpaid" ? 'button_unpaid' : ''}`} onClick={toggleModal}>
                {translate("Details")}
            </div>
        </div>
    );
};

const CardHeader = ({ number, status, onChange, translate }) => (
    <div className='d-flex justify-content-between align-items-center'>
        <Card.Title>{number}</Card.Title>
        <Card.Header>
            <Form.Select
                value={status}
                onChange={onChange}
                className={status === "paid" ? 'select-paid' : 'select-unpaid'}
            >
                <option value="paid">{translate("Paid")}</option>
                <option value="unpaid">{translate("Unpaid")}</option>
            </Form.Select>
        </Card.Header>
    </div>
);

const CardBody = ({ client_name, issued_on, carData, total_amount, translate }) => {
    return (
        <div className='d-flex justify-content-between'>
            <div className='d-flex flex-column'>
                <div className='info_card_label'>{translate("Client")}</div>
                <div className='info_card_info'>{client_name}</div>
                <div className='info_card_label'>{translate("Issued on")}</div>
                <div className='info_card_info'>{issued_on}</div>
            </div>
            <div className='d-flex flex-column'>
                <div className='info_card_label'>{translate("Note")}</div>
                <div className='info_card_info'>{carData.brand} {carData.model}</div>
                <div className='info_card_label'>{translate("Total amount")}</div>
                <div className='info_card_info'>{total_amount} Kč</div>
            </div>
        </div>
    );
};

const ModalComponent = ({ showModal, onHide, invoiceData, translate, DownloadPdf }) => (
    <Modal show={showModal} onHide={onHide} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>{translate("Payment Details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <InvoiceDetails invoiceData={invoiceData} translate={translate} DownloadPdf={DownloadPdf} />
        </Modal.Body>
    </Modal>
);

const InvoiceDetails = ({ invoiceData, translate, DownloadPdf }) => (
    <div>
        <div onClick={() => DownloadPdf()} className='download_pdf'>
            <div>Stáhnout pdf</div>
            <DownloadIcon />

        </div>
        <div className="d-flex">
            <div className="nameInfoCar">{translate("Client")}:</div>
            <div className="infoCar">{invoiceData.client_name}</div>
        </div>

        <div className="d-flex">
            <div className="nameInfoCar">{translate("Issued on")}:</div>
            <div className="infoCar">{invoiceData.issued_on.split('T')[0]}</div>
        </div>
        <div className="d-flex">
            <div className="nameInfoCar">{translate("Total amount")}:</div>
            <div className="infoCar">{invoiceData.total_amount} Kč</div>
        </div>
        {invoiceData.lines !== null && invoiceData.lines.length > 0 ? (
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th style={{ width: "40%" }}>{translate("Name")}</th>
                        <th style={{ width: "15%" }}>Cena bez DPH</th>
                        <th style={{ width: "15%" }}>DPH</th>
                        <th style={{ width: "15%" }}>Cena s DPH</th>
                        <th style={{ width: "15%" }}>{translate("Quantity")}</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceData.lines.map((line, index) => (
                        <tr key={index}>
                            <td>{line.name}</td>
                            <td>{line.total_price_without_vat} Kč</td>
                            <td>{line.total_vat} Kč</td>
                            <td>{parseFloat(line.total_vat) + parseFloat(line.total_price_without_vat)} Kč</td>
                            <td>{line.quantity} {translate(line.unit_name)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        ) : (
            <div></div>
        )}
    </div>
);

export default Payment;
