export const generateInitialCheckedStates = (steps) => {
    const initialState = {};
    steps.forEach((step, index) => {
        step.filters.forEach(filter => {
            const key = `step${index}_${filter.highlightClass}`;
            initialState[key] = false;
        });
    });
    return initialState;
};
