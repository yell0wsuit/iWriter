import React from "react";
import { Col, Accordion, Form } from "react-bootstrap";
import DOMPurify from "dompurify";

function StepByStep({ data, checkedStates, handleCheckboxChange, findParagraphs }) {
    const createMarkup = (htmlContent) => ({ __html: DOMPurify.sanitize(htmlContent) });
    return (
        <>
            <Col xs={{ order: 2 }} md={{ order: 1 }}>
                <p>Step-by-step tour of the model</p>
                <Accordion alwaysOpen>
                    {data.steps.map((step, index) => (
                        <Accordion.Item eventKey={index.toString()} key={index}>
                            <Accordion.Header key={index}>
                                <div key={index} className="fw-semibold">{step.label}</div>
                            </Accordion.Header>
                            <Accordion.Body>
                                {step.desc.map((desc, descIndex) => (
                                    <p key={`${index}-${descIndex}`} dangerouslySetInnerHTML={createMarkup(desc)}></p>
                                ))}
                                {step.filters.map((filter, filterIndex) => {
                                    const highlightKey = `step${index}_${filter.highlightClass}`;
                                    const isChecked = checkedStates[highlightKey];
                                    const labelClassName = isChecked ? filter.highlightClass : "";
                                    return (
                                        <Form.Check className="mb-2" key={filterIndex} id={`check-${index}-${filterIndex}`}>
                                            <Form.Check.Input
                                                type="checkbox"
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
        </>
    );
}

export default StepByStep;
