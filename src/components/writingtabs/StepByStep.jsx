import React from "react";
import { Col, Accordion, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

function StepByStep({ data, checkedStates, handleCheckboxChange, createMarkup }) {

    const renderParagraphText = (para, className, alignClass, stepFilters, stepIndex, callId) => {
        return (
            <div key={`${stepIndex}-${callId}`} className={`border-3 border-start px-2 ${className}`}>
                {para.map((paraGroup, index) => (
                    <p key={`step${stepIndex}-paraGroup${index}-${callId}`} className={`${className} ${alignClass}`}>
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
                            return (
                                <span
                                    key={`step${stepIndex}-paraGroup${index}-item${itemIndex}`}
                                    className={highlightClass}
                                    dangerouslySetInnerHTML={createMarkup(item.text)}></span>
                            );
                        })}
                    </p>
                ))}
            </div>
        );
    };

    const renderParagraphsInSection = (paras, className, alignClass, sectionIndex) => {
        const key = uuidv4();
        return (
            <div key={key} className={`border-3 border-start px-2 border${className}`}>
                {paras.map((p, index) =>
                    // Check if paragraph has tip property to conditionally render without className
                    p.tip ? (
                        <p key={`section${sectionIndex}-p${index}-${p.id}`}>{p.text}</p>
                    ) : (
                        <p key={`section${sectionIndex}-p${index}-${p.id}`} className={`text${className} ${alignClass}`}>
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
                        paragraphs.push(renderParagraphsInSection(filteredParas, className, alignClass, index));
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
                paragraphs.push(renderParagraphText(para.content.para, "text-primary-emphasis", alignClass, stepFilters, index, para.content.id));
            }
        });

        return paragraphs;
    };

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
