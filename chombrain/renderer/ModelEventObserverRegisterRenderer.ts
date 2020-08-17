import File from './File'
import Table from '../lib/table';
import Renderer from './Renderer';
import * as _ from 'lodash'
import Column from '../lib/column';
import View from '../lib/view';
import Migration from './../lib/migration';

class ModelEventObserverRegisterRenderer extends Renderer {
  public file: File;
  public migration: Migration;

  constructor(migration: Migration) {
    super("../../app/Chomtana/modelobserverregister.php");
    this.migration = migration
  }

  protected getRenderStr(): string {
    let res =
`<?php
${this.migration.renderModelsUse()}
${this.migration.tables.map((x)=>"use App\\Models\\Chomtana\\"+x.name+"\\"+x.name+"EventObserver;").join("\n")}

if (! function_exists('___registerModelObserver')) {
  function ___registerModelObserver() {
    ${this.migration.tables.map((table: Table)=> `
      ${table.is_view ? `${table.name}::observe(${table.nonview_table.name}EventObserver::class);` : `${table.name}::observe(${table.name}EventObserver::class);`}
    `).join("")}
  }
}
`
    return res;
  };

  protected renderParts(): void {

  };
}

export default ModelEventObserverRegisterRenderer;
