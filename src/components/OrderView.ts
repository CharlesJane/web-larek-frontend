import { IOrderContactsForm, IOrderPaymentForm } from "../types";
import { IEvents } from "./base/events";
import { OrderForm } from "./common/Form";

export class OrderPayment extends OrderForm<IOrderPaymentForm> {
    private _paymentButtons: NodeListOf<HTMLButtonElement>;
    private _activeButton: HTMLButtonElement | null = null;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        // Получаем все кнопки оплаты
        this._paymentButtons = this.container.querySelectorAll('.order__buttons button');
        
        // Добавляем обработчики кликов на кнопки
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', (evt) => {
                this.toggleActiveButton(evt.target as HTMLButtonElement);
                this.events.emit('paymentMethod:change', { method: button.name });
            });
        });

        this._buttonSubmit.addEventListener('click', () => {
            this.events.emit('orderContacts:open')
        })
    }

    // Метод для переключения активных кнопок
    private toggleActiveButton(button: HTMLButtonElement): void {
        if (this._activeButton) {
            this.toggleClass(this._activeButton, 'button_alt-active', false);
        }

        this.toggleClass(button, 'button_alt-active', true);
        this._activeButton = button;

        this.events.emit('paymentMethod:selected', { method: button.name });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

export class OrderContacts extends OrderForm<IOrderContactsForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttonSubmit.addEventListener('click', () => {
            this.events.emit('order:completed')
        })
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}