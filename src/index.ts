import './scss/styles.scss';
import { BasketModel } from "./components/BasketModel";
import { LarekAPI } from "./components/LarekApi";
import { ProductsModel } from "./components/ProductsModel";
import { UserOrderModel } from "./components/UserOrderModel";
import { Api } from "./components/base/api";
import { EventEmitter } from "./components/base/events";
import { API_URL, CDN_URL, settings } from "./utils/constants";


const events = new EventEmitter();

const api = new LarekAPI(CDN_URL, API_URL);

const productsData = new ProductsModel(events);
const basketData = new BasketModel(events);
// const userOrderData = new UserOrderModel();

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Получаем товары с сервера
Promise.all([api.getProductsList()])
    .then(([productsList]) => {
        productsData._items = productsList._items;
        console.log(productsList._items);
    })
    .catch((err) => {
        console.log("Ошибка получения карточек с сервера " + err);
    })