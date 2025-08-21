import { ICardActions, IItem } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Card extends Component<IItem> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        this._button = container.querySelector(`.card__button`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        value ? this.setText(this._price, `${value} синапсов`) : this.setText(this._price, 'Бесценно');
    }
}

export class CatalogItem extends Card {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, category: string, actions?: ICardActions) {
        super(container, actions);
        this._category = ensureElement<HTMLElement>(`.card__category`, container);
        this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
        this.toggleClass(this._category, this.getCategoryClassName(category));
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    getCategoryClassName(value: string) {
        switch(value) {
            case 'софт-скил':
                return'card__category_soft';
                break
            case 'хард-скил':
                return 'card__category_hard';
                break
            case 'другое':
                return 'card__category_other';
                break
            case 'дополнительное':
                return 'card__category_additional';
                break
            case 'кнопка':
                return 'card__category_button';
                break
        }
    }
    
    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }
}

export class CardPreview extends CatalogItem {
    protected _description: HTMLElement;

    constructor(container: HTMLElement, categoryClassName: string, productState: boolean, actions?: ICardActions) {
        super(container, categoryClassName, actions);
        this._description = ensureElement<HTMLElement>(`.card__text`, container);
        this.toggleButtonText(productState);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    toggleButtonText(itemState: boolean) {
        itemState ? this.setText(this._button, 'Удалить из корзины') : this.setText(this._button, 'Купить');
    }
}