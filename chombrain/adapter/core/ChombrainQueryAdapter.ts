import axios from 'axios';
import { api } from './../config/ChombrainAdapterConfig';
import { handleError } from '../errorhandler/ChombrainAdapterErrorHandler';
import { isArray, isObject } from 'util';

export default class ChombrainQueryAdapter {
  public table_name: string = null;
  public column_name: string = null;
  public Sort_by: Array<any> = [];
  public Paginate: boolean = false;
  public Page: Number;
  public Where: Array<any> = [];

  public err: any;


  constructor() {
    
  }

  public table(table_name: string): ChombrainQueryAdapter {
    this.table_name = table_name;
    return this;
  }

  public where(expr: any,op?: any,val?: any) {
    let convertOp = () => {
      if (op == "=") return "=";
      if (op == "==") return "=";
      this.handleError("Unknown where operator: "+op);
    }

    if (Array.isArray(expr)) {
      if (expr.length>0) {
        if (Array.isArray(expr[0])) {
          for(var x of expr) {
            this.where(x[0],x[1],x[2])
          }
        } else {
          this.where(expr[0],expr[1],expr[2])
        }
      }
      
    } else if (expr !== null && typeof expr == "object") {
      for(var key in expr) {
        this.where([key,"=",expr[key]]);
      }
    } else {
      if (!val) {
        this.where([expr,"=",op]);
      } else {
        this.Where.push([expr,convertOp(),val]);
      }
    }
  }

  public paginate(is: boolean = true) {
    this.Paginate = is;
  }

  public page(Page: Number) {
    this.Page = Page;
    this.paginate(true);
  }

  public sort(expr: any,order: string = "ASC") {
    if (typeof expr == "string") {
      this.Sort_by.push([expr,order])
    } else {
      if (Array.isArray(expr)) {
        if (expr.length > 0) {
          if (Array.isArray(expr)) {
            this.Sort_by.push(...expr);
          } else {
            this.Sort_by.push(expr);
          }
        }
      } else if (expr !== null && typeof expr == "object") {
        for(var key in expr) {
          this.Sort_by.push([key,expr[key]]);
        }
      }
    }
  }

  public async all() {
    if (this.table_name) {
      if (!this.column_name) {
        let params = {
          sort_by: this.Sort_by.map(x=>x[0]+" "+x[1]),
          paginate: this.Paginate,
          ...(this.Paginate && this.Page ? {page: this.Page} : {})
        };

        try {
          let response = await api.get("/"+this.table_name,{params});
          if (response && response.data) {
            return response.data;
          }
        } catch (err) {
          this.handleError(err);
        }
      }
    }

    this.handleError()
  }

  private handleError(err?: any) {
    this.err = err;
    handleError(err,this);
    throw this;
  }

  
}