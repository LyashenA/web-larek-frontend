import { IItem } from "../../types";
import { IEvents } from "../base/events";

export class ItemsDataModal {
    protected products: IItem[] = [];

    constructor(protected events: IEvents) {}

    get catalog() {
        return this.products;
    }

    getItem(id: string): IItem {
        return this.products.find(item => item.id === id);
    }

    getPrice(id: string): number {
        return this.getItem(id).price;
    }

    set catalog(items: IItem[]) {
        this.products = items;
        this.events.emit('items:changed');
    }

    getCategory(id: string): string {
        return this.getItem(id).category;
    }
}