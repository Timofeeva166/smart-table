import {makeIndex} from "./lib/utils.js";

export function initData(sourceData) {
    const sellers = makeIndex(sourceData.sellers, 'id', v => `${v.first_name} ${v.last_name}`); //делает словать формата {"seller_1": "Alexey Petrov"}
    const customers = makeIndex(sourceData.customers, 'id', v => `${v.first_name} ${v.last_name}`); //делает словать формата {"customer_1": "Andrey Alexeev"}
    const data = sourceData.purchase_records.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));
    return {sellers, customers, data};
}

// data в формате
// id: "receipt_19",
// date: "2024-10-03",
// seller: "Ivan Petrov",
// customer: "Petr Petrov",
// total: 4444.44

//объединяет все в один объект
// {
//   sellers: { "1": "Alexey Petrov" },
//   customers: { "10": "Andrey Alexeev" },
//   data: [{
//     id: "REC-001",
//     date: "2024-01-15",
//     seller: "Alexey Petrov",
//     customer: "Andrey Alexeev",
//     total: 2500.50
//   }]
// }