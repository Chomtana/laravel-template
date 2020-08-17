import Type from "./Type";
import BaseType from './BaseType';

export default class NativeType extends BaseType {
  public native_type: string;
  public native_args: any[];

  constructor(type: string, ...args: any[]) {
    super(...args)
    this.native_type = type;
    this.native_args = args;
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