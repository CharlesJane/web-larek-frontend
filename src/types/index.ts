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

export type TProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TOrderInfo = Pick<IUserOrder, 'payment' | 'address'>;

export type TOrderContacts = Pick<IUserOrder, 'email' | 'phone'>;

// Модели бизнес-логики

export interface IProductsModel {
    _items: IProduct[];
    setItems(productArray: IProduct[]): void;
    getItems(): IProduct[];
    getProduct(productId: string): IProduct | undefined;
}

export interface IBasketModel {
    items: TProductBasket[];
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

export interface IOrderPaymentForm {
    paymentMethod: string;
    address: string;
}

export interface IOrderContactsForm {
    email: string;
    phone: string;
}

export interface IOrderPayment extends IOrderPaymentForm {
    items: string[]
}

export interface IOrderContacts extends IOrderContactsForm {
    items: string[]
}

// Презентер - управление данными



// Состояния




