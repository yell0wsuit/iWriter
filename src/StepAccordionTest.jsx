import React, { useState } from "react";
import { Accordion, Card, Form } from "react-bootstrap";
import DOMPurify from "dompurify";

const data = {
    heading: "Describing graphs",
    paragraphs: [
        {
            structure: {
                para: [
                    {
                        id: "2",
                        text: "Question",
                    },
                ],
            },
            notes: {
                para: [],
            },
            content: {
                para: [
                    [
                        {
                            id: "3",
                            text: "Summarize the information in the graph by selecting and reporting the main features and make comparisons where relevant.",
                        },
                    ],
                ],
                image: "electricity_graph",
                id: "3",
                placeHolder: "Type your question here",
                userInput: "",
            },
            align: "left",
        },
        {
            structure: {
                para: [
                    {
                        id: "5",
                        text: "Introduction",
                    },
                    {
                        id: "6",
                        text: "Describe the subject of the data.",
                    },
                ],
            },
            notes: {
                para: [
                    {
                        id: "7",
                        text: "Chart: percentage of UK electricity 2011-2015 supplied by renewables, gas, coal, nuclear and other",
                    },
                ],
                placeHolder: "Type your notes here",
                id: "7",
                userInput: "",
            },
            content: {
                para: [
                    [
                        {
                            id: "8",
                            text: "The chart ",
                        },
                        {
                            id: "9",
                            text: "shows",
                        },
                        {
                            id: "8",
                            text: " the ",
                        },
                        {
                            id: "10",
                            text: "percentage of",
                        },
                        {
                            id: "8",
                            text: " electricity supplied by five types of energy source in the UK ",
                        },
                        {
                            id: "11",
                            text: "between",
                        },
                        {
                            id: "8",
                            text: " 2011 ",
                        },
                        {
                            id: "11",
                            text: "and",
                        },
                        {
                            id: "8",
                            text: " 2015: renewables (solar, wind, tidal and hydro), gas, coal, nuclear, and other sources (e.g. biofuels).",
                        },
                    ],
                ],
                placeHolder: "Type your introduction here",
                userInput: "",
                id: "8",
            },
            align: "left",
        },
        {
            structure: {
                para: [
                    {
                        id: "13",
                        text: "Development",
                    },
                    {
                        id: "14",
                        text: "Make a general comment on the trends shown in the data and explain the main trend with supporting detail.",
                    },
                ],
            },
            notes: {
                para: [
                    {
                        id: "15",
                        text: "Level of all types of supply changed.",
                    },
                    {
                        id: "15",
                        text: "Renewables: biggest change—from 10% of total to 25%",
                    },
                ],
                placeHolder: "Type your notes here",
                id: "15",
                userInput: "",
            },
            content: {
                para: [
                    [
                        {
                            id: "16",
                            text: "In this period all five types of supply ",
                        },
                        {
                            id: "17",
                            text: "changed",
                        },
                        {
                            id: "16",
                            text: " to some extent, but ",
                        },
                        {
                            id: "58",
                            text: "the most significant change",
                        },
                        {
                            id: "16",
                            text: " was in the renewable category. At the beginning of the period the percentage of electricity supplied by renewables was ",
                        },
                        {
                            id: "18",
                            text: "the second lowest",
                        },
                        {
                            id: "16",
                            text: " at just under 10 per cent. Over the four-year period this ",
                        },
                        {
                            id: "19",
                            text: "more than doubled",
                        },
                        {
                            id: "16",
                            text: " to 25 per cent. This made it the ",
                        },
                        {
                            id: "20",
                            text: "second most common",
                        },
                        {
                            id: "16",
                            text: " source of electricity after gas, which in 2015 supplied 30 per cent of the market.",
                        },
                    ],
                ],
                placeHolder: "Type your paragraph here",
                userInput: "",
                id: "16",
            },
            align: "left",
        },
        {
            structure: {
                para: [],
            },
            notes: {
                para: [],
            },
            content: {
                para: [
                    [
                        {
                            id: "52",
                            text: "In this period all five types of supply changed to some extent, but the most significant change was in the renewable category.",
                        },
                        {
                            id: "51",
                            text: " ",
                        },
                        {
                            id: "53",
                            text: "At the beginning of the period the percentage of electricity supplied by renewables was the second lowest at just under 10 per cent. Over the four-year period this more than doubled to 25 per cent. This made it the second most common source of electricity after gas, which in 2015 supplied 30 per cent of the market.",
                        },
                    ],
                ],
                placeHolder: "Type your paragraph here",
                userInput: "",
                id: "51",
                duplicate: true,
            },
            align: "left",
        },
        {
            structure: {
                para: [
                    {
                        id: "24",
                        text: "Comparing and contrasting trends",
                    },
                    {
                        id: "25",
                        text: "Explain other similar trends and give details. Compare and contrast these trends with others.",
                    },
                    {
                        text: "TIP The number of paragraphs you use will depend on the amount of data you are writing about.",
                        tip: true,
                    },
                ],
            },
            notes: {
                para: [
                    {
                        id: "26",
                        text: "Gas most common but fell (40% to 30%). Coal fell most (39% to 23%). Nuclear rose (19% to 21%).",
                    },
                    {
                        id: "26",
                        text: "Nuclear will soon overtake coal.",
                    },
                    {
                        id: "26",
                        text: "Biofuels remained low with little change.",
                    },
                ],
                placeHolder: "Type your notes here",
                id: "26",
                userInput: "",
            },
            content: {
                para: [
                    [
                        {
                            id: "27",
                            text: "ddOsver the whole period gas remained the most common source of electricity. However, the percentage it supplied ",
                        },
                        {
                            id: "28",
                            text: "dropped",
                        },
                        {
                            id: "27",
                            text: " from 40 per cent to 30 per cent, having ",
                        },
                        {
                            id: "28",
                            text: "fallen to a low of",
                        },
                        {
                            id: "27",
                            text: " 27 per cent in 2013. The other category that fell over the same period was coal, which had ",
                        },
                        {
                            id: "28",
                            text: "the most dramatic fall",
                        },
                        {
                            id: "27",
                            text: " from 39 per cent in 2012 to 23 per cent in 2015. At the same time the percentage of nuclear power ",
                        },
                        {
                            id: "28",
                            text: "went up slightly",
                        },
                        {
                            id: "27",
                            text: ", from 19 per cent to 21 per cent. If these trends in coal and nuclear supply continue, nuclear will overtake coal in the next few years. Other sources of electricity such as biofuels  ",
                        },
                        {
                            id: "28",
                            text: "remained at a relatively low percentage",
                        },
                        {
                            id: "27",
                            text: " and ",
                        },
                        {
                            id: "28",
                            text: "did not change significantly",
                        },
                        {
                            id: "27",
                            text: " over the four-year period.",
                        },
                    ],
                ],
                placeHolder: "Type your paragraph here",
                userInput: "",
                id: "27",
            },
            align: "left",
        },
        {
            structure: {
                para: [],
            },
            notes: {
                para: [],
            },
            content: {
                para: [
                    [
                        {
                            id: "55",
                            text: "Over the whole period gas remained the most common source of electricity.",
                        },
                        {
                            id: "54",
                            text: " ",
                        },
                        {
                            id: "56",
                            text: "However, the percentage it supplied dropped from 40 per cent to 30 per cent, having fallen to a low of 27 per cent in 2013. ",
                        },
                        {
                            id: "54",
                            text: " ",
                        },
                        {
                            id: "57",
                            text: "The other category that fell over the same period was coal, which had the most dramatic fall from 39 per cent in 2012 to 23 per cent in 2015. At the same time the percentage of nuclear power went up slightly, from 19 per cent to 21 per cent.",
                        },
                        {
                            id: "54",
                            text: " If these trends in coal and nuclear supply continue, nuclear will overtake coal in the next few years. ",
                        },
                        {
                            id: "57",
                            text: "Other sources of electricity such as biofuels remained at a relatively low percentage and did not change significantly over the four-year period.",
                        },
                    ],
                ],
                placeHolder: "Type your paragraph here",
                userInput: "",
                id: "54",
                duplicate: true,
            },
            align: "left",
        },
        {
            structure: {
                para: [
                    {
                        id: "46",
                        text: "Conclusion",
                    },
                    {
                        id: "47",
                        text: "Draw together the main trends identified in the report.",
                    },
                ],
            },
            notes: {
                para: [
                    {
                        id: "48",
                        text: "Pattern of electricity sources changed signifcantly.",
                    },
                    {
                        id: "48",
                        text: "Main trends: drop in coal, rise in renewables",
                    },
                ],
                placeHolder: "Type your notes here",
                id: "48",
                userInput: "",
            },
            content: {
                para: [
                    [
                        {
                            id: "49",
                            text: "In conclusion, ",
                        },
                        {
                            id: "50",
                            text: "the chart shows that",
                        },
                        {
                            id: "49",
                            text: " the pattern of electricity sources changed significantly in the categories of renewables, gas and coal over the period 2011 to 2015. ",
                        },
                        {
                            id: "59",
                            text: "The most significant trends",
                        },
                        {
                            id: "49",
                            text: " were ",
                        },
                        {
                            id: "60",
                            text: "the drop in",
                        },
                        {
                            id: "49",
                            text: " coal and the rise in renewables.",
                        },
                    ],
                ],
                placeHolder: "Type your conclusion here",
                userInput: "",
                id: "49",
            },
            align: "left",
        },
    ],
    steps: [
        {
            label: "What do graphs show?",
            desc: ["Graphs can be used to compare many different things. Line graphs are usually used to show developments over a period of time."],
            filters: [],
        },
        {
            showParas: ["5", "6", "13", "14", "24", "25", "35", "36", "46", "47"],
            label: "How is the report structured?",
            desc: ["Below is the framework that was used to create this report."],
            filters: [],
        },
        {
            showParas: ["2", "3", "5", "6", "7", "13", "14", "15", "24", "25", "26", "35", "36", "37", "46", "47", "48"],
            label: "How was the report planned?",
            desc: ["In order to plan the report, the writer decides what to cover in each paragraph and takes notes."],
            filters: [],
        },
        {
            showParas: ["2", "3", "13", "14", "51"],
            label: "Introducing trends",
            desc: [],
            filters: [
                {
                    type: "checkbox",
                    label: "Start with a general comment on the trends shown in the graph and highlight the main trend.",
                    checked: false,
                    highlightClass: "highlightColor1",
                    highlightPara: ["52"],
                },
                {
                    type: "checkbox",
                    label: "Provide supporting detail on the main trend.",
                    checked: false,
                    highlightClass: "highlightColor2",
                    highlightPara: ["53"],
                },
            ],
        },
        {
            showParas: ["2", "3", "24", "25", "54"],
            label: "Comparing and contrasting trends",
            desc: [],
            filters: [
                {
                    type: "checkbox",
                    label: "Make a general comment.",
                    checked: false,
                    highlightClass: "highlightColor1",
                    highlightPara: ["55"],
                },
                {
                    type: "checkbox",
                    label: "Give more detailed information.",
                    checked: false,
                    highlightClass: "highlightColor2",
                    highlightPara: ["56"],
                },
                {
                    type: "checkbox",
                    label: "Compare and contrast these trends with others.",
                    checked: false,
                    highlightClass: "highlightColor3",
                    highlightPara: ["57"],
                },
            ],
        },
        {
            showParas: ["3", "8", "16", "27", "38", "49"],
            label: "Show me useful language",
            desc: [],
            filters: [
                {
                    type: "checkbox",
                    label: "The writer uses key words and phrases for reporting on data.",
                    checked: false,
                    highlightClass: "highlightColor1",
                    highlightPara: ["9", "10", "11", "17", "18", "19", "20", "28", "39", "40", "41", "42", "43", "44", "50", "58", "59", "60"],
                },
            ],
        },
    ],
    practice_rubric: [
        {
            header: "Before you start",
            checkList: [
                {
                    checked: false,
                    text: "Examine the data you are reporting on and make notes.",
                },
                {
                    checked: false,
                    text: "Ask yourself questions about what the graph shows.",
                    tellMeMore:
                        "<p><span>What is the information about?<br>What do the numbers on each axis represent?<br>What changes do the lines show?<br>How do the lines stand in relation to each other?<br>Which feature of the lines stands out most?<br>What conclusions can be drawn from the graph?</span><br></p>",
                },
                {
                    checked: false,
                    text: "Organize the information so that you highlight the main trends or features in a logical way.",
                },
            ],
        },
        {
            header: "Choose your language",
            checkList: [
                {
                    checked: false,
                    text: "Use language that is plain and simple, but academic in style.",
                },
                {
                    checked: false,
                    text: "Use language to describe general trends.",
                    tellMeMore:
                        "<p><span><i>The graph shows/represents/indicates...<br>The figures show/illustrate (that)...<br>From the graph, it can be seen that...<br>In conclusion,...<br>The following conclusions can be drawn from the data.<br>The main trend seen in the data is that...<br>The main trend is upwards/downwards.</i></span><br></p>",
                },
                {
                    checked: false,
                    text: "Use language to describe developments over time.",
                    tellMeMore:
                        '<p><span><i>a <span class="f_normal">small/slight</span>/<span class="f_normal">gradual</span> increase/decrease<br>a <span class="f_normal">significant/marked/dramatic</span> increase/decrease<br>a <span class="f_normal">small/slight</span> rise/fall/dip<br>steady growth<br>to rise/increase/fall/decrease/decline/drop<br>to rise/fall <span class="f_normal">steadily/dramatically/sharply/rapidly</span><br>Customer numbers have fluctuated.<br>(Online sales) reached an all-time high/low.<br>The graph shows a marked change in...</span></p>',
                },
            ],
        },
        {
            header: "While you are writing",
            checkList: [
                {
                    checked: false,
                    bold: true,
                    text: "Summarize the information in the graph.",
                },
                {
                    checked: false,
                    text: "Highlight the main trends and key changes.",
                },
                {
                    checked: false,
                    text: "Compare and contrast other trends in the data where relevant.",
                },
            ],
        },
        {
            header: "Checklist",
            checkList: [
                {
                    checked: false,
                    text: "Have I introduced the subject of the data?",
                },
                {
                    checked: false,
                    text: "Have I summarized the information from the graph?",
                },
                {
                    checked: false,
                    text: "Have I chosen, described and compared data relevant to the trends I want to focus on?",
                },
                {
                    checked: false,
                    text: "Have I reported the data accurately?",
                },
                {
                    checked: false,
                    text: "Does the conclusion summarize the data?",
                },
                {
                    checked: false,
                    text: "Have I answered the question?",
                },
                {
                    checked: false,
                    text: "Have I checked vocabulary, grammar and spelling?",
                },
            ],
        },
    ],
};

