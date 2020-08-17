import Table from './lib/table';
import Migration from './lib/migration';

export default function($: Migration) {

  $.table("stock", (T: Table) => {
    T.column("product_id").type("int").linkTo("product");
    T.column("station_id").type("int").linkTo("station")
    T.column("project_id","int").nullable().linkTo("project");
    T.column("project_raw_id","int").nullable().linkTo("project");
    T.column("timestamp").type("datetime")
    T.column("reference_type").type("string").nullable()
    T.column("reference_id").type("int").nullable()
    T.column("price").type("decimal",10,2);
    T.column("total_quantity").type("decimal",10,2);
    T.column("total_value").type("decimal",10,4).generated("IF(total_quantity=0 or total_quantity is null,0,total_quantity*price)");
    T.column("remaining_quantity").type("decimal",10,2);
    T.column("remaining_value").type("decimal",10,4).generated("IF(remaining_quantity=0 or remaining_quantity is null,0,remaining_quantity*price)")

    T.multilinkMany("reference",["putaway_item","requisition_item", "production_order", "production_order_item"])
  })

  $.view("product_station", "SELECT product.*, stock.product_id, stock.station_id, sum(stock.total_quantity) as total_quantity, sum(stock.total_value) as total_value, sum(stock.remaining_quantity) as remaining_quantity, sum(stock.remaining_value) as remaining_value from product inner join stock on stock.product_id = product.id group by product_id, station_id", (T: Table) => {
    product(T);
    T.column("total_quantity").type("decimal",10,2);
    T.column("total_value").type("decimal",10,4)
    T.column("remaining_quantity").type("decimal",10,2);
    T.column("remaining_value").type("decimal",10,4)
    T.column("station_id").type("int").linkTo("station")
    T.column("product_id").type("int").linkTo("product")
    T.autoload.push("station","product")
  })

  $.view("product_project", "SELECT product.*, stock.product_id, stock.project_id, sum(stock.total_quantity) as total_quantity, sum(stock.total_value) as total_value, sum(stock.remaining_quantity) as remaining_quantity, sum(stock.remaining_value) as remaining_value from product inner join stock on stock.product_id = product.id group by product_id, project_id", (T: Table) => {
    product(T);
    T.column("total_quantity").type("decimal",10,2);
    T.column("total_value").type("decimal",10,4)
    T.column("remaining_quantity").type("decimal",10,2);
    T.column("remaining_value").type("decimal",10,4)
    T.column("project_id").type("int").linkTo("project")
    T.column("product_id").type("int").linkTo("product")
    T.autoload.push("project","product")
  })

  $.view("product_station_project", "SELECT product.*, stock.product_id, stock.station_id, stock.project_id, sum(stock.total_quantity) as total_quantity, sum(stock.total_value) as total_value, sum(stock.remaining_quantity) as remaining_quantity, sum(stock.remaining_value) as remaining_value from product inner join stock on stock.product_id = product.id left join project on project.id = stock.project_id group by product_id, station_id, project_id", (T: Table) => {
    product(T);
    T.column("total_quantity").type("decimal",10,2);
    T.column("total_value").type("decimal",10,4)
    T.column("remaining_quantity").type("decimal",10,2);
    T.column("remaining_value").type("decimal",10,4)
    T.column("station_id").type("int").linkTo("station")
    T.column("project_id").type("int").linkTo("project")
    T.column("product_id").type("int").linkTo("product")
    T.autoload.push("station","project","product")
  });

  $.view("product_station_project_raw", "SELECT product.*, stock.product_id, stock.station_id, stock.project_raw_id as project_id, sum(stock.total_quantity) as total_quantity, sum(stock.total_value) as total_value, sum(stock.remaining_quantity) as remaining_quantity, sum(stock.remaining_value) as remaining_value from product inner join stock on stock.product_id = product.id left join project on project.id = stock.project_raw_id group by product_id, station_id, stock.project_raw_id", (T: Table) => {
    product(T);
    T.column("total_quantity").type("decimal",10,2);
    T.column("total_value").type("decimal",10,4)
    T.column("remaining_quantity").type("decimal",10,2);
    T.column("remaining_value").type("decimal",10,4)
    T.column("station_id").type("int").linkTo("station")
    T.column("project_id").type("int").linkTo("project")
    T.column("product_id").type("int").linkTo("product")
    T.autoload.push("station","project","product")
  })

  $.table("project", (T: Table) => {
    T.column("number", "string");
    T.column("status", "string");
    T.column("note", "mediumtext");

    T.column("is_requisition_project", "bool").default(false);

    T.hasMany("project_item")
  })

  $.table("project_item", (T: Table) => {
    T.column("description", "mediumtext");
    T.column("quantity", "decimal", 10, 2);
    T.column("product_id", "int").linkTo("product");
  })

  $.table("station", (T: Table) => {
    T.column("name").type("string");
    T.column("active").type("bool").default(true);    
    
    T.column("is_main_station").type("bool").default(false).notfillable().index();

    T.hasMany("stock")
    //T.hasMany("purchase_order")
    T.hasMany("putaway")
    T.hasMany("production_order")

    T.addExView("station_activeonly")
  })

  $.view("station_project", "SELECT station.*, stock.station_id, stock.project_id, sum(stock.total_quantity) as total_quantity, sum(stock.total_value) as total_value, sum(stock.remaining_quantity) as remaining_quantity, sum(stock.remaining_value) as remaining_value from station inner join stock on stock.station_id = station.id group by station_id, project_id", (T: Table) => {
    T.column("name").type("string");
    T.column("active").type("bool").default(true);  

    T.column("total_quantity").type("decimal",10,2);
    T.column("total_value").type("decimal",10,4)
    T.column("remaining_quantity").type("decimal",10,2);
    T.column("remaining_value").type("decimal",10,4)
    T.column("project_id").type("int").linkTo("project")
    T.column("station_id").type("int").linkTo("station")
    T.autoload.push("project","station")
  })

  function project(T: Table) {
    T.column("number").type("string");
    T.column("status","string").nullable();

    T.hasMany("requisition");
    T.hasMany("production_order");
    T.hasMany("project_item")
  }

  $.table("project", (T: Table) => {
    project(T)
  })

  $.view("project_activeonly",'select * from project where status is null or (status != "ยกเลิกแล้ว" and status != "ปิดงานแล้ว")',(T: Table) => {
    project(T)
  })

  $.table("project_item", (T: Table) => {
    T.column("description","mediumtext").nullable()
    T.column("product_id","int").linkTo("product")
    T.column("quantity","decimal",10,2)

    T.attachView("project_item_view");
  })

  $.view("project_item_view", "SELECT project_item.*,(SELECT COALESCE(SUM(delivery_note_item.quantity), 0) FROM delivery_note_item INNER JOIN delivery_note ON delivery_note.id = delivery_note_item.delivery_note_id WHERE delivery_note.project_id = project.id AND delivery_note_item.product_id = project_item.product_id AND (delivery_note.status IS NULL OR delivery_note.status != 'ยกเลิกแล้ว')) AS quantity_received, (SELECT COALESCE(SUM(delivery_note_item.value), 0) FROM delivery_note_item INNER JOIN delivery_note ON delivery_note.id = delivery_note_item.delivery_note_id WHERE delivery_note.project_id = project.id AND delivery_note_item.product_id = project_item.product_id AND (delivery_note.status IS NULL OR delivery_note.status != 'ยกเลิกแล้ว')) AS value_received FROM project_item INNER JOIN project ON project.id = project_item.project_id", (T: Table) => {
    T.column("description","mediumtext").nullable()
    T.column("product_id","int").linkTo("product")
    T.column("quantity","decimal",10,2)
    T.column("quantity_received","decimal",10,2)
  })

  $.view("delivery_note_item_autofill", "SELECT *, quantity - quantity_received as quantity_remaining FROM project_item_view;", (T: Table) => {
    T.column("description","mediumtext").nullable()
    T.column("product_id","int").linkTo("product")
    T.column("quantity","decimal",10,2)
    T.column("quantity_received","decimal",10,2)
    T.column("quantity_remaining","decimal",10,2)
  })

  $.table("production_order", (T: Table) => {
    T.column("description").type("mediumtext").nullable();
    T.column("quantity").type("decimal",10,2);
    T.column("note","string").nullable();
    T.column("status","string").nullable().default("รอเบิกของ");
    T.column("cost","decimal",10,4).default(0);
    T.column("project_id","int").nullable();

    T.hasMany("production_order_item")
    T.hasMany("production_order_expense")

    T.attachView("production_order_view")

    T.autoload.push("project","station","product")
  })

  $.view("production_order_view", "select * from production_order", (T: Table) => {
  //$.view("production_order_view", "select production_order.*, coalesce(sum(production_order_item.value),0) + coalesce(sum(production_order_expense.value),0) as cost from production_order left join production_order_item on production_order.id = production_order_item.production_order_id left join production_order_expense on production_order.id = production_order_expense.production_order_id group by production_order.id", (T: Table) => {
    T.column("description").type("mediumtext").nullable();
    T.column("quantity").type("decimal",10,2);
    T.column("note","string").nullable();
    T.column("status","string").nullable().default("เรียบร้อยแล้ว");
    T.column("cost","decimal",10,4).default(0);
  })

  $.table("production_order_item", (T: Table) => {
    T.column("description","mediumtext").nullable()
    T.column("quantity","decimal",10,2);
    T.column("value","decimal",10,4).default(0);
    T.column("is_remaining","boolean").default(false)

    T.attachView("production_order_item_view")

    T.autoload.push("production_order","product")
  })

  $.view("production_order_item_view", "select * from production_order_item", (T: Table) => {
    T.column("description","mediumtext").nullable()
    T.column("quantity","decimal",10,2);
    T.column("value","decimal",10,4).default(0).notfillable();
  })

  $.table("production_order_expense", (T: Table) => {
    T.column("name","string");
    T.column("description","mediumtext").nullable()
    T.column("price","decimal",10,2);
    T.column("quantity","decimal",10,2);
    T.column("value","decimal",10,4).generated("price*quantity");

    T.autoload.push("production_order")
  });

  $.table("requisition", (T : Table) => {
    T.column("note").type("string").nullable();
    T.column("from_station_id").linkTo("station")
    T.column("to_station_id").linkTo("station");
    T.column("status").type("string").nullable().default("เรียบร้อยแล้ว");
    T.column("project_id","int").nullable();

    T.column("reference_type").type("string").nullable()
    T.column("reference_id").type("int").nullable()

    T.column("is_cancel_reserve","boolean").default(false);

    T.autoload.push("project","from_station","to_station");

    T.hasMany("requisition_item");
    T.multilinkMany("reference",['production_order'])
  })

  $.table("requisition_item",(T: Table) => {
    T.column("description").type("mediumtext").nullable();
    T.column("quantity").type("decimal",10,2);

    T.autoload.push("product","requisition");

    T.attachView("requisition_item_view");
  });

  $.view("requisition_item_view","select * from requisition_item",(T: Table) => {
    T.column("description").type("mediumtext").nullable();
    T.column("quantity").type("decimal",10,2);
  })

  $.view("station_activeonly","select * from station where active = true;", (T: Table) => {
    T.column("name").type("string");
    T.column("active").type("bool").default(true);    
  })

  function uom(T: Table) {
    T.column("name").type("string")
    //T.column("rates").type("array")
    T.column("active").type("boolean").default(true)
    
    T.hasMany("uom_item")
  
    T.middleware('inventory_active');

    if (T.name_raw.indexOf("activeonly") == -1) {
      T.addExView(T.name_raw+"_activeonly");
    }
  }
  
  $.table("uom", uom);
  $.view("uom_activeonly","select * from uom where active = true", uom)

  function uom_item(T: Table) {
    T.column("name").type("string")
    T.column("rate").type("decimal",14,7)

    T.hasMany("product_group")

    T.autoload.push("uom");

    T.middleware('inventory_active');

    if (T.name_raw.indexOf("activeonly") == -1) {
      T.addExView(T.name_raw+"_activeonly");
    }
  }

  $.table("uom_item",uom_item);
  $.view("uom_item_activeonly","SELECT uom_item.*, uom.active as active FROM uom_item inner join uom on uom.id = uom_item.uom_id where active = true;",uom_item);

  function product_group(T: Table) {
    T.column("name").type("string")
    //uom_id auto gen
    T.column("attribute").type("array")
    T.column("lot_tracking").type("boolean").default(true)
    T.column("active").type("boolean").default(true)
  
    T.hasMany("product")

    T.autoload.push("uom_item");
  
    T.middleware('inventory_active');

    if (T.name_raw.indexOf("activeonly") == -1) {
      T.addExView(T.name_raw+"_activeonly");
    }
  }
  
  $.table("product_group", product_group)
  $.view("product_group_activeonly","select * from product_group where active = true", product_group)


  function product(T: Table) {
    T.column("name").type("string")
    //product_group_id auto gen
    T.column("sku").type("string").unique()
    T.column("barcode").type("string").nullable()
    T.column("attribute").type("dict")
    T.column("active").type("boolean").default(true)
    T.column("product_group_id","int").linkTo("product_group");
  
    T.autoload.push("product_group");

    T.hasMany("purchase_order_item");
    T.hasMany("putaway_item");
    T.hasMany("requisition_item");
    T.hasMany("production_order")
    T.hasMany("production_order_item")
  
    T.middleware('inventory_active');

    //if (T.name_raw.indexOf("activeonly") == -1 && T.name_raw.indexOf("view") == -1 && T.name_raw != "product_station" && T.name_raw != "product_project" && T.name_raw != "product_station_project") {
    if (T.name_raw=="product") {
      T.addExView(T.name_raw+"_activeonly");
    }
  }
  
  
  
  $.view("product_view","SELECT product.*, COALESCE(SUM(remaining_quantity), 0) AS stock_quantity, COALESCE(SUM(case when stock.project_id is null then stock.remaining_quantity else 0 end), 0) AS stock_notreserved FROM product LEFT JOIN stock ON product.id = stock.product_id GROUP BY product.id , product.product_group_id , product.name , product.sku , product.barcode , product.attribute , product.active , product.created_at , product.updated_at",(T: Table) => {
    product(T);

    T.column("stock_quantity").type("decimal",10,2);
  });
  $.view("product_activeonly","select * from product_view where active = true", product)
  $.table("product", (T: Table)=>{
    product(T); 
    T.attachView("product_view")
    T.hasMany("product_station")
    T.hasMany("product_project")
    T.hasMany("product_project_station");
  })

  $.table("purchase_order_item",(T: Table) => {
    //T.column("product_id").type("int").linkTo("product");
    T.column("description").type("mediumtext").nullable();
    T.column("price").type("decimal",10,2);
    T.column("quantity").type("decimal",10,2);
    T.column("value").type("decimal",10,4).generated("price*quantity");

    T.attachView("purchase_order_item_view");

    T.autoload.push("product");

    T.middleware('inventory_active');
  });

  $.view("purchase_order_item_view","select *, (select COALESCE(sum(quantity),0) from putaway_item where purchase_order_item.product_id=putaway_item.product_id and (select purchase_order.id from purchase_order where purchase_order_item.purchase_order_id = id)=(select putaway.purchase_order_id from putaway where putaway_item.putaway_id = id and (putaway.status != \"ยกเลิกแล้ว\" || putaway.status is null) ) ) as quantity_received from purchase_order_item;",(T: Table) => {
    T.column("description").type("mediumtext").nullable();
    T.column("price").type("decimal",10,2);
    T.column("quantity").type("decimal",10,2);
    T.column("quantity_received").type("decimal",10,2);
    T.column("value").type("decimal",10,4).generated("price*quantity");

    
  });

  $.table("purchase_order",(T: Table) => {
    T.column("number").type("string");
    T.column("note").type("mediumtext").nullable();
    T.column("status").type("string").nullable();

    T.column("project_id","int").nullable().linkTo("project");

    T.hasMany("putaway");
    T.hasMany("purchase_order_item");

    T.attachView("purchase_order_view");

    T.autoload.push("purchase_order_item");

    T.middleware('inventory_active');
  });

  $.view("purchase_order_view",'SELECT *, IF(`status` IS NOT NULL,`status`, IF( (SELECT count(id) FROM putaway WHERE putaway.purchase_order_id=purchase_order.id)>0 , "รับแล้ว", "รอรับ") ) AS status_view FROM purchase_order',(T: Table) => {
    T.column("number").type("string");
    T.column("note").type("mediumtext").nullable();
    T.column("status").type("string").nullable();
    T.column("status_view").type("string");

    T.column("project_id","int").nullable().linkTo("project");
  });

  $.table("putaway",(T: Table) => {
    T.column("note").type("mediumtext").nullable();
    T.column("status").type("string").nullable()

    T.hasMany("putaway_item");

    T.autoload.push("putaway_item");
    T.autoload.push("purchase_order");

    T.middleware('inventory_active');
  });

  $.table("putaway_item",(T: Table) => {
    T.column("description").type("mediumtext").nullable();
    T.column("price").type("decimal",10,2);
    T.column("quantity").type("decimal",10,2);
    T.column("value").type("decimal",10,4).generated("price*quantity");

    T.attachView("putaway_item_view");

    T.autoload.push("product");
    
    T.middleware('inventory_active');
  });

  $.view("putaway_item_view",'select *, (select sum(quantity) from purchase_order_item where purchase_order_item.product_id=putaway_item.product_id and (select purchase_order.id from purchase_order where purchase_order_item.purchase_order_id = id)=(select putaway.purchase_order_id from putaway where putaway_item.putaway_id = id)) as quantity_order from putaway_item;',(T: Table) => {
    T.column("description").type("mediumtext").nullable();
    T.column("price").type("decimal",10,2);
    T.column("quantity").type("decimal",10,2);
    T.column("value").type("decimal",10,4).generated("price*quantity");
    T.column("quantity_order").type("decimal",10,2);
  });

  $.view("putaway_item_autofill","SELECT *, quantity - quantity_received as quantity_remaining FROM purchase_order_item_view;",(T: Table) => {
    T.column("description").type("mediumtext").nullable();
    T.column("price").type("decimal",10,2);
    T.column("quantity").type("decimal",10,2);
    T.column("value").type("decimal",10,4).generated("price*quantity");
    T.column("quantity_remaining").type("decimal",10,2);
    T.column("quantity_received").type("decimal",10,2);
  })

  $.table("delivery_note",(T: Table) => {
    T.column("project_id","int").nullable().linkTo("project")
    T.column("note","string").nullable()
    T.column("station_id","int").linkTo("station")
    T.column("status","string").default("เรียบร้อยแล้ว")

    T.hasMany("delivery_note_item")
    T.autoload.push("project","station")
  })

  $.table("delivery_note_item",(T: Table) => {
    T.column("description","mediumtext").nullable()
    T.column("product_id","int").linkTo("product")
    T.column("quantity","decimal",10,2)
    T.column("value","decimal",10,4)

    T.autoload.push("delivery_note","product")

    T.attachView("delivery_note_item_view")
  })
  
  $.view("delivery_note_item_view", "select delivery_note_item.*, (select COALESCE(sum(project_item.quantity), 0) from project_item inner join project on project.id = project_item.project_id where delivery_note.project_id = project.id and delivery_note_item.product_id = project_item.product_id and (project.status is null or project.status != 'ยกเลิกแล้ว')) as quantity_ordered from delivery_note_item inner join delivery_note on delivery_note.id = delivery_note_item.delivery_note_id", (T: Table) => {
    T.column("description","mediumtext").nullable()
    T.column("product_id","int").linkTo("product")
    T.column("quantity","decimal",10,2)
    T.column("quantity_ordered","decimal",10,2);
  })
}