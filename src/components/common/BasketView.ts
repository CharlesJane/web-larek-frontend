import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export interface IBasketView {
    items: HTMLLIElement[];
    totalPrice: HTMLSpanElement;
}

export class BasketView extends Component<IBasketView> {
    protected _basketList: HTMLElement;
    protected _totalPrice: HTMLSpanElement;
    protected _buttonOrder: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this._totalPrice = ensureElement<HTMLSpanElement>('.basket__price', container);
        this._buttonOrder = ensureElement<HTMLButtonElement>('.button', container);
        
        if (this._buttonOrder) {
            this._buttonOrder.addEventListener('click', () => {
                events.emit('orderForm:open');
            });
        }
        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._basketList.replaceChildren(...items);
            this.events.emit('basket:set');
        } else {
            this._basketList.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'В корзине пока пусто, выберите что-нибудь по душе :)'
            }));
        }
    }

    set totalPrice(total: number) {
        this.setText(this._totalPrice, `${total} синапсов`);
    }
}