const StepAccordionTest = () => {
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

    const [checkedStates, setCheckedStates] = useState(generateInitialCheckedStates(data.steps));

    const handleCheckboxChange = (stepIndex, highlightClass, isChecked) => {
        const key = `step${stepIndex}_${highlightClass}`;
        setCheckedStates((prev) => ({ ...prev, [key]: isChecked }));
    };

    const createMarkup = (htmlContent) => ({ __html: DOMPurify.sanitize(htmlContent) });

    const renderParagraphText = (para, className, alignClass, stepFilters, stepIndex) => {
        return (
            <div className={`border-3 border-start px-2 ${className} ${alignClass}`}>
                {para.map((paraGroup, index) => (
                    <p key={index} className={className}>
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

    const renderParagraphsInSection = (paras, className) => {
        return (
            <div className={`border-3 border-start px-2 border${className}`}>
                {paras.map((p, index) =>
                    // Check if paragraph has tip property to conditionally render without className
                    p.tip ? (
                        <p key={index}>{p.text}</p>
                    ) : (
                        <p key={index} className={`text${className}`}>
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
                        paragraphs.push(renderParagraphsInSection(filteredParas, className));
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

    return (
        <Accordion defaultActiveKey="0">
            {data.steps.map((step, index) => (
                <Card key={index}>
                    <Card.Header>{step.label}</Card.Header>
                    <Card.Body>
                        {step.desc.map((desc, descIndex) => (
                            <p key={descIndex} dangerouslySetInnerHTML={createMarkup(desc)}></p>
                        ))}
                        {step.filters.map((filter, filterIndex) => (
                            <Form className="mb-2" key={filterIndex}>
                                <Form.Check
                                    type="checkbox"
                                    id={`check-${index}-${filterIndex}`}
                                    label={filter.label}
                                    checked={checkedStates[`step${index}_${filter.highlightClass}`]}
                                    onChange={(e) => handleCheckboxChange(index, filter.highlightClass, e.target.checked)}
                                />
                            </Form>
                        ))}
                        {step.showParas && findParagraphs(step.showParas, data, step.filters, index)}
                    </Card.Body>
                </Card>
            ))}
        </Accordion>
    );
};

export default StepAccordionTest;
