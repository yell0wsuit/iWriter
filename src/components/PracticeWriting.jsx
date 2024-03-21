import React, { useState } from "react";
import { Button, Col, Card, Accordion, Modal, Form, ListGroup, Collapse, Toast, ToastContainer } from "react-bootstrap";
import { db, saveProject, fetchProjectsForLocation } from "../databaseOperations";

function PracticeWriting({ folder, file, data, setHasUnsavedChanges, paragraphsData, setParagraphsData, createMarkup }) {
    const [show, setShow] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [projectsForLocation, setProjectsForLocation] = useState([]);
    const [projectName, setProjectName] = useState("");
    const [isProjectNameValid, setIsProjectNameValid] = useState(true);
    const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleClose = () => setShow(false);
    const projectLocation = `${folder}_${file}`;
    const handleShowWriting = () => setShow(true);

    const TellMeMore = ({ text }) => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button variant="warning" onClick={() => setOpen(!open)} aria-controls="collapse-text" aria-expanded={open}>
                    Tell me more
                </Button>
                <Collapse in={open}>
                    <div>
                        <Card className="mt-3">
                            <Card.Body>
                                <div dangerouslySetInnerHTML={createMarkup(text)} />
                            </Card.Body>
                        </Card>
                    </div>
                </Collapse>
            </>
        );
    };

    const handleParagraphChange = (index, field, value, event) => {
        setParagraphsData((currentData) => currentData.map((paragraph, i) => (i === index ? { ...paragraph, [field]: value } : paragraph)));
        setHasUnsavedChanges(true);

        // Auto expand textboxes
        const eventTarget = event.target;
        eventTarget.style.height = "inherit";
        eventTarget.style.height = `${eventTarget.scrollHeight}px`;
    };

    const handleSaveClick = async () => {
        if (!projectName.trim()) {
            setIsProjectNameValid(false);
            return;
        }

        // Check if a project with the same name exists
        const existingProject = await db.projects.where("[projectName+projectLocation]").equals([projectName, projectLocation]).first();
        if (existingProject) {
            // Show overwrite confirmation modal
            setShowOverwriteConfirm(true);
        } else {
            // No existing project found, proceed with saving
            saveProject({
                projectName,
                projectLocation,
                paragraphsData,
                setToastMessage,
                setShowToast,
                handleClose,
            });
        }
    };

    const applyLoadedContentToTextboxes = (loadedContent) => {
        const loadedParagraphsData = loadedContent.map((paragraph) => ({
            notes: paragraph.notes || "",
            content: paragraph.content || "",
        }));
        setParagraphsData(loadedParagraphsData);
    };

    const loadProject = async (projectId) => {
        const project = await db.projects.get(projectId);
        if (project) {
            applyLoadedContentToTextboxes(project.content);
            setToastMessage(`Project "${project.projectName}" loaded successfully.`);
            setShowToast(true);
        } else {
            console.log("No project found with ID:", projectId);
        }
        setShowLoadModal(false);
    };

    const handleOverwriteConfirm = () => {
        saveProject({
            projectName,
            projectLocation,
            paragraphsData,
            setToastMessage,
            setShowToast,
            handleClose,
        });
        setShowOverwriteConfirm(false);
    };

    const deleteProject = async () => {
        if (projectToDelete) {
            await db.projects.delete(projectToDelete.id);
            setShowDeleteConfirm(false);
            setProjectToDelete(null);
            setToastMessage(`Project "${projectToDelete.name}" has been deleted.`);
            setShowToast(true);
            // Refresh the list
            fetchProjectsForLocation(projectLocation, setProjectsForLocation, setShowLoadModal);
        }
    };

    return (
        <>
            <Col xs={{ order: 2 }} md={{ order: 1 }}>
                <Button className="mb-4 me-2" onClick={handleShowWriting}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-floppy me-1"
                        viewBox="0 0 16 16">
                        <path d="M11 2H9v3h2z" />
                        <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
                    </svg>
                    Save writing
                </Button>
                <Button className="mb-4 me-2" onClick={() => fetchProjectsForLocation(projectLocation, setProjectsForLocation, setShowLoadModal)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-folder2-open me-1"
                        viewBox="0 0 16 16">
                        <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z" />
                    </svg>
                    Load saved writing
                </Button>
                <Card className="mb-3">
                    <Card.Body>
                        {data.paragraphs.map((paragraph, index) => (
                            <div key={index} className="mb-3">
                                <div className="text-danger border-3 border-start px-2 border-danger">
                                    {paragraph.structure.para.map((p, idx) => (
                                        <p key={idx} dangerouslySetInnerHTML={createMarkup(p.text)}></p>
                                    ))}
                                </div>
                                {paragraph.notes.placeHolder && (
                                    <div className="border-3 border-start px-2 border-success mb-3">
                                        <Form>
                                            <Form.Control
                                                className="text-success fst-italic"
                                                as="textarea"
                                                rows={1}
                                                placeholder={paragraph.notes.placeHolder}
                                                value={paragraphsData[index]?.notes || ""} // Bind value to state
                                                onChange={(e) => handleParagraphChange(index, "notes", e.target.value, e)}
                                            />
                                        </Form>
                                    </div>
                                )}
                                {paragraph.content.placeHolder && !paragraph.content.duplicate && (
                                    <div className="border-3 border-start px-2">
                                        <Form>
                                            <Form.Control
                                                className="text-primary-emphasis"
                                                as="textarea"
                                                rows={3}
                                                placeholder={paragraph.content.placeHolder}
                                                value={paragraphsData[index]?.content || ""} // Bind value to state
                                                onChange={(e) => handleParagraphChange(index, "content", e.target.value, e)}
                                            />
                                        </Form>
                                    </div>
                                )}
                            </div>
                        ))}
                    </Card.Body>
                </Card>
            </Col>
            <Col xs={{ order: 1 }} md={{ span: 4, order: 2 }}>
                <Accordion defaultActiveKey="0" className="mb-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <div className="fw-bold">Next steps</div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <ul>
                                <li>
                                    <p>Use the buttons to show/hide the different elements of this framework.</p>
                                </li>
                                <li>
                                    <p>Write your text and/or looking back at the model.</p>
                                </li>
                                <li>
                                    <p>
                                        Expand the <strong>Tips</strong> sections for more help on writing this type of text.
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Go back to the <strong>Model text</strong> or the <strong>Step-by-step</strong> tab.
                                    </p>
                                </li>
                            </ul>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <hr />
                <h4>Tips</h4>
                <Accordion>
                    {data.practice_rubric.map((section, index) => (
                        <Accordion.Item eventKey={`${index}`} key={index}>
                            <Accordion.Header>
                                <div className="fw-bold">{section.header}</div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Form>
                                    {section.checkList.map((item, itemIndex) => (
                                        <Form.Check id={`checkPractice-${index}-${itemIndex}`} key={itemIndex} className="mb-2">
                                            <Form.Check.Input type="checkbox" />
                                            <Form.Check.Label className="mb-2">{item.text}</Form.Check.Label>
                                            <div>{item.tellMeMore && <TellMeMore text={item.tellMeMore} />}</div>
                                        </Form.Check>
                                    ))}
                                </Form>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Col>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Save your writing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Enter project name:</Form.Label>
                        <Form.Control
                            isInvalid={!isProjectNameValid}
                            value={projectName}
                            onChange={(e) => {
                                setProjectName(e.target.value);
                                if (!isProjectNameValid) setIsProjectNameValid(true); // Reset validation on user input
                            }}
                            placeholder="Project name..."
                        />
                        {!isProjectNameValid && <Form.Control.Feedback type="invalid">Project name cannot be empty or blank.</Form.Control.Feedback>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSaveClick}>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showOverwriteConfirm} onHide={() => setShowOverwriteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm overwrite?</Modal.Title>
                </Modal.Header>
                <Modal.Body>A project with this name already exists. Do you want to overwrite it?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowOverwriteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleOverwriteConfirm}>
                        Overwrite
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showLoadModal} onHide={() => setShowLoadModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Load project</Modal.Title>
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
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => {
                                                setShowDeleteConfirm(true);
                                                setProjectToDelete({ id: project.id, name: project.projectName });
                                            }}>
                                            Delete
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <p className="text-danger mb-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-exclamation-triangle me-1"
                                    viewBox="0 0 16 16">
                                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                                </svg>
                                Remember to save your current work—if needed—before loading.
                            </p>
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

            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this project? This action is irreversible.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => deleteProject()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer className="p-3 position-fixed bottom-0 start-50 translate-middle-x">
                <Toast className="text-bg-secondary" onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}

export default PracticeWriting;
