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

export interface IUserOrder { // данные, уходящие к серверу для оформления заказа
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
    items: string[];
}

export type TProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;

export type FormErrors = Partial<Record<keyof IUserOrder, string>>;

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
    order: IUserOrder;
    validateOrder(): FormErrors;
    initOrder(): void;
    setOrderField(field: keyof IUserOrder, value: string): void;
}

// Компоненты отображения

export interface IOrderPaymentForm {
    payment: string;
    address: string;
}

export interface IOrderContactsForm {
    email: string;
    phone: string;
}

export interface IOrderPayment extends IOrderPaymentForm {
    items: string[];
}

export interface IOrderContacts extends IOrderContactsForm {
    items: string[];
}

export interface ISuccess {
    id: ID;
    total: number;
} 


