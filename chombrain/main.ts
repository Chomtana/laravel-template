import Table from './lib/table';
import Migration from './lib/migration';

let $ = new Migration()

import inventory from './inventory';
inventory($);

$.table("users",(T: Table) => {
  T.column("deposit_active").type("boolean").default(false);
  T.column("inventory_active").type("boolean").default(false);
  T.column("quotation_active").type("boolean").default(false);
  T.column("quotation_admin").type("boolean").default(false);

  T.column("quotation_noti_lastread").type("timestamp").nullable();

  T.middleware('admin');
  T.use_legacy_view = true;
});

$.table("portfolio", (T: Table) => {
  T.column("label", "string").default("");
  T.column("large_list", "array");
  T.column("large_final", "int");
  T.column("order", "int");
});

//quotation
$.table("quotation",(T: Table) => {
  T.column("created_by").type("string").default("").nullable();
  T.column("updated_by").type("string").default("").nullable();
  T.column("data").type("array");

  function columnWithEdited(name,type) {
    T.column(name+"__edited").type("boolean").default(false);
    return T.column(name).type(type);
  }

  columnWithEdited("due","date").nullable();
  columnWithEdited("due_bycustomer","boolean").default(false);
  columnWithEdited("finish","date").nullable();
  columnWithEdited("due_sample","date").nullable();
  T.column("topic__edited").type("boolean").default(false)
  columnWithEdited("type","string").default("")
  T.column("due_old", "date").nullable();

  T.column("i").type("int").nullable();
  T.column("id").type("string").default("").fillable().create_new = true;
  T.column("img").type("array").nullable();
  T.column("imgsize").type("int").default(50);
  T.column("name").type("string").default("").nullable();
  T.column("owner").type("string").default("").nullable();

  columnWithEdited("sale_name","string").default("").nullable();
  columnWithEdited("person_name","string").default("").nullable();
  columnWithEdited("address","mediumtext").type("mediumtext").nullable()
  columnWithEdited("tel","string").default("").nullable();;

  T.column("step_list").type("array")
  T.column("step_data").type("dict")

  T.column("amountlist").type("dict").nullable();
  T.column("amountlistdeep").type("dict").nullable();
  T.column("amountlistmetadata").type("dict").nullable();
  T.column("sizeinfo").type("dict").nullable();

  T.column("sizenote").type("dict").nullable();
  T.column("amountlistnote").type("dict").nullable();

  T.column("deposit_value","decimal",10,2).default(0.00);
  T.column("total_value","decimal",10,2).default(0.00);
  T.column("paid_type","string").default("ยังไม่ได้กำหนด");

  T.column("deposit_step_list").type("array")
  T.column("deposit_step_data").type("dict")

  T.column("is_sample").type("boolean").default(false)
  T.column("use_perfect_countamount").type("boolean").default(true);

  T.column("pic_comment", "json");

  T.column("fabric_order_date", "date");

  T.column("export_xlsx_img", "json");

  T.column("paid_type_internal", "string");

  T.noAuth(true,false);
  T.use_legacy_view = true;
});

$.table("quotation_sample",(T: Table) => {
  function columnWithEdited(name,type) {
    T.column(name+"__edited").type("boolean").default(false);
    return T.column(name).type(type);
  }

  T.column("quotation_id","string");
  T.column("name","string").nullable()
  T.column("type","string")
  T.column("due_sample","date");

  T.column("sample_type","string").nullable();
  T.column("sample_type_list","json").nullable();
  T.column("sample_note", "mediumtext").nullable();

  T.column("step_list").type("array")
  T.column("step_data").type("dict")

  columnWithEdited("person_name","string").default("").nullable();
  columnWithEdited("address","mediumtext").type("mediumtext").nullable()
  columnWithEdited("tel","string").default("").nullable();
  columnWithEdited("commuchannel","string").default("").nullable();

  columnWithEdited("value","float").default(0).nullable();
  columnWithEdited("sentfee","float").default(0).nullable();

  T.column("must_deliver").type("boolean").default(false);
  T.column("fabric_sample_mode").type("boolean").default(false);
  T.column("is_quotation_created").type("boolean").default(false);
  T.column("is_linkto_quotation").type("boolean").default(false)
});

$.table("quotation_repair",(T: Table) => {
  T.column("quotation_id","string");
  T.column("name","string").nullable()
  T.column("type","string")
  T.column("due_repair","date");

  T.column("amountlist").type("dict").nullable();
  T.column("amountlistdeep").type("dict").nullable();
  T.column("sizeinfo").type("dict").nullable();

  T.column("step_list").type("array")
  T.column("step_data").type("dict")
});

$.table("quotation_deposit",(T: Table) => {
  T.column("quotation_id","string");
  T.column("name","string").nullable()
  T.column("type","string")
  T.column("deposit_value","decimal",10,2).default(0.00);
  T.column("total_value","decimal",10,2).default(0.00);
  T.column("paid_type","string").default("ยังไม่ได้กำหนด");

  T.column("step_list").type("array")
  T.column("step_data").type("dict")
});

//deposit
$.table("deposit",(T: Table) => {
  T.column("no").type("string")

  T.column("contact_name").type("string").nullable()
  T.column("company_name").type("string").nullable()
  T.column("company_branch").type("string").nullable()
  T.column("company_tax_id").type("string").nullable()
  T.column("company_tel").type("string").nullable()
  T.column("company_fax").type("string").nullable()
  T.column("company_address").type("text").nullable()

  T.column("note").type("text").nullable()
  T.column("pay_date").type("date").nullable();

  T.column("pay_cash").type("boolean").default(false)
  T.column("pay_transaction").type("boolean").default(false)
  T.column("pay_check").type("boolean").default(false)

  T.column("items").type("array")
  T.column("pay_infos").type("array")

  T.column("active").type("boolean").default(true)

  T.middleware('deposit_active');

  T.use_legacy_view = true;
})

//selectdata
$.table("selectdata",(T: Table) => {
  T.column("data").type("dict")
  T.column("id").type("string").fillable().create_new = true;
  T.column("url").type("string").nullable();
});

$.table("blog", (T: Table) => {
  T.column("body","json")
  T.column("created_by","string").nullable()
  T.column("description","mediumtext").nullable();
  T.column("id").type("string").fillable().create_new = true;
  T.column("ogimg","string").nullable();
  T.column("order","int");
  T.column("private","boolean").default(false);
  T.column("topic","string").nullable();
})

$.table("approving_noti", (T: Table) => {
  T.column("quotation_id", "string").linkTo("quotation");
  T.column("message", "string");
})


$.render()
