import { IProductsList, IProduct, IUserOrder, ISuccess, IOrderData} from '../types';
import { Api, ApiListResponse } from './base/api';

export interface ILarekAPI {
    getProductsList: () => Promise<IProductsList>;
    getProduct: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrderData) => Promise<ISuccess>;
}


export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }
    

    getProductsList(): Promise<IProductsList> {
    return this.get('/product/')
        .then((data: ApiListResponse<IProduct>) => {
            const modifiedItems = data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }));
            return {
                _items: modifiedItems,
                total: data.total // если есть total в ответе
            } as IProductsList;
        });
}

    orderProducts(order: IOrderData): Promise<ISuccess> {
        return this.post('/order', order).then(
            (data: ISuccess) => data
        );
    }
}