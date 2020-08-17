import Type from "./Type";

export default class BaseType extends Type {
  public native_type: string;
  public native_args: any[];

  public renderMigration(): string {
    let res = ``;
    return res;
  }

  public renderRouteAPI(): string {
    let res = `
    //Column ${this.col.name}
    Route::get('/{row}/col/${this.col.name}', '${this.col.table.name}Controller@singlecol_${this.col.name}')->name('singlecol_${this.col.name}_get');
    `;
    return res;
  }

  public renderRouteView(): string {
    let res = `

    `;
    return res;
  }

  public renderController(): string {
    let res = `
    public function singlecol_${this.col.name}(Request $request, ${this.col.table.name} $row) {
      $row->onRead($row);
      return response()->json($row->${this.col.name});
    }
    `;
    return res;
  }

  public afterConstruct() {

  }


  
}