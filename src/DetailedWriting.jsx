import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tabs, Tab, Row, Modal } from "react-bootstrap";
import DOMPurify from "dompurify";
import useFetchJSONData from "./useFetchJSONData";
import { generateInitialCheckedStates } from "./utils";
import TopNavBar from "./TopNavBar";
import ModelText from "./components/ModelText";
import StepByStep from "./components/StepByStep";
import PracticeWriting from "./components/PracticeWriting";

function DetailedWriting() {
    const navigate = useNavigate();
    const { folder, file } = useParams();
    const data = useFetchJSONData(folder, file, navigate);

    const [activeContents, setActiveContents] = useState({
        structure: true,
        notes: true,
        content: true,
    });

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showNavigationWarningModal, setShowNavigationWarningModal] = useState(false);
    const [targetLocation, setTargetLocation] = useState(null);
    const [paragraphsData, setParagraphsData] = useState([]);

    const [checkedStates, setCheckedStates] = useState({});

    useEffect(() => {
        if (data && data.paragraphs) {
            const contentAvailability = {
                structure: data.paragraphs.some((p) => p.structure && p.structure.para.length > 0),
                notes: data.paragraphs.some((p) => p.notes && p.notes.para.length > 0),
                content: data.paragraphs.some((p) => p.content && p.content.para.length > 0),
            };
            setActiveContents(contentAvailability);

            const initialState = generateInitialCheckedStates(data.steps);
            setCheckedStates(initialState);

            const initialParagraphsData = data.paragraphs.map((paragraph) => ({
                notes: paragraph.notes?.content || "",
                content: paragraph.content?.content || "",
            }));
            setParagraphsData(initialParagraphsData);
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

    if (!data) return <div>Loading...</div>;

    const handleCheckboxChange = (stepIndex, highlightClass, isChecked) => {
        const key = `step${stepIndex}_${highlightClass}`;
        setCheckedStates((prev) => ({ ...prev, [key]: isChecked }));
    };

    const createMarkup = (htmlContent) => ({ __html: DOMPurify.sanitize(htmlContent) });

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

    return (
        <>
            <TopNavBar />
            <Button className="mb-3" onClick={handleNavigationAttempt(() => navigate("/"))}>
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
                        <ModelText data={data} activeContents={activeContents} setActiveContents={setActiveContents} createMarkup={createMarkup} />
                    </Row>
                </Tab>
                <Tab eventKey="step" title="Step by step">
                    <Row className="g-4">
                        <StepByStep
                            data={data}
                            checkedStates={checkedStates}
                            handleCheckboxChange={handleCheckboxChange}
                            createMarkup={createMarkup}
                        />
                    </Row>
                </Tab>
                <Tab eventKey="practice" title="Practice writing">
                    <Row className="g-4">
                        <PracticeWriting
                            folder={folder}
                            file={file}
                            data={data}
                            paragraphsData={paragraphsData}
                            setParagraphsData={setParagraphsData}
                            createMarkup={createMarkup}
                            setHasUnsavedChanges={setHasUnsavedChanges}
                        />
                    </Row>
                </Tab>
            </Tabs>

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
        </>
    );
}

export default DetailedWriting;
