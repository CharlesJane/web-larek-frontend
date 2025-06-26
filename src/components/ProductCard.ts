import { ID, IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export interface IProductCard<T> {
    id: ID;
    title: string;
    price: number;
    description?: string;
    image?: string;
    category?: string;
}

export class ProductCard<T> extends Component<IProductCard<T>> {
    protected _id: ID;
    protected _title: HTMLHeadingElement;
    protected _price: HTMLSpanElement;
    protected _description?: HTMLParagraphElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLSpanElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        if (!container) {
            console.log('Контейнер компонента не может быть undefined');
        }

        this._title = ensureElement<HTMLHeadingElement>('.card__title', this.container);
        this._price = ensureElement<HTMLSpanElement>('.card__price', this.container);
        this._description = container.querySelector('.card__text');
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
    }

    set id(value: ID) {
        if (!this.container) {
            console.log('Контейнер не инициализирован');
        }
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        this.setText(this._price, `${value} синапсов`);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    get category(): string {
        return this.container.dataset.category || '';
    }

    set category(value: string) {
        this.setText(this._category, value);
    }
}

interface GalleryActions {
    onClick: (event: MouseEvent) => void;
}

export class GalleryProductCard extends ProductCard<IProductCard<IProduct>> {
    constructor(container: HTMLElement, actions?: GalleryActions) {
        super(container)
        this._button = container as HTMLButtonElement;
        
        
        this._button.addEventListener('click', (event) => {
            event.preventDefault();
            actions?.onClick?.(event);
        });
    }
}

interface PreviewActions {
    onClick: (event: MouseEvent) => void;
}

export class PreviewProductCard extends ProductCard<IProductCard<IProduct>> {
    constructor(container: HTMLElement, actions?: PreviewActions) {
        super(container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', this.container)

        this._button.addEventListener('click', (event: MouseEvent) => {
            actions?.onClick?.(event);
            this.setDisabled(this._button, true)
        })
    }

    getContainer(): HTMLElement {
        return this.container;
    }
}

interface BasketCardActions {
    onClick: (event: MouseEvent) => void;
}

type TBasketCardType = Pick<IProduct, 'id' | 'title'| 'price'>

export class BasketProductCard extends ProductCard<TBasketCardType> {
    protected _index: HTMLSpanElement;
    private _currentIndex = 0;

    constructor(container: HTMLElement, actions?: BasketCardActions) {
        super(container);

        this._index = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        
        this._button.addEventListener('click', (event: MouseEvent) => {
            actions?.onClick?.(event);
        });
    }

    set index(value: number) {
        this._currentIndex = value;
        this.setText(this._index, String(value));
    }

    get index(): number {
        return this._currentIndex;
    }
}