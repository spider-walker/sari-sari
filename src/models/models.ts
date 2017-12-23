export class Product {
    id: number;
    product_name: string;
    category_name?: string;
    category_id: number;
    product_price: number;
    initial_stock: number;
    quantity_added: number=0;
    quantity: number=0;
    quantity_sold: number=0;
    warning_point: number=0;
    description: string;
    date_created: string;
    market_price: number=0;
    total: number;
    txdate: string;


}
export class Category {
    category_id: number;
    category_name: string;
    products: Array<Product>;
}
export class ProductTx {
    id: number;
    pid: number;
    doctype: string;
    quantity: number=0;
    quantity_added: number=0;
    product_price: number=0;
    market_price: number=0;
    total: number;
    tx_date: string;

}


