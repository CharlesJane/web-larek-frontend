import { EventEmitter } from './components/base/events';
import { ProductsModel } from './components/ProductsModel';
import {API_URL, CDN_URL} from './utils/constants';
import { ensureElement } from './utils/utils'
import './scss/styles.scss';
import { ILarekAPI, LarekAPI } from './components/LarekApi';
import { BasketModel } from './components/BasketModel';
import { UserOrderModel } from './components/UserOrderModel';
import { CatalogProductCard, PreviewProductCard, ProductCard } from './components/ProductCard';
import { Page } from './components/Page';
import { IProduct, IProductsList } from './types';
import { Modal } from './components/common/Modal';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
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
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// Модели данных приложения
// const productsModel = new ProductsModel(eventEmitter);
// const basketModel = new BasketModel(eventEmitter);
// const userOrderModel = new UserOrderModel(orderData, eventEmitter);

// const productsArray = new ProductsModel(events);

// Promise.all([api.getProductsList()])
//     .then(([productsList]) => {
//         productsArray.items = productsList._items;
//         console.log(productsArray.items);
//     })
//     .catch((err) => {
//         console.log("Ошибка получения карточек с сервера " + err);
//     })

// const productCard = new ProductCard(cardCatalogTemplate, events);
// console.log(productCard);
const pageWrapper = ensureElement('.page__wrapper');

// Функция для создания карточки товара
function createProductCard(product: IProduct, events: EventEmitter): HTMLElement {
    // Клонируем шаблон
    const cardElement = cardCatalogTemplate.content.cloneNode(true) as HTMLElement;
    
    // Создаем экземпляр карточки
    const card = new CatalogProductCard(cardElement, events);
    
    // Заполняем карточку данными
    card.title = product.title;
    card.price = product.price;
    card.image = product.image;
    card.category = product.category;
    card.id = product.id;

    card.setButtonClickHandler(() => {
        // Передаем объект с productId
        events.emit('product:click', { productId: product.id });
    });
    
    return card.render();  // Возвращаем готовый DOM элемент
}

// Основной класс презентера
class CatalogPresenter {
    private api: ILarekAPI;
    private events: EventEmitter;
    private page: Page;
    private products: IProduct[];
    private modal: Modal;

    constructor(api: ILarekAPI, events: EventEmitter, page: Page) {
        this.api = api;
        this.events = events;
        this.page = page;
        this.modal = new Modal(modalContainer, this.events);

        this.events.on('product:click', ({ productId }: { productId: string }) => {
            const product = this.products.find(pr => pr.id === productId);
            console.log(productId + " ttt")
            
            if (product) {
                console.log(product + " ttt")
                const modalContent = this.createModalContent(product);
                this.modal.content = modalContent;
                this.modal.open();
            }
        });
    }

    loadProducts(): void {
        this.api.getProductsList()
            .then((productsList: IProductsList) => {
                this.products = productsList._items;
                console.log(this.products)
                
                // Создаем карточки и сразу получаем DOM элементы
                const cards = this.products.map(product => 
                    createProductCard(product, this.events)
                );
                
                // Отображаем карточки на странице
                this.page.gallery = cards as HTMLElement[];  // Приводим тип
            })
            .catch((err) => {
                console.error('Ошибка при загрузке товаров:', err);
            });
    }

    private createModalContent(product: IProduct): HTMLElement {
        const cardElementPreview = cardPreviewTemplate.content.cloneNode(true) as HTMLElement;
        const previewCard = new PreviewProductCard(cardElementPreview, this.events);

        previewCard.title = product.title;
        previewCard.price = product.price;
        previewCard.image = product.image;
        previewCard.category = product.category;
        previewCard.id = product.id;
        
        return previewCard.render();
    }
}

// Создание экземпляра Page
const page = new Page(pageWrapper, events);

// Создание презентера
const presenter = new CatalogPresenter(api, events, page);

// Запуск загрузки товаров
presenter.loadProducts();