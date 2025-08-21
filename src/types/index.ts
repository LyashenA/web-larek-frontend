export interface IItem {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number | null
}

export interface IOrder {
    payment: string,
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[]
}

export interface IApiListResponse<T> {
    total: number,
    items: T[]
}

export interface IOrderResult {
    id: string,
    total: number
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;