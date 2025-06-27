import { IOrderContactsForm, IOrderPaymentForm } from "../types";
import { IEvents } from "./base/events";
import { OrderForm } from "./common/Form";

export class OrderPayment extends OrderForm<IOrderPaymentForm> {
    private _paymentButtons: NodeListOf<HTMLButtonElement>;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        // Получаем все кнопки оплаты
        this._paymentButtons = this.container.querySelectorAll('.order__buttons button');
        
        // Добавляем обработчики кликов на кнопки
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', (evt) => {
                this.onInputChange('payment', button.name);
            });
        });
    }

    // Метод для переключения активных кнопок
    set payment(value: string) {
        this._paymentButtons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === value);
        })
    }

    // Дополнительные сеттеры для работы с формой
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

export class OrderContacts extends OrderForm<IOrderContactsForm> {
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    // Дополнительные сеттеры для работы с формой
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}