import { FormErrors, IOrder } from "../../types";
import { IEvents } from "./events";

export class Validation {
    protected formData: Partial<IOrder>;
    protected errorsTexts: FormErrors;
    protected errorsKeys: (keyof Partial<IOrder>)[];
    protected formErrors: Partial<Record<keyof IOrder, string>> = {};

    constructor( errors: FormErrors, protected events: IEvents ) {
        this.errorsTexts = errors;
        this.errorsKeys = [];
        this.formErrors = {};
    }

    set formField( data: Partial<IOrder> ) {
        this.formData = data;
    }

    // заполнить объект полей формы
    setOrderField<K extends keyof IOrder>(field: K, value: IOrder[K]) {
        this.formData[field] = value;
        if (this.validateForm()) {
            this.events.emit('order:ready', this.formData);
        }
        this.clearErrors();
    }

    clearErrors() {
        this.errorsKeys = [];
        this.formErrors = {};
    }

    clearValidation() {
        this.formData = {};
    }

    // получить массив ключей пустых полей формы
    getEmptyProps<T extends object>(obj: Partial<T>): (keyof T)[] {
        return (Object.keys(obj) as (keyof T)[]).filter(key => !obj[key]);
    }

    // заполнить объект errors, в котором ключ - имя пустого поля формы, а значение - текст ошибки соответсвующего поля
    setFormErrors(keys: (keyof Partial<IOrder>)[], errors: Partial<Record<keyof IOrder, string>>) {
        if (keys) {
            keys.forEach(key => {
                errors[key] = this.errorsTexts[key];
            });
        }
    }

    // Найти имена пустых полей формы,
    // создать объект { поле: текст ошибки }
    // создать событие: ошибки изменились
    validateForm() {
        this.errorsKeys = this.getEmptyProps(this.formData);
        this.setFormErrors(this.errorsKeys, this.formErrors);

        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(this.formErrors).length === 0;
    }
}