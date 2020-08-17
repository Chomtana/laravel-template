import Table from "./table";
import Relation from "./relation";

class OneToOne extends Relation {
  constructor() {
    super()
  }

  public renderChild(mode: string = "Model"): string {
    if (mode=="Model")
      var res =
`
  public function ${this.parentName}()
  {
    return $this->belongsTo('App\\Models\\Chomtana\\${this.parentTable.view_name}','${this.childColumn.name}');
  }
`
    else if (mode == "Migration") {
      if (this.childTable.crud_only || this.parentTable.crud_only) return "";
      var res =`
      $table->foreign('${this.childColumn.name}')
            ->references('id')
            ->on('${this.parentTable.name_raw}')
            ->onDelete('${this.parentColumn.isNullable()?'set null':'CASCADE'}')
            ->onUpdate('${this.parentColumn.isNullable()?'set null':'CASCADE'}');

      //$table->index('${this.childColumn.name}');
            `
    }
    else if (mode == "MigrationDown") {
      if (this.childTable.crud_only || this.parentTable.crud_only) return "";
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
    } catch (Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => $e->getMessage()
      ], 403);
    }
  }
          `
      else if (mode == "Route")
        var res = `
        Route::get('/{row}/${this.parentTable.name_raw}', '${this.childTable.name}Controller@relation_${this.parentName}')->name('${this.parentTable.name_raw}_get');
        `
    return res;
  }

  public renderParent(mode: string = "Model"): string {
    if (mode=="Model")
      var res =
`
  public function ${this.childName}()
  {
    return $this->hasOne('App\\Models\\Chomtana\\${this.childTable.view_name}','${this.childColumn.name}');
  }
`
    else if (mode == "Migration")
      var res =`

            `
    else if (mode == "ControllerFunc")
      var res = `
  public function relation_${this.childName}(Request $request,${this.parentTable.name} $row) {
    try {
      $output = ${this.childTable.name}::filterRecordRules( $row->${this.childName}() );

      if (!$output) {
        throw new \\Exception("Permission Denied");
      }

      $output = $output->first();

      return response()->json($output);
    } catch (Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => $e->getMessage()
      ], 403);
    }
  }

  public function relation_${this.childName}_create(Request $request,${this.parentTable.name} $row) {
    try {
      $data = $request->all();
      $data["${this.childColumn.name}"] = $row->id;

      DB::transaction(function () use ($data, $row) {
        if (!${this.childTable.name}::canCreate($data)) {
          throw new Exception("Permission denied");
          return;
        }

        $newrow = new ${this.childTable.name};
        $newrow->fill($data);
        $newrow->createAutofill($data);
        $newrow->${this.childColumn.name} = $row->id;
        $newrow->save();
      });

      return response()->json([
        'status' => 'success',
        'data' => $newrow
      ]);
    } catch (Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => $e->getMessage()
      ], 403);
    }
  }
      `
    else if (mode == "Route")
      var res = `
      Route::get('/{row}/${this.childName}', '${this.parentTable.name}Controller@relation_${this.childName}')->name('${this.childTable.name_raw}_get');
      `
    return res;
  }
}

export default OneToOne
