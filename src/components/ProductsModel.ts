import { IProductsModel, IProduct } from "../types";
import { IEvents } from "./base/events";

export class ProductsModel implements IProductsModel {
    //     Класс отвечает за хранение карточек товаров.
    // Конструктор класса принимает экземпляр брокера событий.
    // В полях класса хранятся следующие данные:
    items: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(productArray: IProduct[]) {
        this.items = productArray;
    }

    getItems() {
        return this.items;
    }

    // Метод для получения карточки по ID
    getProduct(id: string): IProduct | undefined {
        return this.items.find(product => product.id === id);
    }
}