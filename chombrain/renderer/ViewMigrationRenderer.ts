import File from './File'
import Table from '../lib/table';
import Renderer from './Renderer';
import * as _ from 'lodash'
import Column from '../lib/column';
import View from './../lib/view';

class ViewMigrationRenderer extends Renderer {
  public file: File;
  public view: View;
  
  constructor(view: View) {
    var d = new Date()
    var d_str = d.getFullYear()+"_"+(d.getMonth()+1)+"_"+d.getDate()+"_"+(Date.now()%300000+600000)
    super("../../database/migrations/"+d_str+"_create_"+view.name_raw.replace("___","_xxxx_").replace("__","_xxx_")+"_view.php")
    this.view = view
  }

  protected getRenderStr(): string {
    let res =
`<?php

use Illuminate\\Support\\Facades\\Schema;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Database\\Migrations\\Migration;

class Create${this.view.name.replace("__","Xxxx").replace("_","Xxx")}View extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    DB::statement("CREATE VIEW ${this.view.name_raw} AS ${this.view.sql.replace(/\"/g,'\\"')}");
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    DB::statement("DROP VIEW ${this.view.name_raw}");
  }

}
`
    return res;
  };

  protected renderParts(): void {
    
  };
}

export default ViewMigrationRenderer;