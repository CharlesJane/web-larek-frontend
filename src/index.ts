import { EventEmitter } from './components/base/events';
import { ProductsModel } from './components/ProductsModel';
import {API_URL, CDN_URL} from "./utils/constants";
import './scss/styles.scss';
import { LarekAPI } from './components/LarekApi';

const eventEmitter = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

const productsArray = new ProductsModel(eventEmitter);

api.getProductsList()
    .then(data => {
        productsArray.items = data._items
        console.log(productsArray.items)
    })
    .catch(err => console.log(err + 'err'))

// productsArray.products = example.items;
// productsArray.total = example.total;
// const productExample = productsArray.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390');
// console.log(productExample);
// console.log(productsArray);
// productsArray.deleteProduct("854cef69-976d-4c2a-a18c-2aa45046c390");
// console.log(productsArray);
// productsArray.addProduct(productExample);
// console.log(productsArray);