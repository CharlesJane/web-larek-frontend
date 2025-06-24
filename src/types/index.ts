// Интерфейсы данных - разносим по слоям и выносим базу

 // Базовые типы 

export type ID = string;

export interface IProductsList {
    _items: IProduct[];
}

export interface IProduct {
    id: ID; // сохраняется в preview IProductsList
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IUserOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

export interface IOrderData { // данные, уходящие к серверу для оформления заказа
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: IProduct[];
}

export interface IFormState {
    values: Record<string, string>; // храним текущие значения полей
    errors: string | null ; // сохраняем результат валидации
}

export type TProductBase = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>;

export type TProductBasket = Pick<IProduct, 'title' | 'price'>;

export type TOrderInfo = Pick<IUserOrder, 'payment' | 'address'>;

export type TOrderContacts = Pick<IUserOrder, 'email' | 'phone'>;

// Модели бизнес-логики

export interface IProductsModel {
    items: IProduct[];
    setItems(productArray: IProduct[]): void;
    getItems(): IProduct[];
    getProduct(productId: string): IProduct | undefined;
}

export interface IBasketModel {
    items: IProduct[];
    addProduct(product: IProduct): void;
    deleteProduct(productId: string): void;
    clear(): void;
    getCount(): number;
    getTotal(): number;
    hasProduct(productId: string): boolean;
}

export interface IUserOrderModel {
    orderData: IUserOrder;
    updateOrder(newData: Partial<IUserOrder>): void;
    validate(): boolean;
    clearOrderData(): void;
    getValidatedData(): IUserOrder | null;
}

// Компоненты отображения

export interface IPage {
    basketCounter: number;
    gallery: HTMLElement[];
    locked: boolean;
}

export interface IModalData {
    content: HTMLElement;
}

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
    getBasketData(): IOrderData;
    getTotal(): number;
}

export interface IOrderPresenter {
    setOrderInfo(orderData: {order: IUserOrder; basket: IProduct;}): void; //собираем инфо о данных заказчика
    checkOrderInfoValidation(data: Record<keyof (TOrderContacts | TOrderInfo), string>): boolean; // валидируем отправляемые данные
    sendOrder(): Promise<void>; 
}

// Состояния

export interface IBasketState { // храним состояние корзины для дальнейшей работы с представлением
    items: IProduct[];
    total: number;
}

export interface IAppState { //храним общее состояние приложения
    products: IProductsModel;
    basket: IBasketState;
    order: IUserOrderModel;
}



