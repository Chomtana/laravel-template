import Column from './../lib/column';
import Table from '../lib/table';

export default abstract class Type {
  public abstract native_type: string;
  public abstract native_args: Array<any>;
  public args: any;

  //autofill when you use function T.column(...).type(...)
  public col: Column;
  public table: Table;

  constructor(...args: any[]) {
    this.args = args;
  }

  public abstract renderMigration(): string;
  public abstract renderRouteAPI(): string;
  public abstract renderRouteView(): string;
  public abstract renderController(): string;
  
  get native_default() {
    return this.col.getDefaultValue();
  }

  /**
   * Called by Column class after autofill value from T.column(...).type(...)
   */
  public abstract afterConstruct(): void;
}