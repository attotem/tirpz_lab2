import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Payment from './Payment';
import { useSelectedPark } from '../../SelectedParkContext';
import translations from "../translations.json"
import { parkInvoices } from '../../http';
function translate(key) {
    return translations[key] || key;
}
function Calendar() {
    const { selectedParkId } = useSelectedPark();
    const [customersData, setCustomersData] = useState([]);
    const [invoicesCarsData, setInvoicesCarsData] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 20;
    const [filters, setFilters] = useState({ status: 'all' });
    const loader = useRef(null);

    const fetchData = async () => {
        if (loading) return;
        setLoading(true);

        let queryString = `limit=${limit}&offset=${offset}`;
        const filterParams = Object.keys(filters)
            .filter(key => filters[key] && filters[key] !== 'all')
            .map(key => `"${key}":"${encodeURIComponent(filters[key])}"`)
            .join('&');
        if (filterParams) {
            queryString += `&filters={${filterParams}}`;
        }
        const data = await parkInvoices(queryString)

        if (data.invoices && data.invoices.length > 0) {
            setCustomersData(prev => [...prev, ...data.invoices]);
            setOffset(prev => prev + 1);
        }
        if (data.car && data.car.length > 0) {
            setInvoicesCarsData(prev => [...prev, ...data.car]);
        }
    
        setLoading(false);
        
    };

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchData();
            }
        }, { rootMargin: '20px' });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, [loader.current, offset, selectedParkId, filters]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters({ ...filters, [name]: value });
        setOffset(0);
        setCustomersData([]);
        setInvoicesCarsData([]);
    };

    return (
        <>
            <Container>
                <Form.Select name="status" value={filters.status} onChange={handleFilterChange} style={{ width: "30%", fontSize: "1.2rem" }}>
                    <option value="all">{translate("All")}</option>
                    <option value="paid">{translate("Paid")}</option>
                    <option value="unpaid">{translate("Unpaid")}</option>
                </Form.Select>
                <Row>
                    {customersData.map((payment, index) => (
                        <Col key={index} sm={12} md={6} lg={4}>
                            <Payment {...payment} carData={invoicesCarsData[index]} />
                        </Col>
                    ))}
                </Row>
                <Row ref={loader}>
                    <Col className="text-center">
                        {loading ? "Loading..." : ""}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Calendar;
