import Column from "./column";
import Migration from "./migration";
import * as _ from 'lodash'
import Relation from "./relation";
import ManyToMany from "./manytomany";
import View from "./view";
import { isArray } from "util";
import OneToMany from './onetomany';

class Table {
  public name_raw: string;
  public view_name_raw: string;
  public view_table: Table = this;
  public nonview_table: Table = this;
  public create_new: boolean = true;
  public crud_only: boolean = false;
  public columns: Column[] = [];
  public migration: Migration;
  public pivot_data: [Table,Table];

  public ex_views: View[] = [];

  //Autoload
  public autoload: string[] = [];
  public autocount: string[] = [];

  /**
   * Relation that this table is parent
   */
  public parentRelations: Relation[] = [];

  /**
   * Relation that this table is child
   */
  public childRelations: Relation[] = [];

  public middleware_api: string[] = ['auth:api'];
  public middleware_view: string[] = ['auth'];

  public extra_index: any = [];

  //specialized field
  public use_legacy_view: boolean = false;

  constructor(table_name: string, migration: Migration) {
    this.name_raw = table_name;
    this.view_name_raw = this.name_raw;
    this.migration = migration

    this.column("id").type("int").unique().notfillable().create_new = false;
  }

  public column(col_name: string, type_name: string = "", ...type_args: any[]): Column {
    let col = this.findColumn(col_name);
    //this.columns.push(col);
    if (type_name) {
      col.type(type_name,...type_args);
    }
    return col;
  }

  get name(): string {
    function capitalizeFirstLetter(str: string) {
      return str[0].toUpperCase() + str.slice(1);
    }
    return capitalizeFirstLetter(this.name_raw.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); }));
  } 

  get view_name(): string {
    function capitalizeFirstLetter(str: string) {
      return str[0].toUpperCase() + str.slice(1);
    }
    return capitalizeFirstLetter(this.view_name_raw.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); }));
  } 

  get is_view(): boolean {
    return (this.name != this.nonview_table.name || this.crud_only);
  }

  get is_extender_view(): boolean {
    return this.name != this.nonview_table.name;
  }

  public noAuth(forapi = true,forview = true) {
    if (forapi && this.middleware_api.indexOf("auth:api") != -1) this.middleware_api.splice(this.middleware_api.indexOf("auth:api"), 1)
    if (forview && this.middleware_view.indexOf("auth") != -1) this.middleware_view.splice(this.middleware_view.indexOf("auth"), 1)
  }


  public middleware(...args) {
    this.middleware_api = this.middleware_api.concat(args);
    this.middleware_view = this.middleware_view.concat(args);
  }

  /**
   * Attach view to this table
   * Make get operation get from view instead
   * 
   * Note: you can use normal table as view
   * @param name View or Table name
   */
  public attachView(name: string) {
    this.view_name_raw = name;
    var view_view = this.migration.findView(this.view_name_raw);
    this.view_table = this.migration.findTable(this.view_name_raw);
    this.view_table.nonview_table = this;
  }

  public addExView(name: string) {
    var view_view = this.migration.findView(name);
    this.ex_views.push(view_view);
    view_view.nonview_table = this;
  }

  public index(name: string | string[]) {
    this.extra_index.push(name);
  }

  public findColumn(name: string): Column {
    let res = _.find(this.columns,{name: name});
    if (res) {
      return res;
    }
    let t = new Column(name, this, this.migration)
    this.columns.push(t)
    return t
  }

  get cols(): Column[] {
    return _.filter(this.columns,"create_new");
  }

  get cols_visible(): Column[] {
    return _.filter(this.columns,col=>!col._hidden);
  }

  public multilinkMany(col_name: string, targets: string[]) {
    var col_type = col_name + "_type";
    var col_id = col_name + "_id";

    this.findColumn(col_type).index();
    this.findColumn(col_id).index();

    for(var target of targets) {
      let r: Relation = new OneToMany();

      r.parentTable = this.migration.findTable(target);
      r.parentColumn = r.parentTable.findColumn("id");
      r.parentName = r.parentTable.name_raw;

      r.childTable = this;
      r.childColumn = this.findColumn(col_id);
      r.childName = this.name_raw;

      r.isMorph = true;
      r.morphTypeColumn = this.findColumn(col_type);
      r.morphName = col_name;

      this.migration.relations.push(
        r
      );
    }
  }

  public alreadyLinkTo(table: Table): Column {
    for(let col of this.cols) {
      if (col.getLinkTo()[0] == table) return col;
    }
    return null;
  }

  public hasOne(table_name: string) {
    if (this.crud_only) return;
    let linkToTable: Table = this.migration.findTable(table_name);
    let linkToCol: Column = linkToTable.alreadyLinkTo(this);
    if (linkToCol) {
      linkToCol.oneToOne();
    } else {
      let currLinkTo = this.findColumn(table_name+"_id").getLinkTo();
      if (currLinkTo && currLinkTo[0] == linkToTable) return;
      this.column(table_name+"_id").linkTo(table_name).insist_create_new = false;
    }
  }

  public hasMany(table_name: string) {
    if (this.crud_only) return;
    let linkToTable: Table = this.migration.findTable(table_name);
    let linkToCol: Column = linkToTable.alreadyLinkTo(this);
    if (linkToCol) {
      return;
    }
    let linkFromThis: Column = this.alreadyLinkTo(linkToTable);
    if (linkFromThis) {
      //Build ManyToMany relationship
      linkFromThis.linkTo(null); //Remove link

      let relation: Relation = new ManyToMany()
      let pivot_table_name = (table_name<this.name_raw ? table_name+"__"+this.name_raw : this.name_raw+"__"+table_name)
      let pivot_table = this.migration.findTable(pivot_table_name);
      pivot_table.pivot_data = [this,linkToTable]

      //console.log(pivot_table)

      relation.parentTable = this;
      relation.parentColumn = pivot_table.column(this.name_raw+"_id").linkTo(this.name_raw);
      relation.parentName = this.name_raw;

      relation.childTable = linkToTable;
      relation.childColumn = pivot_table.column(linkToTable.name_raw+"_id").linkTo(linkToTable.name_raw);
      relation.childName = linkToTable.name_raw;

      relation.pivotTable = pivot_table;

      this.migration.relations.push(relation);

      return;
    }
    linkToTable.column(this.name_raw+"_id").linkTo(this.name_raw).insist_create_new = false;
  }

  
}

export default Table;