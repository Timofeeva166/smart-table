import './fonts/ys-display/fonts.css'
import './style.css'

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js"
import {initSorting} from "./components/sorting.js"
import {initFiltering} from "./components/filtering.js"
import {initSearching} from "./components/searching.js"


const api = initData();

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container)); //данные по полям
    const rowsPerPage = parseInt(state.rowsPerPage); //сколько строк показывать
    const page = parseInt(state.page ?? 1); //номер страницы (1 если не указано)

    return {
        ...state, //возвращаем копию данных по полям
        rowsPerPage, //возвращаем кол-во строк на странице
        page //возвращаем номер страницы
    }; 
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState(); //собираем все поля и их значения в объект
    let query = {}; //параметры запроса
    query = applySearching(query, state, action); //применяем поиск
    query = applyFiltering(query, state, action); //применяем фильтр
    query = applySorting(query, state, action); //применяем сортировку
    query = applyPagination(query, state, action); //применяем пагинацию
    const { total, items } = await api.getRecords(query); //ждем кол-во записей и сами записи

    updatePagination(total, query); //обновляем пагинацию
    sampleTable.render(items); //отображаем результат
}

//рендерим табличку
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);


const {applyPagination, updatePagination} = initPagination(
    sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
    (el, page, isCurrent) => { // и колбэк, чтобы заполнять кнопки страниц данными
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([ // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements); 

const applySearching = initSearching('search');

const appRoot = document.querySelector('#app'); //тег main
appRoot.appendChild(sampleTable.container); 

async function init() {
    const indexes = await api.getIndexes()
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

init().then(render);
