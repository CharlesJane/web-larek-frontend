import { IBasketModel, TProductBasket } from "../types";
import { IEvents } from "./base/events";


export class BasketModel implements IBasketModel {
    private _items: TProductBasket[] = [];
    protected events: IEvents;
    
    constructor(events: IEvents) {
        this.events = events;
    }

    // Метод получения всех товаров
    get items(): TProductBasket[] {
        return this._items;
    }

    // Метод добавления товара в корзину
    addProduct(product: TProductBasket): void {
        if (this.hasProduct(product.id)) {
            console.log(`Товар с ID ${product.id} уже добавлен`);
            return;
        }
        
        this._items.push(product);
        this.events.emit('basket:added', product);
    }

    // Метод удаления товара из корзины по ID
    deleteProduct(productId: string): void {
        this._items = this.items.filter(item => item.id !== productId);
        this.events.emit('basket:deleted');
    }

    // Метод очистки корзины
    clear(): void {
        this._items = [];
        this.events.emit('basket:cleared');
    }

    // Метод получения количества товаров
    getCount(): number {
        return this.items.length;
    }

    // Метод подсчета общей суммы
    getTotal(): number {
        return this.items.reduce((total, item) => {
            // Проверяем, что цена не null
            return item.price !== null ? total + item.price : total;
        }, 0);
    }

    // Метод проверки наличия товара в корзине
    hasProduct(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }

    getProductIds(): string[] {
        return this.items.map(item => item.id);
    }
}
