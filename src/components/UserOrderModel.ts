import { IUserOrder, IUserOrderModel } from "../types";
import { IEvents } from "./base/events";

export class UserOrderModel implements IUserOrderModel{
    private _orderData: IUserOrder;
    protected events: IEvents;


    constructor(orderData: IUserOrder, events: IEvents) {
        this._orderData = orderData;
        this.events = events;
    }

    // Метод для получения всех данных
    get orderData(): IUserOrder {
        return this.orderData;
    }

    // Метод для обновления данных заказа
    updateOrder(newData: Partial<IUserOrder>): void {
        this._orderData = {
            ...this._orderData,
            ...newData
        };
        this.events.emit('userOrder:updated', newData);
    }

    // Валидация данных заказа
    validate(): boolean {
        const { payment, email, phone, address } = this._orderData;
        
        // Простая валидация полей
        if (!payment || !email || !phone || !address) {
            return false;
        }
        
        return true;
    }

    clearOrderData(): void {
        this._orderData = {
            payment: null,
            email: '',
            phone: '',
            address: '',
        };
        this.events.emit('userOrder:cleared');
    }

    getValidatedData(): IUserOrder | null {
        if (this.validate()) {
            // Если валидация прошла успешно, возвращаем копию данных
            this.events.emit('userOrder:ready', this._orderData);
            const validatedData = {
                ...this._orderData
            };
            // Очищаем данные после успешной валидации
            return validatedData;
        }
        // Если валидация не прошла, возвращаем null
        return null;
    }
}