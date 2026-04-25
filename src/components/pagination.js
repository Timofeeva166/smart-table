import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    let pageCount; //кол-во страниц

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // переносим код, который делали под @todo: #2.6
        if (action) switch(action.name) {
            case 'prev': page = Math.max(1, page - 1); break; //переход на предыдущую страницу
            case 'next': page = Math.min(pageCount, page + 1); break; //переход на следующую страницу
            case 'first': page = 1; break; //переход на 1 страницу
            case 'last': page = pageCount; break; //переход на последнюю страницу
        };

        return Object.assign({}, query, { // добавим параметры к query, но не изменяем исходный объект
            limit,
            page
        });
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        // переносим код, который делали под @todo: #2.4
        const visiblePages = getPages(page, pageCount, 5);          
        pages.replaceChildren(...visiblePages.map(pageNumber => {    
            const el = pageTemplate.cloneNode(true);                
            return createPage(el, pageNumber, pageNumber === page);
        }))

        // оформляем запись о том, сколько строк
        fromRow.textContent = (page - 1) * limit + 1; // номер строки, с которой начинаем
        toRow.textContent = Math.min((page * limit), total); //номер последней строки в выборке
        totalRows.textContent = total; //сколько всего строк
    };

    //возвращаем 2 функции
    return {
        updatePagination,
        applyPagination
    };
};