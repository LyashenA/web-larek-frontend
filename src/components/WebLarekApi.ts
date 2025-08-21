import { IApiListResponse, IItem, IOrder, IOrderResult } from "../types";
import { Api } from "./base/api";

export class WebLarekApi extends Api {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductList(): Promise<IItem[]> {
    return this.get('/product').then((data: IApiListResponse<IItem>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image
        }))
    );
}

    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}