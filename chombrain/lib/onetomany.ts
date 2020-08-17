import Table from "./table";
import Column from "./column";
import Relation from "./relation";
var kebabCase = require('kebab-case');

class OneToMany extends Relation {
  constructor() {
    super()
  }

  public renderChild(mode: string = "Model"): string {
    if (mode=="Model") {
      var res =
      `
        public function ${this.parentName}${this.isMorph?"___":""}()
        {
          return $this->belongsTo('App\\Models\\Chomtana\\${this.parentTable.view_name}','${this.childColumn.name}');
        }
      `
      if (this.isMorph) {
        res += `
          public function get${kebabCase.reverse("-"+this.parentName.replace(/_/,"-"))}Attribute() {
            if($this->${this.morphTypeColumn.name} == 'App\\Models\\Chomtana\\${this.parentTable.view_name}') return $this->${this.parentName}___;
            return null;
          }
        `
      }

      if (this.isMorph && !this.childColumn._morphToRendered) res += `
        public function ${this.morphName}() {
          return $this->morphTo();
        }
      `;
      if (this.isMorph) this.childColumn._morphToRendered = true;
    }
    else if (mode == "Migration") {
      if (this.childTable.crud_only || this.parentTable.crud_only) return "";
      if (this.isMorph) return "";
      var res =`
      $table->foreign('${this.childColumn.name}')
            ->references('id')
            ->on('${this.parentTable.name_raw}')
            ->onDelete('${this.parentColumn.isNullable()?'set null':this.onDelete}')
            ->onUpdate('${this.parentColumn.isNullable()?'set null':this.onDelete}');

      //$table->index('${this.childColumn.name}');
            `
    }
    else if (mode == "MigrationDown") {
      if (this.childTable.crud_only || this.parentTable.crud_only) return "";
      if (this.isMorph) return "";
      var res =`
      $table->dropForeign(['${this.childColumn.name}']);
            `
    }
    else if (mode == "ControllerFunc")
      var res =`
  public function relation_${this.parentName}(Request $request,${this.childTable.name} $row) {
    try {
      $output = ${this.parentTable.name}::filterRecordRules( $row->${this.parentName}() );

      if (!$output) {
        throw new \\Exception("Permission Denied");
      }

      $output = $output->first();

      return response()->json($output);
    } catch (\\Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => parseSQLException($e->getMessage())
      ], 403);
    }
  }
          `
    else if (mode == "Route")
      var res = `
      Route::get('/{row}/${this.parentTable.name_raw}', '${this.childTable.name}Controller@relation_${this.parentName}')->name('${this.parentTable.name_raw}_get');
      `
    else if (mode == "RouteView") {

    }
    return res;
  }

