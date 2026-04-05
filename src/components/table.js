import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate); //скопировали шаблон таблицы

    before.reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    after.forEach(subName => { //добавляем пагинацию. Для каждогоэлемента из массива
        root[subName] = cloneTemplate(subName); //клонируем шаблон с айдишником из массива
        root.container.append(root[subName].container); //ставим элемент перед таблицей
    });

    root.container.addEventListener("change", onAction);
    root.container.addEventListener("reset", () => {
        setTimeout(onAction);
    });
    root.container.addEventListener("submit", (e) => {
        e.preventDefault();
        onAction(e.submitter)
    });

    const render = (data) => { //получаем массив данных
        const nextRows = data.map(item => { //создаем массив новых строк
            const row = cloneTemplate(rowTemplate); // клонируем шаблон и делаем из него объек с элементом и списком data
            Object.keys(item).forEach(key => { //перебираем ключи даты (то есть data)
                if (row.elements[key]) { // если ключ есть в склонированном шаблоне
                    if (row.elements[key].tagName === 'INPUT' || row.elements[key].tagName === 'SELECT') {
                        row.elements[key].value = item[key];
                    } else {
                        row.elements[key].textContent = item[key];
                    }
                };
            });
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }
    return {...root, render};
}