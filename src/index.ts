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
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

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

const orderDataComplete: IOrderData = {
    payment: '',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: []
}

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
        
        return basketItem.render({
            id: card.id,
            title: card.title,
            price: card.price
        });
    });
    
    basket.totalPrice = basketData.getTotal();
    page.counter = basketData.getCount();
};

const getBasketData = () => {
    const productsIds = basketData.getProductIds();
    console.log(productsIds);

    const total = basketData.getTotal();
    return {
        items: productsIds,
        total: total
    };
};

// Обработчик добавления в корзину
events.on('cardToBasket:add', (item: TProductBasket) => {
    basketData.addProduct(item);
    basket.clear();
    updateBasket();
});

// Обработчик удаления товара
events.on('basketProduct:deleted', (card: TProductBasket) => {
    basketData.deleteProduct(card.id);
    updateBasket();
});

// Открываем модалку с корзиной 

events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    })
});

// Открываем модалку с формой оплаты 

events.on('orderForm:open', () => {
    const basketComplete = getBasketData();

    orderDataComplete.items = basketComplete.items;
    orderDataComplete.total = basketComplete.total;

    // Открываем модальное окно с формой
    modal.render({
        content: orderPayment.render({
            payment: null,
            address: '',
            valid: false,
            errors: ''
        })
    });
});

// Открываем модалку с формой контактов 

events.on('orderContacts:open', () => {
    // Открываем модальное окно с формой
    modal.render({
        content: orderContacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: ''
        })
    });
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IUserOrder>) => {
    const { email, phone, address, payment } = errors;
    orderPayment.valid = !address && !payment;
    orderContacts.valid = !email && !phone;

    orderPayment.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
    orderContacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IUserOrder, value: string }) => {
    orderData.setOrderField(data.field, data.value);
});

events.on('orderPayment:changed', (data) => {
    const { payment, address } = orderData.validateOrder();
    const valid = !address && !payment;
    const errors = Object.values({address, payment}).filter(i => !!i).join('; ');

    if (valid) {
        orderDataComplete.payment = orderData.order.payment;
        orderDataComplete.address = orderData.order.address;
    }

    orderPayment.render({
        address: orderData.order.address,
		payment: orderData.order.payment,
		valid: valid,
		errors: errors,
    })
})

events.on('orderContacts:changed', (data) => {
    const { email, phone } = orderData.validateOrder();
    const valid = !email && !phone;
    const errors = Object.values({email, phone}).filter(i => !!i).join('; ');

    if (valid) {
        orderDataComplete.email = orderData.order.email;
        orderDataComplete.phone = orderData.order.phone;
    }

    orderContacts.render({
        email: orderData.order.email,
		phone: orderData.order.phone,
		valid: valid,
		errors: errors,
    })
})

// Устанавливаем значения по сабмиту 

events.on('orderpayment:set', (data:IOrderData) => {
    // Получаем данные из события
    const { payment, address } = data;
    
    // Обновляем orderDataComplete
    orderDataComplete.payment = payment;
    orderDataComplete.address = address;
    
    // Дополнительно можно обновить модель заказа
    orderData.setOrderField('payment', payment);
    orderData.setOrderField('address', address);
});

// Обработчик события установки данных контактов
events.on('ordercontacts:set', (data:IOrderData) => {
    const { email, phone } = data;
    
    // Обновляем orderDataComplete
    orderDataComplete.email = email;
    orderDataComplete.phone = phone;
    
    // Обновляем модель заказа
    orderData.setOrderField('email', email);
    orderData.setOrderField('phone', phone);
});

// Обновляем обработчик завершения заказа

events.on('order:completed', () => {
    if (!orderDataComplete.payment || !orderDataComplete.address ||
        !orderDataComplete.email || !orderDataComplete.phone) {
        console.error('Не все данные заказа заполнены');
        return;
    }

    console.log('Отправляем заказ:', orderDataComplete);
    
    api.orderProducts(orderDataComplete)
        .then((response) => {
            console.log('Заказ успешно обработан:', response);
            
            // Успешная обработка
            handleSuccess(response);
        })
        .catch((error) => {
            console.error('Ошибка:', error);
            
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
        console.log(productsList);
        productsData._items = productsList._items;

        events.emit('productsList:loaded');
    })
    .catch((err) => {
        console.log('Ошибка при получении данных:', err);
    });

    // инициируем данные для заказа
    orderData.initOrder();