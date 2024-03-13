import React, { useState, useEffect } from "react";
import { Tabs, Tab, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { db } from "./databaseOperations";

function HomePage() {
    const [data, setData] = useState({ general: [], academic: [] });

    useEffect(() => {
        NProgress.start();
        fetch("/json/homepage.json")
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                NProgress.done();
            })
            .catch(() => {
                NProgress.done();
            });
    }, []);

    return (
        <>
            <Row className="mb-4 justify-content-center text-center">
                <Col md="auto">
                    <h1 className="fw-bold">Oxford iWriter</h1>
                </Col>
            </Row>
            <Tabs defaultActiveKey="general" variant="underline" className="mb-3 d-flex justify-content-center">
                <Tab eventKey="general" title="General Writing">
                    <p className="fw-bold">Select a model essay to get started.</p>
                    <Row xs={1} md={3} className="g-4 mt-1 d-flex justify-content-center">
                        {data.general.map((item, index) => (
                            <Col key={index}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Header className="fw-semibold">{item.heading}</Card.Header>
                                    <Card.Body>
                                        {item.list.map((listItem, listIndex) => (
                                            <Card.Text key={listIndex}>
                                                <Link to={`/writing/${(item.list[listIndex].file)}`}>{listItem.name}</Link>
                                            </Card.Text>
                                        ))}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>
                <Tab eventKey="academic" title="Academic Writing (coming soon)">
                    <p className="fw-bold">Select a model essay to get started.</p>
                    <Row xs={1} md={3} className="g-4 mt-1 d-flex justify-content-center">
                        {data.academic.map((item, index) => (
                            <Col key={index}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Header className="fw-semibold">{item.heading}</Card.Header>
                                    <Card.Body>
                                        {item.list.map((listItem, listIndex) => (
                                            <Card.Text key={listIndex}>{listItem.name}</Card.Text>
                                        ))}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>
            </Tabs>
        </>
    );
}

export default HomePage;
