// #### Класс ProductCard 

// Отвечает за отображение карточки, задавая в карточке данные названия, категории, изображения, описания и цены. Класс используется для отображения карточек на странице сайта и в модальных окнах.\
// В конструктор класса передается DOM-элемент темплейта, что позволяет по необходимости формировать разные представления карточки в верстке. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми генерируются соответствующие события.\
// Поля класса содержать элементы разметки карточек. Конструктор, кроме темплейта, принимает экземпляр 'EventEmitter' для инициации событий.

// Методы: 
// - setProduct(productData: IProduct, productId: string): void - заполняет атрибуты элементов карточки данными
// - isProductInBasket(productId: string): boolean - управляет элементом кнопки, отображая active/disabled состояния, в зависимости от наличия товара в корзине
// - render(): HTMLElement - возвращает полностью заполненную карточку
// - геттер id возвращает уникальный id карточки
import { EventEmitter } from './base/events';
import { Component } from "./base/Component";
import { ID, IProduct, TProductBase, TProductBasket } from "../types";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}


export class ProductCard<T> extends Component<T>{
    protected events: EventEmitter;
    protected cardId: ID;
    protected cardTitle: HTMLHeadingElement;
    protected cardPrice: HTMLSpanElement;
    protected _cardImage?: HTMLImageElement;
    protected cardCategory?: HTMLSpanElement;
    protected cardDescription?: HTMLParagraphElement;
    protected cardButton?: HTMLButtonElement;


    constructor(protected container: HTMLElement, events: EventEmitter, actions?: ICardActions) {
        super(container);
        this.events = events;

		this.cardTitle = this.container.querySelector('.card__title');
		this.cardPrice = this.container.querySelector('.card__price');
		this._cardImage = this.container.querySelector('.card__image');
        this.cardCategory = this.container.querySelector('.card__category');
		this.cardDescription = this.container.querySelector('.card__text');

        if (actions?.onClick) {
            if (this.cardButton) {
                this.cardButton.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set description(text: string) {
        this.cardDescription.textContent = text;
    };
    
    set title(heading: string) {
        this.cardTitle.textContent = heading;
    };

    set category(type: string) {
        this.cardCategory.textContent = type;
    }

    set price(amount: number) {
        this.cardPrice.textContent = `${amount} синопсов`;
    }

    set image(path: string) {
        this.setImage(this._cardImage, path, this.cardTitle.textContent)
    }

	get id() {
		return this.cardId;
	}

    set id(id) {
		this.cardId = id;
	}

    setButtonClickHandler(handler: () => void): void {
        if (this.cardButton) {
            this.cardButton.addEventListener('click', handler);
        }
    }
}

export class CatalogProductCard extends ProductCard<TProductBase> {
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);
        
        this.cardButton = container.querySelector('.gallery__item');
    }
}

export class PreviewProductCard extends ProductCard<IProduct> {
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.cardButton = container.querySelector('.card__button');
    }
}

export class BasketProductCard extends ProductCard<TProductBasket> {
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.cardButton = container.querySelector('.basket__item-delete .card__button');
    }
}