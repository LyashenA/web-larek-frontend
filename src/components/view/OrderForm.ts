import { IOrder } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";

export class OrderForm extends Form<Partial<IOrder>> {
    protected _paymentButtons: HTMLElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); 

        this._paymentButtons = ensureElement<HTMLButtonElement>('.order__buttons', this.container);
        
        this._paymentButtons.addEventListener('click', (evt) => {
            const target = evt.target as HTMLButtonElement;
            if (target.tagName === 'BUTTON') {
                events.emit('payment:selected', {value: target.textContent});
            }
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}