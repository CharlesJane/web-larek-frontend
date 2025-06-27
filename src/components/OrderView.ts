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
            });
        });

        // Отслеживаем изменения полей
        this.container.addEventListener('input', () => {
            this.events.emit('orderPayment:changed');
        });
        
        // Отслеживаем выбор способа оплаты
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', (evt) => {
                this.toggleActiveButton(evt.target as HTMLButtonElement);
                this.events.emit('orderPayment:changed');
            });
        });

        // Обработчик клика на кнопку отправки
        this._buttonSubmit.addEventListener('click', () => {
            // Получаем данные из формы
            const paymentMethod = this._activeButton?.name;
            const address = this.address;
            
            // Эмитим событие с данными
            this.events.emit('orderpayment:set', {
                payment: paymentMethod,
                address: address
            });
            
            // Переходим к форме контактов
            this.events.emit('orderContacts:open');
        });
    }

    // Метод для переключения активных кнопок
    private toggleActiveButton(button: HTMLButtonElement): void {
        if (this._activeButton) {
            this.toggleClass(this._activeButton, 'button_alt-active', false);
        }

        this.toggleClass(button, 'button_alt-active', true);
        this._activeButton = button;
    }

    // Дополнительные сеттеры для работы с формой
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    get address(): string {
        return (this.container.elements.namedItem('address') as HTMLInputElement).value;
    }

    set valid(value: boolean) {
        this._buttonSubmit.disabled = !value;
    }
}

export class OrderContacts extends OrderForm<IOrderContactsForm> {
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Отслеживаем изменения полей
        this.container.addEventListener('input', () => {
            this.events.emit('orderContacts:changed');
        });

        // Обработчик клика на кнопку отправки
        this._buttonSubmit.addEventListener('click', () => {
            // Эмитим событие с данными
            this.events.emit('orderContacts:set', {
                email: this.email,
                phone: this.phone
            });
            
            this.events.emit('order:completed');
        });

        const emailInput = this.container.elements.namedItem('email');
        if (!emailInput) {
            console.error('Email input not found!');
        }

        this.container.addEventListener('input', (evt) => {
            const target = evt.target as HTMLInputElement;
            if (target.name === 'email') {
                this.email = target.value;
            }
            this.events.emit('orderContacts:changed');
        });
    }

    // Дополнительные сеттеры для работы с формой
    set email(value: string) {
        const input = this.container.elements.namedItem('email') as HTMLInputElement;
        console.log('Setting email:', value, input);
        input.value = value;
    }

    get email(): string {
        const input = this.container.elements.namedItem('email') as HTMLInputElement;
        console.log('Getting email:', input.value);
        return input.value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    get phone(): string {
        return (this.container.elements.namedItem('phone') as HTMLInputElement).value;
    }
}