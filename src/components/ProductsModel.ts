import { IProductsModel, IProduct } from "../types";
import { IEvents } from "./base/events";

export class ProductsModel implements IProductsModel {
    //     Класс отвечает за хранение карточек товаров.
    // Конструктор класса принимает экземпляр брокера событий.
    // В полях класса хранятся следующие данные:
    protected _total: number;
    protected _items: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set items(productArray: IProduct[]) {
        this._items = productArray;
    }

    get items() {
        return this._items;
    }

    set total(productsTotal: number) {
        this._total = productsTotal;
    }

    get total(): number {
        return this._total;
    }

    addProduct(product: IProduct): void {
        if (!this._items.some(pr => pr.id === product.id)) {
            this._items.push(product);
            this._total++;
            this.events.emit('product:added', product);
        } else {
            console.log(`Товар с ID ${product.id} уже добавлен`);
        }
    }

    deleteProduct(id: string): void {
        this._items = this._items.filter(product => product.id !== id);
        this._total--;
        this.events.emit('product:deleted');
    }

    // Метод для получения карточки по ID
    getProduct(id: string): IProduct | undefined {
        return this._items.find(product => product.id === id);
    }
}