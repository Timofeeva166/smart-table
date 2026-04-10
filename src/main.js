import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js"; //data у нас - данные из первого датасета

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js"
import {initSorting} from "./components/sorting.js"
import {initFiltering} from "./components/filtering.js"
import {initSearching} from "./components/searching.js"


const {data, ...indexes} = initData(sourceData); //data помещается соответственно в константу data, sellers и customers - в indexes

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    }; 
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); //собираем все поля и их значения в объект
    let result = [...data]; //делаем копию данных
    result = applySearching(result, state, action); //применяем поиск
    result = applyFiltering(result, state, action); //применяем фильтр
    result = applySorting(result, state, action); //применяем сортировку
    result = applyPagination(result, state, action); //применяем пагинацию
    sampleTable.render(result) //отображаем результат
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

const applySearching = initSearching();

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
