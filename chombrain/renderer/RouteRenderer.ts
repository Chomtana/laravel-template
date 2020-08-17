import File from './File'
import Table from '../lib/table';
import Renderer from './Renderer';
import * as _ from 'lodash'

class RouteRenderer extends Renderer {
  public file: File;
  public table: Table;
  private middleware: Array<String>;

  constructor(table: Table, options: any = {}) {
    super("../../routes/api/Chomtana/"+table.name+".php")
    this.table = table
    if (!options.middleware) this.middleware = this.table.middleware_api;
    //console.log(this.middleware)
  }

  protected getRenderStr(): string {
    let res =
`<?php
Route::group(['as' => '${this.table.name_raw}.api.v2.',
  'prefix' => 'v2/${this.table.name_raw}',
  'middleware' => ${JSON.stringify(this.middleware)}],
  function () {

  //Base action
  Route::get('/', '${this.table.name}Controller@list')->name('list');
  Route::post('/create', '${this.table.name}Controller@create')->name('create');
  Route::get('/{row}', '${this.table.name}Controller@get')->name('get');
  Route::post('/{row}/update', '${this.table.name}Controller@update')->name('update');
  Route::post('/{row}/delete', '${this.table.name}Controller@delete')->name('delete');

  ${_.map(this.table.cols_visible,(x)=>x.render("Route")).join("\n\n")}

  ${_.map(this.table.childRelations,(x)=>x.renderChild("Route")).join("\n\n")}

  ${_.map(this.table.parentRelations,(x)=>x.renderParent("Route")).join("\n\n")}

});
`
    return res;
  };

  protected renderParts(): void {

  };
}

export default RouteRenderer;
