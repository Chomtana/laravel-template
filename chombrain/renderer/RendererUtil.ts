import Table from "../lib/table";
import * as _ from 'lodash'
import Column from "../lib/column";

class RendererUtil {
  public table: Table;

  constructor(table: Table) {
    this.table = table
  }

  public cols_fillables(): string[] {
    return _.map(_.filter(this.table.cols,'_fillable'), 'name')
  }

  public cols_hidden(): string[] {
    return _.map(_.filter(this.table.cols,'_hidden'), 'name')
  }

  public cols_name(): string[] {
    return _.map(this.table.cols,"name")
  }

  public jsoncols(): string[] {
    return _.map(_.filter(this.table.cols,(x: Column)=>x._type.native_type=="json"),"name")
  }

  public datetimecols(): string[] {
    return _.map(_.filter(this.table.cols,(x: Column)=>x._type.native_type=="timestamp" || x._type.native_type=="date" || x._type.native_type=="datetime" || x._type.native_type=="time"),"name")
  }

  public jsoncasts(): string[] {
    return _.map(this.jsoncols(),(name)=>`'${name}' => 'object'`)
  }

  public datetimecasts(): string[] {
    return _.map(this.datetimecols(),(name)=>`'${name}' => 'datetime'`)
  }

  public jsonattributes(): string[] {
    return _.map(_.filter(this.table.cols,(x: Column)=>x._type.native_type=="json"), (x: Column) => {
      if (x.type_raw == "array") return `'${x.name}' => '[]'`;
      return `'${x.name}' => '{}'`;
    });
    // return _.map(this.jsoncols(),(name)=>`'${name}' => '[]'`)
  }

  public cols_with(): string[] {
    return this.table.autoload;
    //return _.map(_.filter(this.table.cols,'_autolink'), 'name');
  }

  public cols_with_count(): string[] {
    return this.table.autocount;
    //return _.map(_.filter(this.table.cols,'_autolink_count'), 'name');
  }

  public renderParentRelations(): string {
    let res = "";
    //console.log(this.table.name, this.table.parentRelations)
    for(let r of this.table.parentRelations) {
      res += r.renderParent("Model")
      res += "\n";
    }
    return res;
  }

  public renderChildRelations(): string {
    let res = "";
    for(let r of this.table.childRelations) {
      res += r.renderChild("Model")
      res += "\n";
    }
    return res;
  }
}

export default RendererUtil;
