import { EventEmitter } from './components/base/events';
import { ProductsModel } from './components/ProductsModel';
import {API_URL, CDN_URL} from './utils/constants';
import { ensureElement } from './utils/utils'
import './scss/styles.scss';
import { LarekAPI } from './components/LarekApi';
import { BasketModel } from './components/BasketModel';
import { UserOrderModel } from './components/UserOrderModel';

const eventEmitter = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
eventEmitter.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модели данных приложения
// const productsModel = new ProductsModel(eventEmitter);
// const basketModel = new BasketModel(eventEmitter);
// const userOrderModel = new UserOrderModel(orderData, eventEmitter);




const productsArray = new ProductsModel(eventEmitter);

api.getProductsList()
    .then(data => {
        productsArray.items = data._items
        console.log(productsArray.items)
    })
    .catch(err => console.log(err + ' err'))

// productsArray.products = example.items;
// productsArray.total = example.total;
// const productExample = productsArray.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390');
// console.log(productExample);
// console.log(productsArray);
// productsArray.deleteProduct("854cef69-976d-4c2a-a18c-2aa45046c390");
// console.log(productsArray);
// productsArray.addProduct(productExample);
// console.log(productsArray);