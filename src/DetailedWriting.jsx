import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, ButtonGroup, Tabs, Tab, Row, Col, Accordion, Form, Collapse, Card, Toast, ToastContainer, Modal, ListGroup } from "react-bootstrap";
import DOMPurify from "dompurify";
import useFetchJSONData from "./useFetchJSONData";
import { generateInitialCheckedStates } from "./utils";
import { db, saveProject, fetchProjectsForLocation } from "./databaseOperations";

function DetailedWriting() {
    const navigate = useNavigate();
    const { folder, file } = useParams();
    const data = useFetchJSONData(folder, file, navigate);

    const [projectName, setProjectName] = useState("");
    const [projectLocation, setProjectLocation] = useState(`${folder}_${file}` || "");
    const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
    const [activeContents, setActiveContents] = useState({
        structure: true,
        notes: true,
        content: true,
    });
    const [show, setShow] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isProjectNameValid, setIsProjectNameValid] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showNavigationWarningModal, setShowNavigationWarningModal] = useState(false);
    const [targetLocation, setTargetLocation] = useState(null); // To store the target location when trying to navigate away
    const [projectsForLocation, setProjectsForLocation] = useState([]);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [paragraphsData, setParagraphsData] = useState([]);
    const [toastMessage, setToastMessage] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const handleClose = () => setShow(false);
    const handleShowWriting = () => setShow(true);

    const [checkedStates, setCheckedStates] = useState({});

    useEffect(() => {
        if (data && data.paragraphs) {
            const contentAvailability = {
                structure: data.paragraphs.some((p) => p.structure && p.structure.para.length > 0),
                notes: data.paragraphs.some((p) => p.notes && p.notes.para.length > 0),
                content: data.paragraphs.some((p) => p.content && p.content.para.length > 0),
            };
            setActiveContents(contentAvailability);
        }
    }, [data]);

    useEffect(() => {
        if (data) {
            const initialState = generateInitialCheckedStates(data.steps);
            setCheckedStates(initialState);
        }
    }, [data]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (hasUnsavedChanges) {
                // Most modern browsers ignore custom messages and show their default message for beforeunload events
                event.preventDefault();
                event.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    useEffect(() => {
        if (data && data.paragraphs) {
            const initialParagraphsData = data.paragraphs.map((paragraph) => ({
                notes: paragraph.notes?.content || "",
                content: paragraph.content?.content || "",
            }));
            setParagraphsData(initialParagraphsData);
        }
    }, [data]);

    if (!data) return <div>Loading...</div>;

    const handleCheckboxChange = (stepIndex, highlightClass, isChecked) => {
        const key = `step${stepIndex}_${highlightClass}`;
        setCheckedStates((prev) => ({ ...prev, [key]: isChecked }));
    };

    /* Step-by-step tab */

    const createMarkup = (htmlContent) => ({ __html: DOMPurify.sanitize(htmlContent) });

    const renderParagraphText = (para, className, alignClass, stepFilters, stepIndex) => {
        return (
            <div className={`border-3 border-start px-2 ${className}`}>
                {para.map((paraGroup, index) => (
                    <p key={index} className={`${className} ${alignClass}`}>
                        {paraGroup.map((item, itemIndex) => {
                            const highlightClassKeys = stepFilters.map((filter) => `step${stepIndex}_${filter.highlightClass}`);
                            const isHighlighted = highlightClassKeys.some(
                                (key) =>
                                    checkedStates[key] &&
                                    stepFilters
                                        .find((filter) => `step${stepIndex}_${filter.highlightClass}` === key)
                                        .highlightPara.includes(item.id.toString())
                            );
                            const highlightClass = isHighlighted
                                ? stepFilters.find(
                                      (filter) =>
                                          checkedStates[`step${stepIndex}_${filter.highlightClass}`] &&
                                          filter.highlightPara.includes(item.id.toString())
                                  ).highlightClass
                                : "";
                            return <span key={itemIndex} className={highlightClass} dangerouslySetInnerHTML={createMarkup(item.text)}></span>;
                        })}
                    </p>
                ))}
            </div>
        );
    };

    const renderParagraphsInSection = (paras, className, alignClass) => {
        return (
            <div className={`border-3 border-start px-2 border${className}`}>
                {paras.map((p, index) =>
                    // Check if paragraph has tip property to conditionally render without className
                    p.tip ? (
                        <p key={index}>{p.text}</p>
                    ) : (
                        <p key={index} className={`text${className} ${alignClass}`}>
                            {p.text}
                        </p>
                    )
                )}
            </div>
        );
    };

    const findParagraphs = (ids, data, stepFilters, index) => {
        let paragraphs = [];
        data.paragraphs.forEach((para) => {
            const alignClass = para.align === "right" ? "iwriter-align-right" : "";
            // Group and render all paragraphs in structure and notes sections
            ["structure", "notes"].forEach((section) => {
                if (para[section] && para[section].para.length > 0) {
                    // Check if any paragraph in the section matches the ids, if so, group all paragraphs
                    const hasMatchingId = para[section].para.some((p) => ids.includes(p.id));
                    if (hasMatchingId) {
                        const className = section === "structure" ? "-danger" : "-success fst-italic";
                        // Exclude tips from being rendered
                        const filteredParas = para[section].para.filter((p) => !p.tip);
                        paragraphs.push(renderParagraphsInSection(filteredParas, className, alignClass));
                    }
                }
            });

            // Directly handle content section with matching id
            if (para.content && ids.includes(para.content.id)) {
                // Add image to paragraphs array if exists
                if (para.content.image) {
                    paragraphs.push(
                        <img key={para.content.id} src={`/images/model/${para.content.image}`} alt={para.content.imgAlt} className="img-fluid mb-3" />
                    );
                }
                paragraphs.push(renderParagraphText(para.content.para, "text-primary-emphasis", alignClass, stepFilters, index));
            }
        });

        return paragraphs;
    };

    /* Model tab */

    const buttonVariant = (contentType) => {
        const isActive = activeContents[contentType];
        const isEmpty = !data.paragraphs.some((p) => p[contentType].para.length);
        if (isEmpty) {
            return "outline-secondary"; // Indicates no content available
        } else if (isActive) {
            return contentType === "structure" ? "danger" : contentType === "notes" ? "success" : "primary";
        } else {
            return "outline-" + (contentType === "structure" ? "danger" : contentType === "notes" ? "success" : "primary");
        }
    };

    const toggleContent = (contentType) => {
        setActiveContents((prevState) => ({
            ...prevState,
            [contentType]: !prevState[contentType],
        }));
    };

    /* Tell me more */

    const TellMeMore = ({ text }) => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button variant="link" onClick={() => setOpen(!open)} aria-controls="collapse-text" aria-expanded={open}>
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

    /* "Unsaved changes" dialog */

    const handleNavigationAttempt = (navCallback) => () => {
        if (hasUnsavedChanges) {
            setShowNavigationWarningModal(true);
            // Store the navigation callback to use if the user confirms they want to leave
            setTargetLocation(() => navCallback);
        } else {
            navCallback(); // No unsaved changes, execute the navigation callback directly
        }
    };

    const confirmNavigation = () => {
        setShowNavigationWarningModal(false);
        setHasUnsavedChanges(false); // Assume changes are saved or discarded
        if (typeof targetLocation === "function") {
            targetLocation(); // Execute the stored navigation callback
        }
    };

    /* Save functionality */

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

    /* Load functionality */

    const handleParagraphChange = (index, field, value) => {
        setParagraphsData((currentData) => currentData.map((paragraph, i) => (i === index ? { ...paragraph, [field]: value } : paragraph)));
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

    /* Delete */
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
            <Button className="my-4" onClick={handleNavigationAttempt(() => navigate("/"))}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-left me-1"
                    viewBox="0 0 16 16">
                    <path
                        fillRule="evenodd"
                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                    />
                </svg>
                Go back
            </Button>
            <h3 className="mb-3">{data.title}</h3>
            <Tabs fill defaultActiveKey="modelText" variant="underline" className="mb-3 d-flex justify-content-center">
                <Tab eventKey="modelText" title="Model text">
                    <Row className="g-4">
                        <Col xs={{ order: 2 }} md={{ order: 1 }}>
                            Showing:{" "}
                            <Button
                                variant={buttonVariant("structure")}
                                onClick={() => toggleContent("structure")}
                                disabled={!activeContents.structure && !data.paragraphs.some((p) => p.structure.para.length)}>
                                Structure
                            </Button>{" "}
                            <Button
                                variant={buttonVariant("notes")}
                                onClick={() => toggleContent("notes")}
                                disabled={!activeContents.notes && !data.paragraphs.some((p) => p.notes.para.length)}>
                                Notes
                            </Button>{" "}
                            <Button
                                variant={buttonVariant("content")}
                                onClick={() => toggleContent("content")}
                                disabled={!activeContents.content && !data.paragraphs.some((p) => p.content.para.length)}>
                                Content
                            </Button>
                            <Card className="mt-4">
                                <Card.Body>
                                    {data &&
                                        data.paragraphs.map((paragraph, index) => (
                                            <React.Fragment key={index}>
                                                {activeContents.structure && paragraph.structure.para.length > 0 && (
                                                    <div className="border-start border-danger border-3 px-2">
                                                        {paragraph.structure.para
                                                            .filter((para) => !para.tip)
                                                            .map((para, paraIndex) => (
                                                                <p
                                                                    key={`structure-${index}-${paraIndex}`}
                                                                    className={`mb-2 text-danger ${
                                                                        paragraph.align === "right" ? "iwriter-align-right" : ""
                                                                    }`}>
                                                                    {para.text}
                                                                </p>
                                                            ))}
                                                    </div>
                                                )}
                                                {activeContents.notes && paragraph.notes.para.length > 0 && (
                                                    <div className="border-start border-success border-3 px-2">
                                                        {paragraph.notes.para
                                                            .filter((para) => !para.tip)
                                                            .map((para, paraIndex) => (
                                                                <p
                                                                    key={`notes-${index}-${paraIndex}`}
                                                                    className={`text-success fst-italic iwriter-align-${
                                                                        paragraph.align === "right" ? "right" : ""
                                                                    }`}>
                                                                    {para.text}
                                                                </p>
                                                            ))}
                                                    </div>
                                                )}
                                                {activeContents.content && paragraph.content.para.length > 0 && !paragraph.content.duplicate && (
                                                    <div className="border-start border-3 px-2">
                                                        {paragraph.content.image && (
                                                            <img src={`/images/model/${paragraph.content.image}`} alt="" className="img-fluid mb-2" />
                                                        )}
                                                        {paragraph.content.para.map((subParaArray, index) => (
                                                            // Join subParaArray texts with a space and sanitize the HTML content
                                                            <p
                                                                key={index}
                                                                className={`text-primary-emphasis iwriter-align-${
                                                                    paragraph.align === "right" ? "right" : ""
                                                                }`}
                                                                dangerouslySetInnerHTML={createMarkup(
                                                                    subParaArray.map((para) => para.text).join(" ")
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={{ order: 1 }} md={{ span: 4, order: 2 }}>
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <div className="fw-bold">Next steps</div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <ul>
                                            <li>
                                                <p>Read the model text.</p>
                                            </li>
                                            <li>
                                                <p>Use the buttons to show/hide the structure, notes, etc. for this model text.</p>
                                            </li>
                                            <li>
                                                <p>
                                                    Open the <strong>Step-by-step</strong> tab to look at the model text in more detail.
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    Open the <strong>Practice Writing</strong> tab to start writing your own text.
                                                </p>
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="step" title="Step by step">
                    <Row className="g-4">
                        <Col xs={{ order: 2 }} md={{ order: 1 }}>
                            <p>Step-by-step tour of the model</p>
                            <Accordion alwaysOpen>
                                {data.steps.map((step, index) => (
                                    <Accordion.Item eventKey={index.toString()} key={index}>
                                        <Accordion.Header>
                                            <div className="fw-semibold">{step.label}</div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {step.desc.map((desc, descIndex) => (
                                                <p key={descIndex} dangerouslySetInnerHTML={createMarkup(desc)}></p>
                                            ))}
                                            {step.filters.map((filter, filterIndex) => {
                                                const highlightKey = `step${index}_${filter.highlightClass}`;
                                                const isChecked = checkedStates[highlightKey];
                                                const labelClassName = isChecked ? filter.highlightClass : "";

                                                return (
                                                    <Form.Check className="mb-2" key={filterIndex} id={`check-${index}-${filterIndex}`}>
                                                        <Form.Check.Input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={(e) => handleCheckboxChange(index, filter.highlightClass, e.target.checked)}
                                                        />
                                                        <Form.Check.Label>
                                                            <span className={labelClassName}>{filter.label}</span>
                                                        </Form.Check.Label>
                                                    </Form.Check>
                                                );
                                            })}

                                            {step.showParas && findParagraphs(step.showParas, data, step.filters, index)}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Col>
                        <Col xs={{ order: 1 }} md={{ span: 4, order: 2 }}>
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <div className="fw-bold">Next steps</div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <ul>
                                            <li>
                                                <p>Expand the sections on this tab to look at the model text in more detail.</p>
                                            </li>
                                            <li>
                                                <p>
                                                    Go back to the <strong>Model text</strong> tab, or...
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                    Open the <strong>Practice Writing</strong> tab to start writing your own text.
                                                </p>
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="practice" title="Practice writing">
                    <Row className="g-4">
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
                            <Button
                                className="mb-4 me-2"
                                onClick={() => fetchProjectsForLocation(projectLocation, setProjectsForLocation, setShowLoadModal)}>
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
                                                    <p key={idx}>{p.text}</p>
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
                                                            onChange={(e) => handleParagraphChange(index, "notes", e.target.value)}
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
                                                            onChange={(e) => handleParagraphChange(index, "content", e.target.value)}
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
                            <Accordion>
                                {data.practice_rubric.map((section, index) => (
                                    <Accordion.Item eventKey={`${index}`} key={index}>
                                        <Accordion.Header>
                                            <div className="fw-bold">{section.header}</div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Form>
                                                {section.checkList.map((item, itemIndex) => (
                                                    <Form.Check id={`check-${index}-${itemIndex}`} key={itemIndex}>
                                                        <Form.Check.Input type="checkbox" />
                                                        <Form.Check.Label>
                                                            <span>{item.text}</span>
                                                            <>{item.tellMeMore && <TellMeMore text={item.tellMeMore} />}</>
                                                        </Form.Check.Label>
                                                    </Form.Check>
                                                ))}
                                            </Form>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
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
            <Modal show={showNavigationWarningModal} onHide={() => setShowNavigationWarningModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Unsaved Changes</Modal.Title>
                </Modal.Header>
                <Modal.Body>You have unsaved changes, are you sure you want to leave?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowNavigationWarningModal(false)}>
                        Stay on page
                    </Button>
                    <Button variant="primary" onClick={confirmNavigation}>
                        Leave page
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showLoadModal} onHide={() => setShowLoadModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Load project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {projectsForLocation.length > 0 ? (
                        <ListGroup className="mb-3">
                            {projectsForLocation.map((project) => (
                                <ListGroup.Item className="d-flex justify-content-between align-items-center" key={project.id}>
                                    <div className="me-auto">
                                        <div>
                                            <a href="#" onClick={() => loadProject(project.id)}>
                                                {project.projectName}
                                            </a>
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
            <ToastContainer className="p-3 position-fixed bottom-0 start-50 translate-middle-x" style={{ zIndex: 1 }}>
                <Toast className="text-bg-secondary" onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}

export default DetailedWriting;
