import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IOrderForm {
    errors: string;
    valid: boolean;
}

export abstract class OrderForm<T> extends Component<IOrderForm> {
    protected _errorSpan: HTMLElement;
    protected _buttonSubmit: HTMLButtonElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._buttonSubmit = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container);
        this._errorSpan = ensureElement<HTMLElement>('.form__errors', this.container);
        

        this.container.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`form:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._buttonSubmit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errorSpan, value);
    }
    
    render(state?: Partial<T & IOrderForm>) {
        if (!state) {
            return this.container;
        }

        const {valid, errors, ...inputs} = state;

        super.render({valid, errors});
        
        Object.assign(this, inputs);
        return this.container;

    }
}