import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Product, ProductTx, Category} from '../../models/models';
import {} from '../../models/models';
import {SqlDatabase} from 'ionix-sqlite';
const TABLE_PRODUCTS = "products";
const TABLE_CATEGORY = "category";
const TABLE_PRODUCT_TX = "product_tx";
@Injectable()
export class Database {
    private dbPromise: Promise<SqlDatabase>;
    public product: Product;
    public category: Category;
    public productTx: ProductTx;
    public constructor(private platform: Platform) {
        this.platform.ready().then(() => {
            this.opendb(1);
        });
    }
    public opendb(id: any) {
        let createCategoryStatement = "CREATE TABLE IF NOT EXISTS "
            + TABLE_CATEGORY
            + " (category_id INTEGER PRIMARY KEY AUTOINCREMENT, "
            + "category_name text"
            + ")";
            
        this.dbPromise = SqlDatabase.open('SariSari.db', [createCategoryStatement]);
        
        let createProductStatement = "CREATE TABLE IF NOT EXISTS "
            + TABLE_PRODUCTS
            + " (id INTEGER PRIMARY KEY AUTOINCREMENT, "
            + "product_name text,"
            + "product_price  number,"
            + "initial_stock  number,"
            + "quantity  number,"
            + "warning_point  number,"
            + "description text,"
            + "date_created text"
            + ")";
            
        this.dbPromise = SqlDatabase.open('SariSari.db', [createProductStatement]);
        let insertProductTxStatement = "CREATE TABLE IF NOT EXISTS "
            + TABLE_PRODUCT_TX
            + " (id INTEGER PRIMARY KEY AUTOINCREMENT, "
            + "pid  number,"
            + "product_price  number,"
            + "quantity  number,"
            + "doctype text,"
            + "tx_date  text"
            + ")";
        this.dbPromise = SqlDatabase.open('SariSari.db', [insertProductTxStatement]);
        let add_category_id_to_products = "ALTER TABLE "+TABLE_PRODUCTS+" ADD COLUMN category_id INTEGER";
        this.dbPromise = SqlDatabase.open('SariSari.db', [add_category_id_to_products]);
        console.log("Starting db" + id);
    }
    public getProducts() {
        let products = Array<Product>();
        return this.dbPromise
            .then(db => db.execute("SELECT * FROM " + TABLE_PRODUCTS))
            .then(resultSet => {
                if (resultSet.rows.length > 0) {
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        var p = resultSet.rows.item(i);
                        let product = new Product();
                        product.id = p.id;
                        product.product_name = p.product_name;
                        product.category_id = p.category_id;
                        product.product_price = p.product_price;
                        product.initial_stock = p.initial_stock;
                        product.quantity = p.quantity;
                        product.warning_point = p.warning_point;
                        product.description = p.description;
                        product.date_created = p.date_created;
                        products.push(product)
                    }
                }
                return products;
            });

    }
    public insertCategory(category: Category) {
        return this.dbPromise
            .then(db => db.execute("INSERT or IGNORE INTO " + TABLE_CATEGORY + " (category_name ) VALUES (? )",
                [category.category_name]))
            .then(data => {
                return data.insertId;
            });
    } 
    public updateCategory(category: Category) {
        return this.dbPromise
            .then(db => db.execute("update " + TABLE_CATEGORY+ " set categor_name=?  where category_id=?", [category.category_name, category.category_id]))
            .then(data => {return data;}).then(data => {
                return category.category_id;
            });
    }
    public getCategory() {
        let category = new Category();
        return this.dbPromise
            .then(db => db.execute("SELECT * FROM " + TABLE_PRODUCTS))
            .then(resultSet => {
                if (resultSet.rows.length > 0) {
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        var p = resultSet.rows.item(i); 
                        category.category_id = p.category_id;
                        category.category_name = p.category_name;  
                    }
                }
                return category;
            });

    }
    public getCategorys() {
        let categorys = Array<Category>();
        return this.dbPromise
            .then(db => db.execute("SELECT * FROM " + TABLE_CATEGORY))
            .then(resultSet => {
                if (resultSet.rows.length > 0) {
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        var p = resultSet.rows.item(i);
                        let category = new Category();
                        category.category_id = p.category_id;
                        category.category_name = p.category_name; 
                        categorys.push(category)
                    }
                }
                return categorys;
            });

    }
    public getProductById(id: number) {
        return this.dbPromise
            .then(db => db.execute("SELECT * FROM " + TABLE_PRODUCTS + " where id='" + id + "'"))
            .then(resultSet => {
                let product = new Product();
                if (resultSet.rows.length > 0) {
                    var p = resultSet.rows.item(0);
                    product.id = p.id;
                    product.product_name = p.product_name;
                    product.category_id = p.category_id;
                    product.product_price = p.product_price;
                    product.initial_stock = p.initial_stock;
                    product.quantity = p.quantity;
                    product.warning_point = p.warning_point;
                    product.description = p.description;
                    product.date_created = p.date_created;
                }
                return product;
            });

    }
    public delete_product(id: number) {
        return this.dbPromise
            .then(db => db.execute("delete FROM " + TABLE_PRODUCTS + " where id='" + id + "'"))
            .then(resultSet => {
                return resultSet;
            });

    }

    public getSearchProducts(search: string): Promise<Product[]> {
        let products = Array<Product>();
        let sql = "SELECT " + TABLE_PRODUCTS + ".*,sum(" + TABLE_PRODUCT_TX + ".quantity) as quantity_sold FROM "
            + TABLE_PRODUCTS
            + " LEFT JOIN " + TABLE_PRODUCT_TX + " ON " + TABLE_PRODUCT_TX + ".pid = " + TABLE_PRODUCTS + ".id ";
        if (search == undefined || search.length == 0 || search == null) {

        } else {
            sql += " where (product_name like '%" + search + "%' or category_id like '%" + search + "%')";
        }

        sql += " group by " + TABLE_PRODUCTS + ".id, product_name,category_id," + TABLE_PRODUCTS + ".product_price,initial_stock," + TABLE_PRODUCTS + ".quantity,warning_point,description,date_created"
        return this.dbPromise
            .then(db => db.execute(sql))
            .then(resultSet => {
                if (resultSet.rows.length > 0) {
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        var p = resultSet.rows.item(i);
                        let product = new Product();
                        product.id = p.id;
                        product.product_name = p.product_name;
                        product.category_id = p.category_id;
                        product.product_price = p.product_price;
                        product.initial_stock = p.initial_stock;
                        product.quantity = p.quantity;
                        product.quantity_sold = p.quantity_sold;
                        product.warning_point = p.warning_point;
                        product.description = p.description;
                        product.date_created = p.date_created;
                        products.push(product)
                    }
                }
                return Promise.resolve(products);;
            }).catch(error => {
                console.log(error);
            });

    }
    public insertProduct(product: Product) {
        return this.dbPromise
            .then(db => db.execute("INSERT or IGNORE INTO " + TABLE_PRODUCTS + " (product_name,category_id,product_price,initial_stock,quantity,warning_point,description,date_created) VALUES (?, ?,?,?,?, ?,?,?)",
                [product.product_name, product.category_id, product.product_price, product.initial_stock, product.quantity, product.warning_point, product.description, product.date_created]))
            .then(data => {
                return data.insertId;
            });
    }
    public insertProductTx(product: ProductTx) {
        return this.dbPromise
            .then(db => db.execute("INSERT or IGNORE INTO " + TABLE_PRODUCT_TX + " (pid, doctype, quantity,  product_price,tx_date) VALUES (?, ?,?,?,?)",
                [product.pid, product.doctype, product.quantity, product.product_price, product.tx_date]))
            .then(data => {
                return data.insertId;
            });
    }
    public updateProduct(product: Product) {
        return this.dbPromise
            .then(db => db.execute("update " + TABLE_PRODUCTS + " set product_name=?,category_id=?,product_price=?,initial_stock=?,quantity=?,warning_point=?,description=?,date_created=? where id=?", [product.product_name, product.category_id, product.product_price, product.initial_stock, product.quantity, product.warning_point, product.description, product.date_created, product.id]))
            .then(data => {return data;}).then(data => {
                return product.id;
            });
    }
    public getCriticalProducts(search: string) {
        let products = Array<Product>();
        let sql = "SELECT " + TABLE_PRODUCTS + ".*,sum(" + TABLE_PRODUCT_TX + ".quantity) as quantity_sold FROM "
            + TABLE_PRODUCTS
            + " LEFT JOIN " + TABLE_PRODUCT_TX + " ON " + TABLE_PRODUCT_TX + ".pid = " + TABLE_PRODUCTS + ".id ";
        sql += " where " + TABLE_PRODUCTS + ".quantity<=" + TABLE_PRODUCTS + ".warning_point ";
        if (search == undefined || search.length == 0 || search == null) {

        } else {
            sql += " and (product_name like '%" + search + "%' or category_id like '%" + search + "%')";
        }

        sql += " group by " + TABLE_PRODUCTS + ".id, product_name,category_id," + TABLE_PRODUCTS + ".product_price,initial_stock," + TABLE_PRODUCTS + ".quantity,warning_point,description,date_created"
        return this.dbPromise
            .then(db => db.execute(sql))
            .then(resultSet => {
                if (resultSet.rows.length > 0) {
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        var p = resultSet.rows.item(i);
                        let product = new Product();
                        product.id = p.id;
                        product.product_name = p.product_name;
                        product.category_id = p.category_id;
                        product.product_price = p.product_price;
                        product.initial_stock = p.initial_stock;
                        product.quantity = p.quantity;
                        product.quantity_sold = p.quantity_sold;
                        product.warning_point = p.warning_point;
                        product.description = p.description;
                        product.date_created = p.date_created;
                        products.push(product)
                    }
                }
                return products;
            }).catch(error => {
                console.log(error);
            });

    }

}
