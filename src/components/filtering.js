export function initFiltering(elements) {
    // заполняем выпадающие списки
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        // очистка поля
        if (action && action.name === 'clear') { //если есть событие и это клик по кнопке
            const fieldToClearName = action.dataset.field; // получаем название поля из data-field
            const fieldToClear = Object.values(elements).find(el => el.name === fieldToClearName); //ищем нужное поле в массиве элементов
        
            if (fieldToClear && fieldToClear.value !== '') { // если нашли и там что-то есть
                fieldToClear.value = ''; //очищаем поле
            }
        }

        const filter = {}; // объект для сбора параметров фильтрации
        Object.keys(elements).forEach(key => { //для каждого поля
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })
        
        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}