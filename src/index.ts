import './scss/styles.scss';
import { LarekAPI } from './components/LarekApi';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { UserOrderModel } from './components/UserOrderModel';
import { Modal } from './components/common/Modal';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { ProductsModel } from './components/ProductsModel';
import { BasketModel } from './components/BasketModel';
import { Page } from './components/Page';
import { BasketProductCard, GalleryProductCard, PreviewProductCard } from './components/ProductCard';
import { IProduct, ID, TProductBasket } from './types';
import { BasketView } from './components/common/BasketView';

const events = new EventEmitter();

const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
// events.onAll(({ eventName, data }) => {
//     console.log(eventName, data);
// })

// Модели данных 
const productsData = new ProductsModel(events);
const basketData = new BasketModel(events);
    // const orderData = new UserOrderModel(events);

// Глобальные контейнеры
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const galleryCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderPaymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const basket = new BasketView(cloneTemplate(basketTemplate), events);

// Получаем товары с сервера
Promise.all([api.getProductsList()])
    .then(([productsList]) => {
        if (!productsList || !productsList._items || !Array.isArray(productsList._items)) {
            throw new Error('Неверный формат данных');
        }
        productsData._items = productsList._items;
        events.emit('productsList:loaded');
    })
    .catch((err) => {
        console.error("Ошибка получения карточек с сервера:", err);
    });

// Выводим карточки на страницу

events.on('productsList:loaded', () => {
	page.catalog = productsData._items.map((card) => {

        const cardElement = cloneTemplate<HTMLElement>(galleryCardTemplate);
        const cardInstant = new GalleryProductCard(cardElement, {
            onClick: () => events.emit('card:select', card)
        });
		return cardInstant.render({
            id: card.id,
            title: card.title,
            price: card.price,
            image: card.image,
            category: card.category
        });
	});

    page.counter = basketData.getCount();
});

// Открываем модалку с превью карточки

events.on('card:select', (item: IProduct) => {
    const previewCard = new PreviewProductCard(
        cloneTemplate(previewCardTemplate),
        {
            onClick: () => {
                events.emit('cardToBasket:add', item);
            }
        }
    );

    previewCard.render({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        description: item.description,
        category: item.category
    });
    
    modal.render({
        content: previewCard.getContainer()
    });
});

// Обработчик добавления в корзину - не работает
events.on('cardToBasket:add', (item: TProductBasket) => {
    basketData.addProduct(item); // Добавляем товар в модель
    basket.clear();
    // Отображаем карточки в корзине

    basket.items = basketData.items.map((card, index) => {

        const basketElement = cloneTemplate<HTMLElement>(basketCardTemplate);
        const basketItem = new BasketProductCard(basketElement, {
            onClick: () => {
                events.emit('basketProduct:deleted', card);
            }
        })

        basketItem.index = index + 1;

        return basketItem.render({
            id: card.id,
            title: card.title,
            price: card.price
        });       
	});

    // Удаляем товар из корзины 
    events.on('basketProduct:deleted', (card: TProductBasket) => {
        console.log(card);
        basketData.deleteProduct(card.id);
        events.emit('basket:update');
    })

    basket.totalPrice = basketData.getTotal();
    
    // Обновляем счетчик товаров в каталоге
    page.counter = basketData.getCount();
});

// Обновляем корзину 

events.on('basket:update', () => {
    basket.items = basketData.items.map((card, index) => {

        const basketElement = cloneTemplate<HTMLElement>(basketCardTemplate);
        const basketItem = new BasketProductCard(basketElement, {
            onClick: () => {
                events.emit('basketProduct:deleted', card);
            }
        })

        basketItem.index = index + 1;

        return basketItem.render({
            id: card.id,
            title: card.title,
            price: card.price
        });       
	});
    
    basket.totalPrice = basketData.getTotal();
    page.counter = basketData.getCount();
})

// Открываем модалку с корзиной 

events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    })
});


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});
