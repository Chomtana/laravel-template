import File from './File'
import Table from '../lib/table';
import Renderer from './Renderer';
import * as _ from 'lodash'
import Column from '../lib/column';
import { isArray } from 'util';

class MigrationRenderer extends Renderer {
  public file: File;
  public table: Table;

  constructor(table: Table) {
    var d = new Date()
    var d_str = d.getFullYear()+"_"+(d.getMonth()+1)+"_"+d.getDate()+"_"+(Date.now()%300000+100000)
    super("../../database/migrations/"+d_str+"_create_"+table.name_raw.replace("___","_xxxx_").replace("__","_xxx_")+"_table.php")
    this.table = table
  }

  protected getRenderStr(): string {
    let res =
`<?php

use Illuminate\\Support\\Facades\\Schema;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Database\\Migrations\\Migration;

class Create${this.table.name.replace("__","Xxxx").replace("_","Xxx")}Table extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('${this.table.name_raw}', function (Blueprint $table) {
      ${!this.table.findColumn("id").create_new ? "$table->id();" : "" }
      ${_.map(this.table.cols,(col)=>col.render("Migration")).join("\n")}
      $table->timestamps();

      ${_.map(this.table.extra_index,(x)=>"$table->index("+JSON.stringify(x)+");")}
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('${this.table.name_raw}');
  }

}
`
    return res;
  };

  protected renderParts(): void {

  };
}

export default MigrationRenderer;
