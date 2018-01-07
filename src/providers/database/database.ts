import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Product, ProductTx, Category} from '../../models/models';
import {} from '../../models/models';
import {SqlDatabase} from 'ionix-sqlite';
const TABLE_PRODUCTS = "products";
const TABLE_CATEGORY = "category";
const TABLE_DB_VERSION = "db_version";
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
        let version = 13;

        let db_version = "CREATE TABLE IF NOT EXISTS  " + TABLE_DB_VERSION + "(version_no INTEGER PRIMARY KEY ,txdate date) ";
        this.dbPromise = SqlDatabase.open('_Sari.db', [db_version]);
        this.dbPromise
            .then(db => db.execute("INSERT or IGNORE INTO " + TABLE_DB_VERSION + " (version_no,txdate ) VALUES (?,date('now') )",
                [1]))
            .then(data => {
                console.log(data.insertId);
            }).catch(e => {
                console.log(e);
            });
        let createCategoryStatement = "CREATE TABLE IF NOT EXISTS "
            + TABLE_CATEGORY
            + " (category_id INTEGER PRIMARY KEY AUTOINCREMENT, "
            + "category_name text"
            + ")";

        this.dbPromise = SqlDatabase.open('_Sari.db', [createCategoryStatement]);

        let createProductStatement = "CREATE TABLE IF NOT EXISTS "
            + TABLE_PRODUCTS
            + " (id INTEGER PRIMARY KEY AUTOINCREMENT, "
            + "product_name text,"
            + "product_price  number,"
            + "category_id  number,"
            + "market_price  number,"
            + "initial_stock  number,"
            + "quantity  number,"
            + "warning_point  number,"
            + "description text,"
            + "date_created text"
            + ")";

        this.dbPromise = SqlDatabase.open('_Sari.db', [createProductStatement]);
        let insertProductTxStatement = "CREATE TABLE IF NOT EXISTS "
            + TABLE_PRODUCT_TX
            + " (id INTEGER PRIMARY KEY AUTOINCREMENT, "
            + "pid  number,"
            + "product_price  number,"
            + "market_price  number,"
            + "quantity_added  number,"
            + "quantity  number,"
            + "doctype text,"
            + "tx_date  text"
            + ")";
        this.dbPromise = SqlDatabase.open('_Sari.db', [insertProductTxStatement]);
        let add_category_id_to_products = "ALTER TABLE " + TABLE_PRODUCTS + " ADD COLUMN category_id number";
        let add_category_id_to_products_1 = "ALTER TABLE " + TABLE_PRODUCTS + " ADD COLUMN market_price number";
        let add_category_id_to_products_2 = "ALTER TABLE " + TABLE_PRODUCT_TX + " ADD COLUMN market_price number";
        let add_category_id_to_products_3 = "update " + TABLE_PRODUCT_TX + " set market_price=0 where  market_price=''|| market_price=null || market_price='undefined'";
        let add_category_id_to_products_4 = "update " + TABLE_PRODUCTS + " set market_price=0 where  market_price='' || market_price=null || market_price='undefined'";
        let add_category_id_to_products_5 = "ALTER TABLE " + TABLE_PRODUCT_TX + " ADD COLUMN quantity_added number";
        try {
            this.dbPromise
                .then(db => db.execute("select version_no from db_version order by version_no desc limit 1"))
                .then(resultSet => {
                    var p = resultSet.rows.item(0);
                    console.log("Db version " + p.version_no);
                    console.log("Next Db version " + version);
                    if (p.version_no != version) {
                        SqlDatabase.open('_Sari.db', [add_category_id_to_products])
                            .catch(e => {
                                console.log(e);
                            });;
                        SqlDatabase.open('_Sari.db', [add_category_id_to_products_1])
                            .catch(e => {
                                console.log(e);
                            });;
                        SqlDatabase.open('_Sari.db', [add_category_id_to_products_2])
                            .catch(e => {
                                console.log(e);
                            });;
                        SqlDatabase.open('_Sari.db', [add_category_id_to_products_3])
                            .catch(e => {
                                console.log(e);
                            });;
                        SqlDatabase.open('_Sari.db', [add_category_id_to_products_4])
                            .catch(e => {
                                console.log(e);
                            });;
                        SqlDatabase.open('_Sari.db', [add_category_id_to_products_5])
                            .catch(e => {
                                console.log(e);
                            });;
                        SqlDatabase.open('_Sari.db', ["INSERT or IGNORE INTO " + TABLE_DB_VERSION + " (version_no,txdate ) VALUES (" + version + ",date('now') )"])
                            .catch(e => {
                                console.log(e);
                            });;
                        SqlDatabase.open('_Sari.db', ["update " + TABLE_DB_VERSION + " set version_no=" + version + ",txdate=date('now')"])
                            .catch(e => {
                                console.log(e);
                            });;
                    }

                }).catch(error => {
                    console.log(error);
                });
        } catch (e) {
            console.log(e);
        }

    }
    public getProducts() {
        let products = Array<Product>();
        let sql = "SELECT " + TABLE_PRODUCTS + ".*,sum(" + TABLE_PRODUCT_TX+".quantity) as quantity_sold FROM " + TABLE_PRODUCTS;
        sql += " LEFT JOIN  " + TABLE_PRODUCT_TX+ " on " + TABLE_PRODUCT_TX+".pid=" + TABLE_PRODUCTS + ".id and doctype='sell' "
        console.log(sql)
        return this.dbPromise
            .then(db => db.execute(sql))
            .then(resultSet => {
                if (resultSet.rows.length > 0) {
                    for (let i = 0; i < resultSet.rows.length; i++) {
                        var p = resultSet.rows.item(i);
                        products.push(this.get_p(p))
                    }
                }
                return products;
            });

    }
    get_p(p) {
        let product = new Product();
        product.id = p.id;
        product.product_name = p.product_name;
        product.category_id = p.category_id;
        product.product_price = p.product_price;
        product.initial_stock = p.initial_stock;
        product.quantity = p.quantity;
        product.market_price = p.market_price;
        if (isNaN(parseInt(p.market_price))) {
            product.market_price = 0;
        }
        product.quantity_added = p.quantity_added;
        if (isNaN(parseInt(p.quantity_added))) {
            product.quantity_added = 0;
        }
        product.quantity_sold = p.quantity_sold;
        product.warning_point = p.warning_point;
        product.description = p.description;
        product.date_created = p.date_created;
        return product;
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
            .then(db => db.execute("update " + TABLE_CATEGORY + " set categor_name=?  where category_id=?", [category.category_name, category.category_id]))
            .then(data => {return data;}).then(data => {
                return category.category_id;
            });
    }
    public getCategory(category_id: number) {
        let category = new Category();
        return this.dbPromise
            .then(db => db.execute("SELECT * FROM " + TABLE_CATEGORY + " where category_id='" + category_id + "'"))
            .then(resultSet => {
                if (resultSet.rows.length > 0) {
                    var p = resultSet.rows.item(0);
                    category.category_id = p.category_id;
                    category.category_name = p.category_name;
                }
                return category;
            });

    }
    public getCategorys(search: string) {
        let sql = "SELECT * FROM " + TABLE_CATEGORY
        if (search == undefined || search.length == 0 || search == null) {

        } else {
            sql += " where (category_name like '%" + search + "%' )";
        }
        let categorys = Array<Category>();
        return this.dbPromise
            .then(db => db.execute(sql))
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
            .then(db => db.execute("SELECT a.*,b.category_name FROM "
                + TABLE_PRODUCTS + " a left JOIN " + TABLE_CATEGORY + " b   on a.category_id=b.category_id where id='" + id + "'"))
            .then(resultSet => {
                let product = new Product();
                if (resultSet.rows.length > 0) {
                    let p = resultSet.rows.item(0);
                    product = this.get_p(p)
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
        let sql = "SELECT " + TABLE_CATEGORY + ".category_name as category_name," + TABLE_PRODUCT_TX + ".market_price as market_price,"
            + TABLE_PRODUCTS + ".*,sum(" + TABLE_PRODUCT_TX + ".quantity) as quantity_sold ,sum(" + TABLE_PRODUCT_TX + ".quantity_added) as quantity_added ,"
            + " sum(" + TABLE_PRODUCT_TX + ".quantity*" + TABLE_PRODUCT_TX + ".market_price) as total "
            + " FROM "
            + TABLE_PRODUCTS
            + " JOIN " + TABLE_CATEGORY + " ON " + TABLE_CATEGORY + ".category_id = " + TABLE_PRODUCTS + ".category_id  "
            + " LEFT JOIN " + TABLE_PRODUCT_TX + " ON " + TABLE_PRODUCT_TX + ".pid = " + TABLE_PRODUCTS + ".id ";
        if (search == undefined || search.length == 0 || search == null) {

        } else {
            sql += " where (product_name like '%" + search + "%' or " + TABLE_PRODUCTS + ".category_id like '%" + search + "%')";
        }

        sql += " group by " + TABLE_PRODUCTS + ".id, product_name," + TABLE_PRODUCTS + ".category_id," + TABLE_PRODUCTS + ".product_price,initial_stock," + TABLE_PRODUCTS + ".quantity,warning_point,description,date_created"
        sql += " order by " + TABLE_PRODUCTS + ".category_id,product_name";
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
                        product.category_name = p.category_name;
                        product.product_price = p.product_price;
                        product.market_price = p.market_price;
                        product.initial_stock = p.initial_stock;
                        product.quantity = p.quantity;
                        product.total = p.total;
                        product.quantity_added = p.quantity_added;
                        if (isNaN(parseInt(p.quantity_added))) {
                            product.quantity_added = 0;
                        }
                        product.quantity_sold = p.quantity_sold;
                        product.warning_point = p.warning_point;
                        product.description = p.description;
                        product.date_created = p.date_created;
                        products.push(product)
                    }
                }
                return  Promise.resolve(products);
            }).catch(error => {
                console.log(error);
            });

    }
    public getSearchProductsByCategory(search: string, category_id: number): Promise<Product[]> {
        let products = Array<Product>();
        let sql = "SELECT " + TABLE_PRODUCTS + ".*,sum(" + TABLE_PRODUCT_TX + ".quantity) as quantity_sold FROM "
            + TABLE_PRODUCTS
            + " LEFT JOIN " + TABLE_PRODUCT_TX + " ON " + TABLE_PRODUCT_TX + ".pid = " + TABLE_PRODUCTS + ".id ";
        sql += " where 1=1";
        if (search == undefined || search.length == 0 || search == null) {

        } else {
            sql += " and (product_name like '%" + search + "%' or category_id like '%" + search + "%')";
        }
        if (category_id == undefined || category_id == 0 || category_id == null) {

        } else {
            sql += " and (category_id='" + category_id + "')";
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
                        product.quantity_added = p.quantity_added;
                        if (isNaN(parseInt(p.quantity_added))) {
                            product.quantity_added = 0;
                        }
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
            .then(db => db.execute("INSERT or IGNORE INTO " + TABLE_PRODUCTS + " (product_name,category_id,product_price,initial_stock,quantity,warning_point,description,date_created,market_price) VALUES (?, ?,?,?,?, ?,?,?,?)",
                [product.product_name, product.category_id, product.product_price, product.initial_stock, product.quantity, product.warning_point, product.description, product.date_created, product.market_price]))
            .then(data => {
                return data.insertId;
            });
    }
    public insertProductTx(product: ProductTx) {
        return this.dbPromise
            .then(db => db.execute("INSERT or IGNORE INTO " + TABLE_PRODUCT_TX + " (pid, doctype, quantity,quantity_added,  product_price,tx_date,market_price) VALUES (?, ?,?,?,?,?,?)",
                [product.pid, product.doctype, product.quantity, product.quantity_added, product.product_price, product.tx_date, product.market_price]))
            .then(data => {
                return data.insertId;
            });
    }
    public updateProduct(product: Product) {
        return this.dbPromise
            .then(db => db.execute("update " + TABLE_PRODUCTS + " set product_name=?,category_id=?,product_price=?,initial_stock=?,quantity=?,warning_point=?,description=?,date_created=?,market_price=? where id=?", [product.product_name, product.category_id, product.product_price, product.initial_stock, product.quantity, product.warning_point, product.description, product.date_created, product.market_price, product.id]))
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
    public getReportProductTxByCategory(from_date: string, to_date: string, category_id: number, product_id: number): Promise<Product[]> {
        let products = Array<Product>();
        let sql = "SELECT " + TABLE_PRODUCT_TX + ".tx_date as tx_date,"
            + TABLE_PRODUCT_TX + ".market_price as market_price, "
            + TABLE_PRODUCTS + ".*,"
            + "sum(" + TABLE_PRODUCT_TX + ".quantity) as quantity_sold, "
            + "sum(" + TABLE_PRODUCT_TX + ".quantity_added) as quantity_added "
            + " FROM "
            + TABLE_PRODUCTS
            + " LEFT JOIN " + TABLE_PRODUCT_TX + " ON " + TABLE_PRODUCT_TX + ".pid = " + TABLE_PRODUCTS + ".id ";
        sql += " where 1=1 and tx_date between '" + from_date + "'  and '" + to_date + "'";

        if (category_id == undefined || category_id == 0 || category_id == null) {

        } else {
            sql += " and (category_id='" + category_id + "')";
        }
        if (product_id == undefined || product_id == 0 || product_id == null) {

        } else {
            sql += " and (product_id='" + product_id + "')";
        }

        sql += " group by " + TABLE_PRODUCT_TX + ".tx_date," + TABLE_PRODUCTS + ".id, product_name,category_id," + TABLE_PRODUCTS + ".product_price,initial_stock," + TABLE_PRODUCTS + ".quantity,warning_point,description,date_created"
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
                        product.txdate = p.tx_date;
                        product.market_price = p.market_price;
                        if (isNaN(p.market_price)) {
                            product.market_price = 0;
                        }
                        product.quantity_added = p.quantity_added;
                        if (isNaN(parseInt(p.quantity_added))) {
                            product.quantity_added = 0;
                        }
                        products.push(product)
                    }
                }
                return Promise.resolve(products);;
            }).catch(error => {
                console.log(error);
            });

    }
    public getReportProductTxByMonth(): Promise<Product[]> {
        let products = Array<Product>();
        let sql = "SELECT strftime('%Y' , " + TABLE_PRODUCT_TX + ".tx_date) as valYear," + TABLE_PRODUCT_TX + ".market_price as market_price, "
            + " strftime('%m', " + TABLE_PRODUCT_TX + ".tx_date) as valMonth,"
            + TABLE_PRODUCTS + ".*,"
            + "sum(" + TABLE_PRODUCT_TX + ".quantity) as quantity_sold, "
            + "sum(" + TABLE_PRODUCT_TX + ".quantity_added) as quantity_added, "
            + TABLE_PRODUCTS + ".*,sum(" + TABLE_PRODUCT_TX + ".quantity*" + TABLE_PRODUCT_TX + ".market_price) as total "
            + "FROM "
            + TABLE_PRODUCTS
            + " LEFT JOIN " + TABLE_PRODUCT_TX + " ON " + TABLE_PRODUCT_TX + ".pid = " + TABLE_PRODUCTS + ".id "
            + " group by strftime('%Y', " + TABLE_PRODUCT_TX + ".tx_date), strftime('%m', " + TABLE_PRODUCT_TX + ".tx_date)," + TABLE_PRODUCTS + ".id"
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
                        product.market_price = p.market_price;
                        if (isNaN(p.market_price)) {
                            product.market_price = 0;
                        }
                        product.initial_stock = p.initial_stock;
                        product.quantity = p.quantity;
                        product.total = p.total;
                        product.quantity_sold = p.quantity_sold;
                        product.warning_point = p.warning_point;
                        product.description = p.description;
                        product.date_created = p.date_created;
                        product.txdate = p.valMonth + "-" + p.valYear;
                        if (p.valMonth == null || p.valYear == null) {
                            product.txdate = "12-2017";
                        }
                        product.quantity_added = p.quantity_added;
                        if (isNaN(parseInt(p.quantity_added))) {
                            product.quantity_added = 0;
                        }
                        products.push(product)
                    }
                }
                return (products);;
            }).catch(error => {
                console.log(error);
            });

    }
    public getReportProductTxByWeek() : Promise<Product[]> {
        let products = Array<Product>();
        let sql = "SELECT " + TABLE_PRODUCT_TX + ".market_price as market_price,strftime('%W', " + TABLE_PRODUCT_TX + ".tx_date, 'weekday 1') WeekNumber," +
            "max(date(" + TABLE_PRODUCT_TX + ".tx_date, 'weekday 1')) WeekStart," +
            "max(date(" + TABLE_PRODUCT_TX + ".tx_date, 'weekday 1', '+6 day')) WeekEnd, "
            + TABLE_PRODUCTS + ".*,"
            + "sum(" + TABLE_PRODUCT_TX + ".quantity) as quantity_sold, "
            + "sum(" + TABLE_PRODUCT_TX + ".quantity_added) as quantity_added "
            + "FROM "
            + TABLE_PRODUCTS
            + " LEFT JOIN " + TABLE_PRODUCT_TX + " ON " + TABLE_PRODUCT_TX + ".pid = " + TABLE_PRODUCTS + ".id "
            + " group by WeekNumber," + TABLE_PRODUCTS + ".id"
            + " order by WeekNumber," + TABLE_PRODUCTS + ".id";
        console.log(sql);

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
                        product.txdate = p.WeekNumber;
                        if (p.market_price == undefined || p.market_price == null || p.market_price == '') {
                            product.market_price = 0;
                        }
                        product.market_price = product.market_price;
                        products.push(product)
                    }
                }
                return  (products);;
            }).catch(error => {
                console.log(error);
            });

    }


}
