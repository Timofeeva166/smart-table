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
        return data.filter(row => compare(row, state)); // Фильтруем данные с помощью компаратора
    };
}