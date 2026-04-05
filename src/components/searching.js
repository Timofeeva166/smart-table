import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField, searchFields = ['seller', 'customer', 'date']) {
    // Создаем компаратор с настройками для поиска
    const compare = createComparison(
        ['skipEmptyTargetValues'],  // Пропускаем пустые значения в target (state)
        [
            rules.searchMultipleFields(
                searchField,        // Ключ поиска в state (например 'search')
                searchFields,       // Поля для поиска в данных
                false              // caseSensitive = false
            )
        ]
    );

    return (data, state, action) => {
        // Получаем поисковый запрос из state
        const searchQuery = state[searchField];
        
        // Если запрос пустой или undefined, возвращаем все данные
        if (!searchQuery || searchQuery.trim() === '') {
            return data;
        }
        
        // Фильтруем данные с помощью компаратора
        const filteredData = data.filter(row => compare(row, state));
        
        // Важно: возвращаем пустой массив, если ничего не найдено
        // (это соответствует ТЗ - "возвращать пустую таблицу")
        return filteredData;
    };
}