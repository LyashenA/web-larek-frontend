import { IOrder } from "../../types";
import { IEvents } from "../base/events";

export class OrderModel {
    protected _order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: []
    };

    constructor(protected events: IEvents) {}

    addItem(productId: string, price: number) {
        if (!this._order.items.includes(productId)) {
            this._order.items.push(productId);
            this._order.total += price;
            this.events.emit('order:changed', this._order);
        }
    }

    removeItem(productId: string, price: number) {
        this._order.items = this._order.items.filter(id => id !== productId);
        this._order.total -= price;
        if (this._order.total < 0) this._order.total = 0;
        this.events.emit('order:changed', this._order);
    }

    checkItem(productId: string): boolean {
        return this._order.items.includes(productId) ? true : false;
    }

    setOrder<T extends Partial<IOrder>>(data: T) {
        Object.assign(this._order, data);
        this.events.emit('order:changed', this._order);
    }

    getTotal(): number {
        return this._order.total;
    }

    get order(): IOrder {
        return this._order;
    }

    clearOrder() {
        this._order = {
            payment: '',
            email: '',
            phone: '',
            address: '',
            total: 0,
            items: []
        };
        this.events.emit('order:changed', this._order);
    }
}