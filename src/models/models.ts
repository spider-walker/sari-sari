export class Product {
    id: number;
    product_name: string;
    category_name?:string;
    category_id: number;
    product_price: number;
    initial_stock: number;
    quantity: number;
    quantity_sold:number;
    warning_point: number;
    description: string;
    date_created: string;


}
export class Category {
    category_id: number;
    category_name: string;
}
export class ProductTx {
    id: number;
    pid: number;
    doctype: string; 
    quantity: number; 
    product_price:number;
    tx_date: string; 

}
 

