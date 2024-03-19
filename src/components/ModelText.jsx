import React from "react";
import { Button, Col, Accordion, Card } from "react-bootstrap";

function ModelText({ data, activeContents, toggleContent, createMarkup }) {
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

    return (
        <>
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
                                                        className={`text-danger ${paragraph.align === "right" ? "iwriter-align-right" : ""}`}>
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
                                        <>
                                            {paragraph.content.image && (
                                                <img src={`/images/model/${paragraph.content.image}`} alt="" className="img-fluid mb-2" />
                                            )}
                                            {paragraph.content.para.map((subParaArray, index) => (
                                                <div key={index} className="border-start border-3 px-2">
                                                <p
                                                    key={index}
                                                    className={`text-primary-emphasis iwriter-align-${paragraph.align === "right" ? "right" : ""}`}
                                                    dangerouslySetInnerHTML={createMarkup(subParaArray.map((para) => para.text).join(" "))}
                                                />
                                                </div>
                                            ))}
                                        </>
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
        </>
    );
}

export default ModelText;
