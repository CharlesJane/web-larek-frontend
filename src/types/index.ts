// Интерфейсы данных

export interface IProduct {
    _id: string; // сохраняется в preview IProductsList
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

export interface IBasket {
    total: number;
    items: IProduct[];
}

export interface IProductsList {
    products: IProduct[];
    preview: string | null; // сюда уходит id выбранной карточки

    getProduct(productId:string): IProduct;
}

export interface IOrderData {
    setOrderInfo(orderData: IOrder): void; //отправляем инфо о данных заказчика
    checkOrderInfoValidation(data: Record<keyof (TOrderContacts | TOrderInfo | TPageTotal), string>): boolean; // валидируем отправляемые данные
    setOrderBasketInfo(basketData: IBasket): void; // отправляем инфо о выбранных товаров (лист) и общую сумму заказа
}

export type TPageTotal = Pick<IBasket, 'items'>;

export type TProductBase = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>;

export type TProductBasket = Pick<IProduct, 'title' | 'price'>;

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;

export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

export type TBasketSuccess = Pick<IBasket, 'total'>;
