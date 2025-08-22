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

export interface IItemCard extends IItem {
    index: number
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

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IModalData {
    content: HTMLElement;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
    total: number;
}

export interface ISuccessActions {
    onClick: () => void;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;