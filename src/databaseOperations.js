import Dexie from "dexie";

export const db = new Dexie("iWriter");

db.version(1).stores({
    projects: "id, projectName, projectLocation, content, [projectName+projectLocation]",
});

db.open().catch((err) => {
    console.error(`Open failed: ${err.stack}`);
});

export const saveProject = async ({
    projectName,
    projectLocation,
    paragraphsData,
    setToastMessage,
    setShowToast,
    handleClose,
}) => {
    const id = `${projectLocation}-${projectName}`;
    const projectData = {
        id,
        projectName,
        projectLocation,
        content: paragraphsData,
        date: new Date().toISOString(),
    };

    try {
        await db.projects.put(projectData);
        setToastMessage(`Project "${projectName}" saved successfully.`);
        setShowToast(true);
        console.log("Project saved successfully");
        handleClose();
    } catch (err) {
        console.error("Error saving the project:", err);
    }
};


export const fetchProjectsForLocation = async (projectLocation, setProjectsForLocation, setShowLoadModal) => {
    const projects = await db.projects.where({ projectLocation: projectLocation }).toArray();
    setProjectsForLocation(projects);
    setShowLoadModal(true);
};

