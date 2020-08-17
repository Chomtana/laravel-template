import Table from "./table";
import Migration from "./migration";
import Relation from "./relation";
import OneToMany from "./onetomany";
import OneToOne from "./onetoone";
import Type from "../types/Type";
import NativeType from './../types/NativeType';
import ArrayType from './../types/ArrayType';
import DictType from './../types/DictType';

class Column {
  public name: string;
  public migration: Migration;
  public table: Table;
  public create_new: boolean = true;
  public insist_create_new: boolean = false;
  public type_raw: string = "string";
  public _type: Type;

  //basic column modifiers
  public _after: string;
  public _charset: string;
  public _collation: string;
  public _comment: string;
  public _first: boolean;
  public _nullable: boolean;
  public _unsigned: boolean;
  public _useCurrent: boolean;

  //extended modifier
  public _fillable: boolean = true;
  public _hidden: boolean = false;

  //generated column system
  public _generated: string;
  public _generated_stored: boolean;

  //default value system
  public _default: string;

  //index system
  public _unique: boolean;
  public _index: boolean;

  //link to ...
  public _linkTo: Table;
  public _oneToOne: boolean = false;
  public _autolink: boolean = false;
  public _autolink_count: boolean = false;

  public _morphToRendered: boolean = false;

  /**
   *
   * @param name Name of column
   */
  constructor(name: string, table: Table, migration: Migration) {
    this.name = name
    this.migration = migration
    this.table = table;
  }

  /**
   * Laravel: $table->float('amount', 8, 2);
   * ChomBrain: T.column('amount').type('float',8,2)
   * @param name See https://laravel.com/docs/5.7/migrations#columns
   * @param args $table->float('amount', 8, 2); -> args is 8,2
   */
  public type(name: string, ...args: any): Column {
    this.type_raw = name;
    if      (name=="int")   this._type = new NativeType("integer",...args);
    else if (name=="bool") this._type = new NativeType("boolean",...args);
    else if (name=="image") this._type = new NativeType("string",...args);
    else if (name=="file")  this._type = new NativeType("string",...args);
    else if (name=="array") this._type = new ArrayType(...args);
    else if (name=="dict")  this._type = new DictType(...args);
    else                    this._type = new NativeType(name,...args);
    this._type.col = this;
    this._type.table = this.table;
    return this
  }

  /**
   * See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   * @param name See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   */
  public after(name: string): Column {
    this._after = name
    return this
  }

  /**
   * See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   * @param name See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   */
  public charset(name: string): Column {
    this._charset = name
    return this
  }

  /**
   * See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   * @param name See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   */
  public collation(name: string): Column {
    this._collation = name
    return this
  }

  /**
   * See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   * @param name See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   */
  public comment(name: string): Column {
    this._comment = name
    return this
  }

  /**
   * See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   * @param val See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   */
  public first(val: boolean = true): Column {
    this._first = val
    return this
  }

  /**
   * See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   * @param val See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   */
  public nullable(val: boolean = true): Column {
    this._nullable = val
    return this
  }

  /**
   * See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   * @param val See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   */
  public unsigned(val: boolean = true): Column {
    this._unsigned = val
    return this
  }

  /**
   * See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   * @param val See https://laravel.com/docs/5.7/migrations#columns in column modifier section
   */
  public useCurrent(val: boolean = true): Column {
    this._useCurrent = val
    return this
  }

  /**
   * This column will show in list or get or not?
   * @param val hidden?
   */
  public hidden(val: boolean = true): Column {
    this._hidden = val
    return this
  }

  /**
   * Set this column to virtual generated column
   * * Not stored in DB
   * * Cannot index efficiently
   * * For low read, high write table
   * * Doesn't take disk space
   * @param exp SQL command for this generated column
   */
  public virtualAs(exp: string): Column {
    this._generated = exp
    this._generated_stored = false;
    return this
  }

  /**
   * Set this column to stored generated column
   * * Stored in DB
   * * Can index efficiently
   * * For high read, low write table
   * * Take disk space
   * @param exp SQL command for this generated column
   */
  public storedAs(exp: string): Column {
    this._generated = exp
    this._generated_stored = true;
    return this
  }

  /**
   * Set this column to generated column (default is stored)
   *
   * Virtual:
   * * Not stored in DB
   * * Cannot index efficiently
   * * For low read, high write table
   * * Doesn't take disk space
   *
   * Stored:
   * * Stored in DB
   * * Can index efficiently
   * * For high read, low write table
   * * Take disk space
   *
   * @param exp SQL command for this generated column
   * @param stored If true -> stored, false -> virtual, default is true (stored)
   */
  public generated(exp: string,stored: boolean = true): Column {
    this._generated = exp
    this._generated_stored = stored;
    return this
  }

  /**
   * Set default value of this column
   * JSON column default is currently supported in ChomMind
   * @param val default value of this column
   */
  public default(val: any): Column {
    this._default = val;
    return this;
  }