  public renderParent(mode: string = "Model"): string {
    /*if (this.parentTable.name=="ProductionOrderView") {
      console.log(this.parentTable.name, this.parentTable.view_table.name);
    }
    console.log(this.parentTable.name);*/
    if (mode=="Model")
      var res =
`
  public function ${this.childName}()
  {
    ${!this.isMorph ? `
      return $this->hasMany('App\\Models\\Chomtana\\${this.childTable.view_name}','${this.childColumn.name}');
    ` : `
      return $this->view->morphMany('App\\Models\\Chomtana\\${this.childTable.view_name}', '${this.parentName}', '${this.morphTypeColumn.name}', '${this.childColumn.name}');
    `
    }
  }
`
    else if (mode == "Migration")
      var res =`

            `
    else if (mode == "ControllerFunc")
      var res =`
  public function relation_${this.childName}(Request $request,${this.parentTable.name} $row) {
    try {
      ${this.childTable.name}::beforeList();
      $output = ${this.childTable.name}::filterRecordRules( $row->${this.childName}() );

      if (!$output) {
        throw new \\Exception("Permission Denied");
      }

      $output = $output->get();

      ${this.childTable.name}::afterList($output);

      return response()->json($output);
    } catch (\\Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => parseSQLException($e->getMessage())
      ], 403);
    }
  }

  public function relation_${this.childName}_create(Request $request,${this.parentTable.name} $row) {
    try {
      $data = $request->all();
      $data["${this.childColumn.name}"] = $row->id;

      $newrow = new ${this.childTable.name};

      DB::transaction(function () use ($data, $row, $newrow) {
        if (!${this.childTable.name}::canCreate($data)) {
          throw new \\Exception("Permission denied");
          return;
        }

        ${this.childTable.name}::beforeCreate($data);

        $newrow->fill($data);
        $newrow->createAutofill($data,$newrow);
        $newrow->${this.childColumn.name} = $row->id;
        $newrow->save();
        $newrow->afterCreate($newrow);
      });

      return response()->json([
        'status' => 'success',
        'data' => $newrow
      ]);
    } catch (\\Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => parseSQLException($e->getMessage())
      ], 403);
    }
  }

  public function relation_${this.childName}_update(Request $request,${this.parentTable.name} $row, ${this.childTable.name} $childRow) {
    try {
      $data = $request->all();

      DB::transaction(function () use ($data, $row, $childRow) {
        if (!$childRow->canUpdate($data)) {
          throw new Exception("Permission denied");
        }

        $childRow->beforeUpdate($data, $row);

        $childRow->fill($data);
        $childRow->updateAutofill($data, $childRow);
        $childRow->touch();
        $childRow->save();

        $childRow->afterUpdate($childRow);
      });

      return response()->json([
        'id' => $childRow->id,
        'status' => 'success',
        'data' => $childRow
      ]);
    } catch (\\Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => parseSQLException($e->getMessage())
      ], 403);
    }
  }

  public function relation_${this.childName}_delete(Request $request,${this.parentTable.name} $row, ${this.childTable.name} $childRow) {
    try {
      DB::transaction(function () use ($row, $childRow) {
        if (!$childRow->canDelete()) {
          throw new Exception("Permission denied");
        }

        $childRow->beforeDelete($childRow);

        $id = $childRow->id;

        $childRow->delete();

        $childRow->afterDelete($id);
      });

      return response()->json([
        'id' => $id,
        'status' => 'success'
      ]);
    } catch (\\Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => parseSQLException($e->getMessage())
      ], 403);
    }
  }

  public function relation_${this.childName}__view_create(Request $request, ${this.parentTable.name} $parentRow) {
    $mode = "create";
    return view('${this.parentTable.name_raw}.${this.childName}.update', compact("mode", "parentRow"));
  }

  public function relation_${this.childName}__view_update(Request $request, ${this.parentTable.name} $parentRow, ${this.childTable.name} $row) {
    $mode = "update";

    $data = $row;
    return view('${this.parentTable.name_raw}.${this.childName}.update', compact("mode", "parentRow", "row", "data"));
  }

  public function relation_${this.childName}__view_list(Request $request, ${this.parentTable.name} $parentRow) {
    return view('${this.parentTable.name_raw}.${this.childName}.list', compact("parentRow"));
  }
          `
    else if (mode == "Repository_ChildCRUD_create")
      var res = `
        if (isset($data['${this.childName}']) && is_array($data['${this.childName}'])) {
          foreach ($data['${this.childName}'] as $item) {
            if (!is_array($item)) continue;
            $item['${this.childColumn.name}'] = $row->id;
            $item_model = (new \\App\\Repositories\\Chomtana\\${this.childTable.name}Repository)->firstOrNew(['id' => $item['id'] ?? 0], $item);
          }
        }
      `
    else if (mode == "Repository_ChildCRUD_update")
      var res = `
        if (isset($data['${this.childName}']) && is_array($data['${this.childName}'])) {
          $removed_ids = $row->${this.childName}->pluck('id')->diff(collect($data['${this.childName}'])->pluck('id'))->all();
          (new \\App\\Repositories\\Chomtana\\${this.childTable.name}Repository)->destroy($removed_ids);

          foreach ($data['${this.childName}'] as $item) {
            if (!is_array($item)) continue;
            $item['${this.childColumn.name}'] = $row->id;
            $item_model = (new \\App\\Repositories\\Chomtana\\${this.childTable.name}Repository)->firstOrNew(['id' => $item['id'] ?? 0], $item);
            $item_model->${this.childColumn.name} = $row->id;
            $item_model->save();
          }
        }
      `
    else if (mode == "Route")
      var res = `
      Route::get('/{row}/${this.childName}', '${this.parentTable.name}Controller@relation_${this.childName}')->name('${this.childTable.name_raw}_get');
      Route::post('/{row}/${this.childName}/create', '${this.parentTable.name}Controller@relation_${this.childName}_create')->name('${this.childTable.name_raw}_create');
      Route::post('/{row}/${this.childName}/{childRow}/update', '${this.parentTable.name}Controller@relation_${this.childName}_update')->name('${this.childTable.name_raw}_update');
      Route::post('/{row}/${this.childName}/{childRow}/delete', '${this.parentTable.name}Controller@relation_${this.childName}_delete')->name('${this.childTable.name_raw}_delete');
      `
    else if (mode == "RouteView")
      var res = `
      Route::get('/{parentRow}/${this.childName}/{row}/update', '${this.parentTable.name}Controller@relation_${this.childName}__view_update')->name('relation_${this.childTable.name_raw}__view_update');
      Route::get('/{parentRow}/${this.childName}/create', '${this.parentTable.name}Controller@relation_${this.childName}__view_create')->name('relation_${this.childTable.name_raw}__view_create');
      Route::get('/{parentRow}/${this.childName}/', '${this.parentTable.name}Controller@relation_${this.childName}__view_list')->name('relation_${this.childTable.name_raw}__view_list');
      `
    return res;
  }
}

export default OneToMany
