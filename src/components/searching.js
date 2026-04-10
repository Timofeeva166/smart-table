import {rules, createComparison} from "../lib/compare.js";

export function initSearching() {
    // Создаем компаратор с настройками для поиска
    const compare = createComparison(
        ['skipEmptyTargetValues'],  // Пропускаем пустые значения в target (state)
        [
            rules.searchMultipleFields(
                'search', //ключ для поиска
                ['seller', 'customer', 'date'] //список полей, по которым ищем
            )
        ]
    );

    return (data, state) => {
        // Получаем поисковый запрос из state
        const searchQuery = state['search'];
        
        // Если запрос пустой или undefined, возвращаем все данные
        if (!searchQuery || searchQuery.trim() === '') {
            return data;
        }
        
        // Фильтруем данные с помощью компаратора
        return data.filter(row => compare(row, state));
    };
}