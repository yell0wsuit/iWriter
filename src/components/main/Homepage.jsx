import React, { useState, useEffect } from "react";
import { Tabs, Tab, Card, Row, Col, Button, Modal, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { db, fetchAllProjects } from "../../utils/databaseOperations";
import TopNavBar from "../miscellaneous/TopNavBar";

function HomePage() {
    const [data, setData] = useState({ general: [], academic: [] });
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [projectsForLocation, setProjectsForLocation] = useState([]);

    const navigate = useNavigate();

    const loadProject = async (projectId) => {
        const project = await db.projects.get(projectId);
        if (project) {
            navigate(`/writing/${project.frameworkLocation}?tab=practice`, { state: { projectContent: project.content } });
        } else {
            console.log("No project found with ID:", projectId);
        }
        setShowLoadModal(false);
    };

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
            <TopNavBar />
            <Row className="mb-4 justify-content-center text-center">
                <Col md="auto">
                    <h1 className="fw-bold">Oxford iWriter</h1>
                </Col>
            </Row>
            <div className="mb-4">
                <Button onClick={() => fetchAllProjects(setProjectsForLocation, setShowLoadModal)}>Saved writings</Button>
            </div>
            <Tabs variant="underline" className="mb-3 d-flex justify-content-center">
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
                                                <Link to={`/writing/${item.list[listIndex].file}`}>{listItem.name}</Link>
                                            </Card.Text>
                                        ))}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>
                <Tab eventKey="academic" title="Academic Writing (beta)">
                    <p className="fw-bold">Select a model essay to get started.</p>
                    <Row xs={1} md={3} className="g-4 mt-1 d-flex justify-content-center">
                        {data.academic.map((item, index) => (
                            <Col key={index}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Header className="fw-semibold">{item.heading}</Card.Header>
                                    <Card.Body>
                                        {item.list.map((listItem, listIndex) => (
                                            <Card.Text key={listIndex}>
                                                <Link to={`/writing/${item.list[listIndex].file}`}>{listItem.name}</Link>
                                            </Card.Text>
                                        ))}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>
            </Tabs>
            <Modal show={showLoadModal} onHide={() => setShowLoadModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Load a project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {projectsForLocation.length > 0 ? (
                        <>
                            <ListGroup className="mb-3">
                                {projectsForLocation.map((project) => (
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center" key={project.id}>
                                        <div className="me-auto">
                                            <div>
                                                <Button variant="link" className="p-0" onClick={() => loadProject(project.id)}>
                                                    {project.projectName}
                                                </Button>
                                            </div>
                                            <div className="fst-italic text-secondary">Framework: {project.frameworkName}</div>
                                            <div className="">
                                                {new Date(project.date).toLocaleString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                })}
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </>
                    ) : (
                        <ListGroup>
                            <ListGroup.Item disabled>No project saved</ListGroup.Item>
                        </ListGroup>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLoadModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default HomePage;
