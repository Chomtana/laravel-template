import Type from "./Type";
import BaseType from './BaseType';

export default class FileType extends BaseType {
  public native_type: string = "string";
  public native_args: any[] = [];

  constructor(...args: any[]) {
    super(...args)
  }

  public renderMigration(): string {
    let res = super.renderMigration();
    res += ``;
    return res;
  }

  public renderRouteAPI(): string {
    let res = super.renderRouteAPI();
    res += ``;

    if (this.col._hidden) {
      res = '';
    }
    return res;
  }

  public renderRouteView(): string {
    let res = super.renderRouteView();
    res += ``;

    if (this.col._hidden) {
      res = '';
    }
    return res;
  }

  public renderController(): string {
    let res = super.renderController();
    res += ``;

    if (this.col._hidden) {
      res = '';
    }
    return res;
  }

  public afterConstruct() {

  }


  
}