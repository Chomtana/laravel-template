import File from './File'
import Table from '../lib/table';
import Renderer from './Renderer';
import * as _ from 'lodash'
import RendererUtil from './RendererUtil';

class ModelRenderer extends Renderer {
  public file: File;
  public table: Table;
  public util: RendererUtil;

  constructor(table: Table) {
    super("../../app/Models/Chomtana/"+table.name+".php")
    this.table = table
    this.util = new RendererUtil(table);
  }

  protected getRenderStr(): string {
    let res =
//################## Main Part ###################
`<?php
namespace App\\Models\\Chomtana;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;
use App\\Models\\${this.table.nonview_table.name}\\${this.table.nonview_table.name}Permission;
use App\\Models\\${this.table.nonview_table.name}\\${this.table.nonview_table.name}Autofill;
${this.table.is_extender_view ? "use App\\Models\\Chomtana\\"+this.table.nonview_table.name+";" : ""}
${this.table.view_table.name != this.table.name ? "use App\\Models\\Chomtana\\"+this.table.view_table.name+";" : ""}
`+(()=>{
  return ``
})()+
`
class ${this.table.name} extends ${this.table.is_extender_view ? this.table.nonview_table.name : (this.table.name == "Users" ? "Authenticatable" : "Model")} {

  ${!this.table.is_extender_view ? `
    use ${this.table.nonview_table.name}Permission;
    use ${this.table.nonview_table.name}Autofill;
`: "" }

  protected $table = '${this.table.name_raw}';

  ${this.table.findColumn("id").create_new ? "public $incrementing = false;" : ""}

  /**
   * all columns of this table
   *
   */
  public $allColumns = ${JSON.stringify(this.util.cols_name())};

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = ${JSON.stringify(this.util.cols_fillables())};

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = ${JSON.stringify(this.util.cols_hidden())};

  /**
   * The attributes that should be cast to native types.
   *
   * @var array
   */
  protected $casts = [
    ${this.util.jsoncasts().join(",\n")},
    ${this.util.datetimecasts().join(",\n")}
  ];

  /**
   * default value of each column (only if value of that column is null)
   *
   * @var array
   */
  protected $attributes = [
    ${this.util.jsonattributes().join(",\n")}
  ];

  /**
   * The relations to eager load on every query.
   *
   * @var array
   */
  //protected $with = ${JSON.stringify(this.util.cols_with())};


  /**
   * The relationship counts that should be eager loaded on every query.
   *
   * @var array
   */
  protected $withCount = ${JSON.stringify(this.util.cols_with_count())};

  ${false && !this.table.is_view ? `
    public static function create(array $data = []) {
      if (!${this.table.name}::canCreate($data)) {
        throw new Exception("Permission denied");
        return;
      }
      $model = new ${this.table.name};
      $model->fill($data);

      $model->createAutofill($data, $model);

      $model->save();
      //$model->afterCreate($model);
      return $model;
    }
  ` : "" }

  public $is_view = ${this.table.is_view ? "true": "false"};

  public function nonview() {
    return $this->hasOne('App\\Models\\Chomtana\\${this.table.nonview_table.name}',"id","id");
  }

  public function view() {
    return $this->hasOne('App\\Models\\Chomtana\\${this.table.view_table.name}',"id","id");
  }

  public function refresh() {
    return ${this.table.name}::find($this->id);
  }

  ${this.util.renderParentRelations()}

  ${this.util.renderChildRelations()}

}
`;
    return res
  }

  protected renderParts() {
    class PermissionPart extends Renderer {
      public file: File;
      public table: Table;

      constructor(table: Table) {
        super("../../app/Models/"+table.name+"/"+table.name+"Permission.php", false)
        this.table = table
      }

      protected getRenderStr(): string {
        let res =
`<?php
namespace App\\Models\\${this.table.name};

use Illuminate\\Support\\Facades\\Auth;
use App\\Models\\Chomtana\\${this.table.name};

trait ${this.table.name}Permission {

  public static function canCreate(array &$data) {
    //if (Auth::user() && Auth::user()->is_admin) return true;

    return true;
  }

  public function canRead() {
    //if (Auth::user() && Auth::user()->is_admin) return true;

    return true;
  }

  public function canUpdate(array &$data) {
    //if (Auth::user() && Auth::user()->is_admin) return true;

    return true;
  }

  public function canDelete() {
    //if (Auth::user() && Auth::user()->is_admin) return true;

    return true;
  }

  public static function filterRecordRules($query) {
    return $query;
  }

}
`
        return res;
      }

      protected renderParts() {

      }
    }
    new PermissionPart(this.table).render()

    class AutofillPart extends Renderer {
      public file: File;
      public table: Table;

      constructor(table: Table) {
        super("../../app/Models/"+table.name+"/"+table.name+"Autofill.php", false)
        this.table = table
      }

      protected getRenderStr(): string {
        let res =
`<?php
namespace App\\Models\\${this.table.name};

use Illuminate\\Support\\Facades\\Auth;
use App\\Models\\Chomtana\\${this.table.name};

trait ${this.table.name}Autofill {

  public function onRead(${this.table.name} &$data) {

  }

  public static function beforeList() {

  }

  public static function afterList(&$data) {

  }

  public static function beforeCreate(array &$data) {

  }

  public function createAutofill(array &$data, ${this.table.name} &$currdata) {

  }

  public function afterCreate(${this.table.name} &$data) {

  }

  public function beforeUpdate(array &$data, ${this.table.name} &$olddata) {

  }

  public function updateAutofill(array &$data, ${this.table.name} &$currdata) {

  }

  public function afterUpdate(${this.table.name} &$data) {

  }

  public function beforeDelete(${this.table.name} &$data) {

  }

  public function afterDelete($id) {

  }

}
`
        return res;
      }

      protected renderParts() {

      }
    }
    new AutofillPart(this.table).render()
  }

}

export default ModelRenderer
