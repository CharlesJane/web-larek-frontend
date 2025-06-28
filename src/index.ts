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
import { IProduct, IOrderData, TProductBasket, IUserOrder, IProductsList, ISuccess } from './types';
import { BasketView } from './components/common/BasketView';
import { OrderContacts, OrderPayment } from './components/OrderView';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
// events.onAll(({ eventName, data }) => {
//     console.log(eventName, data);
// })

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const galleryCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderPaymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модели данных 
const productsData = new ProductsModel(events);
const basketData = new BasketModel(events);
const orderData = new UserOrderModel({
    payment: '',
    email: '',
    phone: '',
    address: ''
}, events);

// Глобальные контейнеры
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);

// Переиспользуемые части интерфейса
const basket = new BasketView(cloneTemplate(basketTemplate), events);
const orderPayment = new OrderPayment(cloneTemplate(orderPaymentTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate(orderContactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => events.emit('modal:close')
})

// Бизнес-логика
// Выводим карточки на страницу

events.on('productsList:loaded', () => {
	page.catalog = productsData._items.map((card) => {

        const cardElement = cloneTemplate<HTMLElement>(galleryCardTemplate);
        const cardInstant = new GalleryProductCard(cardElement, {
            onClick: () => events.emit('card:select', card)
        });
		return cardInstant.render(card);
	});

    page.counter = 0;
});

// Открываем модалку с превью карточки

events.on('card:select', (item: IProduct) => {
    const previewCard = new PreviewProductCard(
        cloneTemplate(previewCardTemplate),
        {
            onClick: () => {
                if(!basketData.hasProduct(item.id)) {
                    events.emit('cardToBasket:add', item);
                }  
            }
        }
    );

    previewCard.render(item);
    
    modal.render({
        content: previewCard.getContainer()
    });
});

// Функция обновления содержимого корзины и значений в заказе
const updateBasket = () => {
    basket.items = basketData.items.map((card, index) => {
        const basketElement = cloneTemplate<HTMLElement>(basketCardTemplate);
        const basketItem = new BasketProductCard(basketElement, {
            onClick: () => {
                events.emit('basketProduct:deleted', card);
            }
        });
        
        basketItem.index = index + 1;
        
        return basketItem.render(card);
    });
    
    page.counter = basketData.getCount();
    basket.totalPrice = basketData.getTotal();
};

// Обработчик добавления в корзину
events.on('cardToBasket:add', (item: TProductBasket) => {
    basketData.addProduct(item);
    
    updateBasket();
});

// Обработчик удаления товара
events.on('basketProduct:deleted', (card: TProductBasket) => {
    basketData.deleteProduct(card.id);
    updateBasket();
});

// Открываем модалку с корзиной 
events.on('basket:open', () => {
    basket.clear();
    modal.render({
        content: basket.render()
    })
});

// Открываем модалку с формой оплаты 
events.on('orderForm:open', () => {
    // Открываем модальное окно с формой
    modal.render({
        content: orderPayment.render()
    });
});

// Открываем модалку с формой контактов 
events.on('order:submit', () => {
    modal.render({
        content: orderContacts.render()
    });
});

// Изменилось одно из полей
events.on('form:change', (data: { field: keyof IUserOrder, value: string }) => {
    orderData.setOrderField(data.field, data.value);
});

// Валидация полей формы
events.on('order:changed', (data: {field: keyof IUserOrder}) => {
    if (data.field === 'payment' || data.field === 'address') {
        const { payment, address } = orderData.validateOrder();
        const valid = !address && !payment;
        const errors = Object.values({address, payment}).filter(i => !!i).join('; ');

        orderPayment.render({
            address: orderData.order.address,
            payment: orderData.order.payment,
            valid: valid,
            errors: errors,
        })
    } else {
        const { email, phone } = orderData.validateOrder();
        const valid = !email && !phone;
        const errors = Object.values({email, phone}).filter(i => !!i).join('; ');

        orderContacts.render({
            email: orderData.order.email,
            phone: orderData.order.phone,
            valid: valid,
            errors: errors,
        })
    }
})

// Обновляем обработчик завершения заказа

events.on('contacts:submit', () => {
    const orderDataComplete: IOrderData = {
        ...orderData.orderData,
        total: basketData.getTotal(),
        items: basketData.getProductIds(),
    }

    
    api.orderProducts(orderDataComplete)
        .then((response) => {
            
            // Успешная обработка
            handleSuccess(response);
        })
        .catch((error) => {
            
            // Обработка разных типов ошибок
            if (error.status === 400) {
                handleValidationError(error);
            } else if (error.status === 500) {
                handleServerError();
            } else {
                handleGenericError();
            }
        });

    function handleSuccess(res: ISuccess) {
        // Логика при успешной отправке
        modal.render({
            content: success.render(res)
        });
        success.totalPayed = res.total;
        basketData.clear();
        updateBasket();
        page.counter = 0;
    }

    function handleValidationError(error: any) {
        // Обработка ошибок валидации
        console.log('Ошибка валидации:', error.errors);
    }

    function handleServerError() {
        // Обработка ошибок сервера
        console.log('Произошла ошибка на сервере');
    }

    function handleGenericError() {
        // Общая обработка ошибок
        console.log('Неизвестная ошибка');
    }
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

api.getProductsList()
    .then((productsList) => {
        productsData.setItems(productsList._items);
    })
    .catch((err) => {
        console.log('Ошибка при получении данных:', err);
    });

    // инициируем данные для заказа
    orderData.initOrder();