import {createComparison, defaultRules, rules} from "../lib/compare.js";

const baseCompare = createComparison(defaultRules);

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

    return (data, state) => {
        return data.filter(row => {
            // Проверяем стандартные фильтры
            const baseResult = baseCompare(row, state);
            if (!baseResult) return false;
            
            const totalFrom = state.totalFrom;
            const totalTo = state.totalTo;
            
            // Если оба поля пустые - пропускаем проверку
            if ((!totalFrom || totalFrom === '') && (!totalTo || totalTo === '')) {
                return true;
            }
            
            const total = parseFloat(row.total);
            if (isNaN(total)) return false;
            
            // Проверяем нижнюю границу
            if (totalFrom && totalFrom !== '') {
                const from = parseFloat(totalFrom);
                if (!isNaN(from) && total < from) return false;
            }
            
            // Проверяем верхнюю границу
            if (totalTo && totalTo !== '') {
                const to = parseFloat(totalTo);
                if (!isNaN(to) && total > to) return false;
            }
            
            return true;
        });
    }
}