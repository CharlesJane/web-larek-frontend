import { IProductsModel, IProduct } from "../types";
import { IEvents } from "./base/events";

export class ProductsModel implements IProductsModel {
    //     Класс отвечает за хранение карточек товаров.
    // Конструктор класса принимает экземпляр брокера событий.
    // В полях класса хранятся следующие данные:
    _items: IProduct[] = [];
    preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(productArray: IProduct[]) {
        this._items = productArray;
        this.events.emit('items:changed', { items: this._items });
    }

    getItems() {
        return this._items;
    }

    // Метод для получения карточки по ID
    getProduct(id: string): IProduct | undefined {
        return this._items.find(product => product.id === id);
    }

    setPreview(item: IProduct) {
        this.preview = item.id;
    }
}