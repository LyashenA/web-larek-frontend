import { EventEmitter } from './components/base/events';
import { Card, CardPreview, CatalogItem } from './components/view/Card';
import { Basket } from './components/view/Basket';
import { Modal } from './components/common/Modal';
import { ContactsForm } from './components/view/ContactsForm';
import { ItemsDataModal } from './components/dataModels/ItemsDataModel';
import { OrderModel } from './components/dataModels/OrderModel';
import { OrderForm } from './components/view/OrderForm';
import { Page } from './components/view/Page';
import { Success } from './components/view/Success';
import { Validation } from './components/base/Validation';
import { WebLarekApi } from './components/WebLarekApi';
import './scss/styles.scss';
import { IItem, IOrder } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

// Обработчик событий
const events = new EventEmitter();

// API запросы
const api = new WebLarekApi(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модели данных
const productsData = new ItemsDataModal(events);
const orderData = new OrderModel(events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Другие части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

// Константы валидации форм заказа
const formErrorsMessages = {
    payment: 'Выберите способ оплаты',
    address: 'Необходимо указать адрес',
    email: 'Необходимо указать email',
    phone: 'Необходимо указать телефон'
};
const formValidation = new Validation( formErrorsMessages, events);

// Изменились элементы каталога
events.on('items:changed', () => {
    page.catalog = productsData.catalog.map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), productsData.getCategory(item.id), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            category: item.category,
            image: item.image,
            price: item.price,
        });
    });
});

// Показываем модальное окно товара
events.on('card:select', (item: IItem) => {
    const productState = orderData.checkItem(item.id);
    const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), productsData.getCategory(item.id), productState, {
        onClick: () => {
            if (item.price !== null) { // Если товар можно добавить в корзину
                // Если товар в корзине, то удалить его, если нет, то добавить
                orderData.checkItem(item.id) ? orderData.removeItem(item.id, item.price) : orderData.addItem(item.id, item.price);
                // Поменять надпись на кнопке
                cardPreview.toggleButtonText(orderData.checkItem(item.id));
            }
        }
    });

    item.price !== null ? cardPreview.toggleButtonText(productState) : cardPreview.toggleButtonDisabled(true);

    modal.render({
        content: cardPreview.render({
            title: item.title,
            category: item.category,
            image: item.image,
            price: item.price,
            description: item.description
        })
    })
});

// Открыть корзину
events.on('basket:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render()
        ])
    });
});

// Заказ изменился
events.on('order:changed', () => {
    const cartCount = orderData.order.items.length;
    page.counter = cartCount;

    basket.valid = !!cartCount;

    basket.items = orderData.order.items.map((item, index) => {
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                orderData.removeItem(item, productsData.getPrice(item));
                basket.total = orderData.getTotal();
            }
        });
        return card.render({
            title: productsData.getItem(item).title,
            price: productsData.getItem(item).price,
            index: index
        });
    });
    
    basket.total = orderData.getTotal();
});

// Открыть форму заказа: шаг 1
events.on('order:open', () => {
    modal.render({
        content: orderForm.render({
            address: '',
            valid: false,
            errors: []
        })
    });

    formValidation.formField = { payment: '', address: ''};
});

// На форме нажата кнопка "далее"
events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });

    formValidation.formField = { email: '', phone: ''};
});

// Изменилось состояние валидации формы 1
events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { payment, address } = errors;
    orderForm.valid = !payment && !address;
    orderForm.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации формы 2
events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { email, phone } = errors;
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменился способ оплаты
events.on('payment:selected', (data: { value: string }) => {
    formValidation.setOrderField('payment', data.value);
});

// Изменилось одно из полей инпутов
events.on('input:change', (data: { field: keyof IOrder, value: string }) => {
    formValidation.setOrderField(data.field, data.value);
});

// форма заполнена и прошла валидацию
events.on('order:ready', (data) => {
    orderData.setOrder(data);
});

// нажата кнопка оплатить
events.on('contacts:submit', () => {
    api.postOrder(orderData.order)
        .then(data => {
            orderData.clearOrder();
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                }
            });

            modal.render({
                content: success.render({
                    total: data.total
                })
            });
        })
        .catch(err => console.log(err));
});

events.on('modal:open', () => {
    page.locked = true; // Блокируем прокрутку страницы если открыта модалка
});

events.on('modal:close', () => {
    page.locked = false; // ... и разблокируем
    if (formValidation.formField) {
        formValidation.clearValidation(); // очищаем объект валидации, если он был заполнен в этом окне
    }
});

// Получаем товары с сервера
api.getProductList()
    .then(data => {
        productsData.catalog = data;
    })
    .catch(err => console.error(err));



