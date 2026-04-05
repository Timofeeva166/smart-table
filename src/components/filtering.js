import {createComparison, defaultRules} from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map((name) => {
                const el = document.createElement("option");
                el.textContent = name;
                el.value = name;
                return el;
            })
        );
    });

    return (data, state, action) => {
        return data.filter(row => compare(row, state));
    }
}