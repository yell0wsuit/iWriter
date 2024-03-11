import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tabs, Tab, Row, Col, Accordion, Form, Collapse, Card } from "react-bootstrap";
import NProgress from "nprogress";
import DOMPurify from "dompurify";

function DetailedWriting() {
    const [data, setData] = useState(null);
    const { folder, file } = useParams();
    const navigate = useNavigate();
    const [activeContents, setActiveContents] = useState({
        structure: true,
        notes: true,
        content: true,
    });

    const generateInitialCheckedStates = (steps) => {
        const initialState = {};
        steps.forEach((step, stepIndex) => {
            step.filters.forEach((filter) => {
                const key = `step${stepIndex}_${filter.highlightClass}`;
                initialState[key] = false;
            });
        });
        return initialState;
    };

    const [checkedStates, setCheckedStates] = useState({});

    useEffect(() => {
        NProgress.start();
        const filePath = `/json/${folder}/${file}.json`; // Adjust if your structure differs
        fetch(filePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                NProgress.done();
            })
            .catch((error) => {
                console.error("Fetch error: ", error.message);
                NProgress.done();
                navigate("/"); // Redirect to homepage on error
            });
    }, [folder, file, navigate]);

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

    if (!data) return <div>Loading...</div>;

    const handleCheckboxChange = (stepIndex, highlightClass, isChecked) => {
        const key = `step${stepIndex}_${highlightClass}`;
        setCheckedStates((prev) => ({ ...prev, [key]: isChecked }));
    };

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

    const TellMeMore = ({ text }) => {
        const [open, setOpen] = useState(false);

        return (
            <>
                <Button variant="link" onClick={() => setOpen(!open)} aria-controls="collapse-text" aria-expanded={open}>
                    Tell me more
                </Button>
                <Collapse in={open}>
                    <Card className="mt-3">
                        <Card.Body>
                            <div dangerouslySetInnerHTML={createMarkup(text)} />
                        </Card.Body>
                    </Card>
                </Collapse>
            </>
        );
    };

    const setupIndexedDB = () => {
        const request = indexedDB.open("iWriter", 1);

        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.errorCode);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Create an object store with a generic name, such as 'projects'
            // Use a keyPath that combines folder and file for uniqueness
            if (!db.objectStoreNames.contains("projects")) {
                db.createObjectStore("projects", { keyPath: "id" });
            }
        };
    };

    setupIndexedDB();

    const saveData = (folder, file, content) => {
        const id = `${folder}/${file}`;
        const data = { id, content };

        const request = indexedDB.open("iWriter", 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["projects"], "readwrite");
            const store = transaction.objectStore("projects");
            store.put(data);
        };
    };

    // Function to load data
    const loadData = (folder, file, setDataCallback) => {
        const id = `${folder}/${file}`;

        const request = indexedDB.open("iWriter", 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["projects"], "readonly");
            const store = transaction.objectStore("projects");
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    setDataCallback(getRequest.result.content);
                } else {
                    console.log("No data found for:", id);
                }
            };
        };
    };

    const handleNotesChange = (value, paragraphIndex) => {
        // Update notes content for a specific paragraph
        const newData = { ...data };
        newData.paragraphs[paragraphIndex].notes.content = value;
        setData(newData);
    };

    const handleContentChange = (value, paragraphIndex) => {
        // Update notes content for a specific paragraph
        const newData = { ...data };
        newData.paragraphs[paragraphIndex].content.content = value;
        setData(newData);
    };

    return (
        <>
            <Button className="my-4" onClick={() => navigate(-1)}>
                Go Back
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
                                                <div className="border-3 border-start px-2 border-success">
                                                    <div
                                                        contenteditable="true"
                                                        rows={1}
                                                        className="form-control text-success fst-italic mb-2"
                                                        type="text"
                                                        placeholder={paragraph.notes.placeHolder}
                                                    />
                                                </div>
                                            )}
                                            {paragraph.content.placeHolder && !paragraph.content.duplicate && (
                                                <div className="border-3 border-start px-2">
                                                    <div
                                                        contenteditable="true"
                                                        rows={1}
                                                        className="form-control text-primary-emphasis"
                                                        type="text"
                                                        placeholder={paragraph.content.placeHolder}
                                                    />
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
                                                            <p>{item.tellMeMore && <TellMeMore text={item.tellMeMore} />}</p>
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
        </>
    );
}

export default DetailedWriting;
