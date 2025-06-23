// Интерфейсы данных - разносим по слоям и выносим базу

 // Базовые типы 

export type ID = string;

export interface IProductsList {
    _total: number;
    _items: IProduct[];
}

export interface IProduct {
    id: ID; // сохраняется в preview IProductsList
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBasketItem extends IProduct {
    quantity: number; // расширяем тип для корзины, храним число товаров в ней
}

export interface IBasketData {
    items: IBasketItem[];
    total: number;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

// export interface IOrderData { // данные, уходящие к серверу для оформления заказа
//     payment: string;
//     email: string;
//     phone: string;
//     address: string;
//     total: number;
//     items: IBasketItem[];
// }

export interface IFormState {
    values: Record<string, string>; // храним текущие значения полей
    errors: string | null ; // сохраняем результат валидации
}

export type TOrderData = IProductsList & IOrder;

export type TProductBase = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>;

export type TProductBasket = Pick<IProduct, 'title' | 'price'>;

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;

export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

// Модели бизнес-логики

export interface IProductsModel {
    total: number;
    items: IProduct[];
    getProduct(productId: string): IProduct | undefined;
    addProduct(product: IProduct): void;
    deleteProduct(productId: string): void;
}

export interface IBasketModel {
    total: number;
    items: IBasketItem[];
}

export interface IOrderModel {
    orderData: IOrder;
}

// Компоненты отображения

export interface IProductCard {
    render(product: IProduct): HTMLElement;
}

export interface IProductsView {
    renderProducts(): void; // рендерим список карточек
    renderPreview(productId: ID): void; // рендерим превью выбранной карточки
}

export interface IBasketView {
    renderItems(): void;
    renderTotal(): void;
}

export interface IOrderView {
    renderForm(): void;
}

// Презентер - управление данными

export interface IProductsPresenter {
    setPreview(productId: ID): void;
    getPreview(): ID | null; // сюда уходит id выбранной карточки
}

export interface IBasketPresenter {
    addItem(product: IProduct): void;
    removeItem(productId: ID): void;
    updateQuantity(productId: ID, quantity: number): void;
    getBasketData(): TOrderData;
    getTotal(): number;
}

export interface IOrderPresenter {
    setOrderInfo(orderData: {order: IOrder; basket: IBasketData;}): void; //собираем инфо о данных заказчика
    checkOrderInfoValidation(data: Record<keyof (TOrderContacts | TOrderInfo), string>): boolean; // валидируем отправляемые данные
    sendOrder(): Promise<void>; 
}

// Состояния

export interface IBasketState { // храним состояние корзины для дальнейшей работы с представлением
    items: IBasketItem[];
    total: number;
}

export interface IAppState { //храним общее состояние приложения
    products: IProductsModel;
    basket: IBasketState;
    order: IOrderModel;
}



