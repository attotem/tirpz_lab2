import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Service from './Service';
import moment from 'moment';
import translations from "../translations.json"
import { getAllCars, getAllServices } from '../../http';

function Calendar() {
    const loader = useRef(null);
    const limit = 10;
    const [payments, setPayments] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [cars, setCars] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [trigger, setTrigger] = useState(false);
    function translate(key) {
        return translations[key] || key;
    }

    const fetchCars = async () => {
        const data = await getAllCars()
        setCars(data);
    };

    const fetchData = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        let filters = {};
        if (selectedCarId) {
            filters["car_id"] = selectedCarId;
        }
        if (selectedStatus) {
            filters["status"] = selectedStatus;
        }

        const query = `limit=${limit}&offset=${offset}&filters=${encodeURIComponent(JSON.stringify(filters))}`;
        const data = await getAllServices(query)
        if (data.length === 0) {
            setHasMore(false);
        } else {
            const updatedPayments = { ...payments };
            data.forEach(item => {
                const month = moment(item.service.deadline).format('MMMM');
                if (!updatedPayments[month]) {
                    updatedPayments[month] = [];
                }
                updatedPayments[month].push(item);
            });
            setPayments(updatedPayments);
            setOffset(prevOffset => prevOffset + 1);
        }
        setLoading(false);
           
    };

    const handleCarSelect = (e) => {
        const carId = e.target.value;
        setSelectedCarId(carId);
        setPayments({});
        setHasMore(true);
        setOffset(0);
    };

    const handleStatusSelect = (e) => {
        const status = e.target.value;
        setSelectedStatus(status);
        setPayments({});
        setHasMore(true);
        setOffset(0);
    };

    useEffect(() => {
        fetchCars();
    }, []);

    useEffect(() => {
        console.log('Trigger changed:', trigger);
        fetchData();
    }, [trigger]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading && hasMore) {
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
    }, [loading, hasMore, payments]);

    return (
        <Container>
            <Form className='filters'>
                <Form.Select onChange={handleCarSelect} value={selectedCarId}>
                    <option value="">Všechny auta</option>
                    {cars.map(car => (
                        <option key={car.id} value={car.id}>{car.brand} {car.model}</option>
                    ))}
                </Form.Select>
                <Form.Select onChange={handleStatusSelect} value={selectedStatus}>
                    <option value="">Všechny statusy</option>
                    <option value="upcoming">Rezervované</option>
                    <option value="enroll">{translate("Enroll")}</option>
                    <option value="urgently">{translate("Urgently")}</option>
                </Form.Select>
            </Form>
            {Object.keys(payments).map((month, index) => (
                <React.Fragment key={month}>
                    <Row>
                        <Col><h2>{translate(month)}</h2></Col>
                    </Row>
                    <Row>
                        {payments[month].map((service, idx) => (
                            <Col key={idx} sm={12} md={6} lg={4}>
                                <Service {...service} setTrigger={setTrigger} trigger ={trigger}  />
                            </Col>
                        ))}
                    </Row>
                </React.Fragment>
            ))}
            <Row ref={loader}>
                <Col className="text-center">
                    {loading ? 'Loading...' : ''}
                </Col>
            </Row>
        </Container>
    );
}

export default Calendar;