  /**
   * Make this column fillable (without val or val = true)
   * Can be modified at runtime by editing appendFillable.php file
   * If there are some case that this field must be unfillable, you should call this.
   * @param val fillable or not (default is fillable, val = true)
   */
  public fillable(val: boolean = true): Column {
    this._fillable = val;
    return this;
  }

  /**
   * Make this column not fillable by default
   * Can be modified at runtime by editing appendFillable.php file
   * If there are some case that this field must be unfillable, you should call this.
   */
  public notfillable(): Column {
    this._fillable = false;
    return this;
  }

  public linkTo(table: string): Column {
    if (table==null) {
      this._linkTo = null;
      this._oneToOne = false;
      return this;
    }
    this._linkTo = this.migration.findTable(table);
    this.type("bigInteger").unsigned().index();
    //if (this.name==table+"_id") {
      this.create_new = true;
      this.insist_create_new = true;
    //} else {
      //let _id = this.table.findColumn(table+"_id");
      //if (!_id.insist_create_new) _id.create_new = false;
    //}
    return this;
  }

  public oneToOne(val: boolean = true): Column {
    this._oneToOne = val;
    return this;
  }

  /**
   * This column will autolink in list or get or not?
   * @param val autolink?
   */
  public autolink(val: boolean = true): Column {
    this._autolink = val
    return this
  }

  /**
   * This column will autolink count of child in list or get or not?
   * @param val autolink?
   */
  public autolinkCount(val: boolean = true): Column {
    this._autolink_count = val
    return this
  }

  public unique(val: boolean = true): Column {
    this._unique = val;
    return this;
  }

  public index(val: boolean = true): Column {
    this._index = val;
    return this;
  }

  private toRelation_resolveParentName() {
    var id_pos = this.name.indexOf("_id", this.name.length - "_id".length);
    if(id_pos !== -1) {
      return this.name.substr(0,id_pos);
    };
    return this.name;
  }

  public toRelation(): Relation {


    if (this._linkTo) {
      if (this._oneToOne) {
        let res = new OneToOne();
        res.childTable = this.table;
        res.childColumn = this;
        res.childName = this.table.name_raw;

        res.parentTable = this._linkTo;
        res.parentColumn = this._linkTo.findColumn("id");
        res.parentName = this.toRelation_resolveParentName();
        return res;
      } else {
        let res = new OneToMany();
        res.childTable = this.table;
        res.childColumn = this;
        res.childName = this.table.name_raw;

        res.parentTable = this._linkTo;
        res.parentColumn = this._linkTo.findColumn("id");
        res.parentName = this.toRelation_resolveParentName();
        return res;
      }
    }
    return null;
  }

  public getLinkTo(): [Table,boolean] {
    return [this._linkTo,this._oneToOne];
  }

  public getDefaultValue() {
    return this._default;
  }

  public render(mode: string = "Migration"): string {
    if (mode=="Migration") {
      if (this.table.crud_only) return "";
      var res = "$table->"+this._type.native_type+"('"+this.name+"'";
      if (this._type.native_args && this._type.native_args.length > 0) {
        res += ',';
        var typeargsstr = JSON.stringify(this._type.native_args);
        typeargsstr = typeargsstr.substr(1,typeargsstr.length-2);
        res += typeargsstr;
      }
      res += ')'

      if (this._after)      res += "->after('"+this._after+"')";
      if (this._charset)    res += "->charset('"+this._charset+"')";
      if (this._collation)  res += "->collation('"+this._collation+"')";
      if (this._comment)    res += "->comment('"+this._comment.replace(/\'/g,"\\'")+"')";
      if (this._first)      res += "->first()";
      if (this._nullable)   res += "->nullable()";
      if (this._unsigned)   res += "->unsigned()";
      if (this._useCurrent) res += "->useCurrent()";

      if (typeof this._type.native_default != "undefined")    res += "->default("+JSON.stringify(this._type.native_default)+")";

      if (this._unique) res += "->unique()";
      if (this._index) res += "->index()";

      if (this._generated) {
        if (this._generated_stored) res += "->storedAs('"+this._generated.replace("'","\\'")+"')";
        else                        res += "->virtualAs('"+this._generated.replace("'","\\'")+"')";
      }

      res += ";"

      res += this._type.renderMigration();
    } else if (mode=="SimpleSearchEXP") {
      var res = `->orWhere('${this.name}','LIKE','%'.escapeLike($simpleSearch).'%')`;
      if (this._hidden || this._type.native_type == "boolean") res = "";
    } else if (mode=="ControllerFunc") {
      var res = this._type.renderController();
    } else if (mode=="Route") {
      var res = this._type.renderRouteAPI();
    } else if (mode=="RouteView") {
      var res = this._type.renderRouteView();
    }
    return res;
  }

  public isNullable() {
    return this._nullable;
  }
}

export default Column
