import Table from "./table";
import Migration from "./migration";

class View extends Table {
  public sql:string = "";

  constructor(table_name: string, migration: Migration, sql: string = "") {
    super(table_name,migration);
    this.crud_only = true;
    this.sql = sql;
  }

}

export default View;