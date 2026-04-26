const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData() {
    // переменные для кеширования данных
    let sellers; //объект с продавцами, формат {"seller_1":"Alexey Petrov"......}
    let customers; //объект с покупателями, формат {"customer_1":"Andrey Alekseev"......}
    let lastResult; //преобразованный ответ сервера последнего запроса
    let lastQuery; //часть query в урле в последнем запросе к серверу

// функция для приведения строк в тот вид, который нужен нашей таблице
    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id], //берет из индекса
        customer: customers[item.customer_id], //берет из индекса
        total: item.total_amount
    }));
    //массив с элементами формата
    // {
    //  id: "receipt_19",
    //  date: "2024-10-03",
    //  seller: "Ivan Petrov",
    //  customer: "Petr Petrov",
    //  total: 4444.44
    //}


// функция получения индексов
    const getIndexes = async () => {
        if (!sellers || !customers) { // если объектов еще не существует, то делаем запросы
            [sellers, customers] = await Promise.all([ // ждем выполнения всех запросов и раскидываем их по переменным - json первого в sellers, json второго в customers
                fetch(`${BASE_URL}/sellers`).then(res => res.json()), // получаем список продавцов в формате "seller_1":"Alexey Petrov"
                fetch(`${BASE_URL}/customers`).then(res => res.json()), // получаем список покупателей в формате "customer_1":"Andrey Alekseev"
            ]);
        }

        return { sellers, customers }; //возвращаем объекты
        //форматы объектов:
        //{"seller_1":"Alexey Petrov"......}
        //{"customer_1":"Andrey Alekseev"......}
    }

// функция получения записей о продажах с сервера
    const getRecords = async (query, isUpdated = false) => {
        const qs = new URLSearchParams(query); // преобразуем query часть запроса в SearchParams формата { 'name' → 'John', 'age' → '25' }
        const nextQuery = qs.toString(); // превращаем в строку формата name=John&age=25

        if (lastQuery === nextQuery && !isUpdated) { // isUpdated параметр нужен, чтобы иметь возможность делать запрос без кеша
            return lastResult; // если параметры запроса не поменялись, то отдаём сохранённые ранее данные
        }

        // если прошлый query не был ранее установлен или поменялись параметры, то запрашиваем данные с сервера
        const response = await fetch(`${BASE_URL}/records?${nextQuery}`); // поставляем новые параметры
        const records = await response.json(); // получаем новые данные по параметрам

        lastQuery = nextQuery; // сохраняем полученные для следующих запросов. если запрос будет еще раз таким же, не будем снова обращаться к серверу
        lastResult = {
            total: records.total, //сколько всего записей
            items: mapRecords(records.items) //преобразуем в объект нужного формата
        };

        return lastResult;
    };

    // по итогом всей initData возращаем 
    // {
    //  {"seller_1":"Alexey Petrov"......}
    //  {"customer_1":"Andrey Alekseev"......}
    // }

    // массив с элементами формата
    // {
    //  id: "receipt_19",
    //  date: "2024-10-03",
    //  seller: "Ivan Petrov",
    //  customer: "Petr Petrov",
    //  total: 4444.44
    // }
    return {
        getIndexes,
        getRecords
    };
}