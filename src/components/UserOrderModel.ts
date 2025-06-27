import { FormErrors, IUserOrder, IUserOrderModel } from "../types";
import { IEvents } from "./base/events";

export class UserOrderModel implements IUserOrderModel {
    protected events: IEvents;
    order: IUserOrder = {
        email: '',
        phone: '',
        payment: null,
        address: ''
    };
    formErrors: FormErrors = {};

    constructor(order: IUserOrder, events: IEvents) {
        this.order = order;
        this.events = events;
    }

    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }

    get orderData(): IUserOrder {
        return this.order;
    }

    setOrderField(field: keyof IUserOrder, value: string) {
        this.order[field] = value;

        this.emitChanges('order:changed', {field: field})
    }

    validateOrder() {
        const errors: FormErrors = {};

        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }

        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this.order.payment) {
            errors.payment = 'Необходимо указать вид оплаты';
        }

        this.formErrors = errors;

        return errors;
    }

    initOrder() {
        this.order = {
            payment: null,
            email: '',
            phone: '',
            address: '',
        };
        this.emitChanges('order:changed')
    }
}