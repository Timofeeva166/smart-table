import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    const compare = createComparison(
        ['skipEmptyTargetValues'],
        [
            rules.searchMultipleFields(
                searchField,
                ['date', 'customer', 'seller'],
                false
            )
        ]
    );
    
    return (data, state, action) => {
        const searchQuery = state[searchField];
        if (!searchQuery || searchQuery.trim() === '') {
            return data;
        }
        return data.filter(row => compare(row, state));
    };
}