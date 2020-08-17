import Type from "./Type";
import BaseType from './BaseType';

export default class ArrayType extends BaseType {
  public native_type: string;
  public native_args: any[];

  constructor(...args: any[]) {
    super(...args)
    this.native_type = "json";
    this.native_args = args;
  }

  public renderMigration(): string {
    let res = super.renderMigration();
    res += ``;
    return res;
  }

  public renderRouteAPI(): string {
    let res = super.renderRouteAPI();
    if (this.col._fillable) {
      res += `
      Route::post('/{row}/col/${this.col.name}/create', '${this.col.table.name}Controller@singlecol_${this.col.name}_append')->name('singlecol_${this.col.name}_create');
      Route::post('/{row}/col/${this.col.name}/append', '${this.col.table.name}Controller@singlecol_${this.col.name}_append')->name('singlecol_${this.col.name}_append');
      Route::get('/{row}/col/${this.col.name}/{index}', '${this.col.table.name}Controller@singlecol_${this.col.name}_get')->name('singlecol_${this.col.name}_get');
      Route::post('/{row}/col/${this.col.name}/{index}/update', '${this.col.table.name}Controller@singlecol_${this.col.name}_update')->name('singlecol_${this.col.name}_update');
      Route::post('/{row}/col/${this.col.name}/{index}/delete', '${this.col.table.name}Controller@singlecol_${this.col.name}_delete')->name('singlecol_${this.col.name}_delete');
      Route::post('/{row}/col/${this.col.name}/{index}/up', '${this.col.table.name}Controller@singlecol_${this.col.name}_up')->name('singlecol_${this.col.name}_up');
      Route::post('/{row}/col/${this.col.name}/{index}/down', '${this.col.table.name}Controller@singlecol_${this.col.name}_down')->name('singlecol_${this.col.name}_down');
      `;
    }

    if (this.col._hidden) {
      res = '';
    }
    return res;
  }

  public renderRouteView(): string {
    let res = super.renderRouteView();
    if (this.col._fillable) {
      res += `
      Route::get('/{row}/col/${this.col.name}/{index}/update', '${this.table.name}Controller@singlecol_${this.col.name}__view_update')->name('singlecol_${this.col.name}__view_update');
      Route::get('/{row}/col/${this.col.name}/create', '${this.table.name}Controller@singlecol_${this.col.name}__view_create')->name('singlecol_${this.col.name}__view_create');
      `
    }

    if (this.col._hidden) {
      res = '';
    }
    return res;
  }

  public renderController(): string {
    let res = super.renderController();
    res += `            
    public function singlecol_${this.col.name}_append(Request $request, ${this.table.name} $row) {
      try {
        $req_data = $request->all();

        $data_single = $row->${this.col.name};
        
        $data_single[] = $req_data;

        $data = array("${this.col.name}"=>$data_single);
  
        DB::transaction(function () use ($data, $row) {
          if (!$row->canUpdate( $data )) {
            throw new Exception("Permission denied");
          }

          $row->beforeUpdate($data, $row);
    
          $row->fill( $data );
          $row->updateAutofill( $data, $row );
          $row->touch();
          $row->save();
        });
  
        return response()->json([
          'id' => sizeof($row->${this.col.name})-1,
          'status' => 'success',
          'data' => $row->${this.col.name}
        ]);
      } catch (Exception $e) {
        return response()->json([
          "status" => "forbidden",
          "message" => $e->getMessage()
        ], 403);
      }
    }

    public function singlecol_${this.col.name}_update(Request $request,${this.table.name} $row, $index) {
      try {
        $data_single = $row->${this.col.name};

        $data_single[$index] = $request->all();

        $data = array("${this.col.name}"=>$data_single);

        DB::transaction(function () use ($data, $row, $index) {
          if (!$row->canUpdate( $data )) {
            throw new Exception("Permission denied");
          }

          $row->beforeUpdate($data, $row);
    
          $row->fill( $data );
          $row->updateAutofill( $data, $row );
          $row->touch();
          $row->save();

          $row->afterUpdate($row);
        });
  
        return response()->json([
          'status' => 'success',
          'id' => $index,
          'data' => $row
        ]);
      } catch (Exception $e) {
        return response()->json([
          'id' => $index,
          "status" => "forbidden",
          "message" => $e->getMessage()
        ], 403);
      }
    }

    public function singlecol_${this.col.name}_up(Request $request,${this.table.name} $row, $index) {
      try {
        $data_single = $row->${this.col.name};

        $target_index = $index;

        if ($index > 0) {
          $temp = $data_single[$index-1];
          $data_single[$index-1] = $data_single[$index];
          $data_single[$index] = $temp;
          $target_index = $index-1;
        }

        $data = array("${this.col.name}"=>$data_single);

        DB::transaction(function () use ($data, $row, $index) {
  
          if (!$row->canUpdate( $data )) {
            throw new Exception("Permission denied");
          }

          $row->beforeUpdate($data, $row);
    
          $row->fill( $data );
          $row->updateAutofill( $data, $row );
          $row->touch();
          $row->save();

          $row->afterUpdate($row);

        });
  
        return response()->json([
          'status' => 'success'
        ]);
      } catch (Exception $e) {
        return response()->json([
          'id' => $target_index,
          "status" => "forbidden",
          "message" => $e->getMessage()
        ], 403);
      }
    }

    public function singlecol_${this.col.name}_down(Request $request,${this.table.name} $row, $index) {
      try {
        $data_single = $row->${this.col.name};

        $target_index = $index;

        if ($index < sizeof($data_single) - 1) {
          $temp = $data_single[$index+1];
          $data_single[$index+1] = $data_single[$index];
          $data_single[$index] = $temp;
          $target_index = $index+1;
        }

        $data = array("${this.col.name}"=>$data_single);

        DB::transaction(function () use ($data, $row, $index) {
          if (!$row->canUpdate( $data )) {
            throw new Exception("Permission denied");
          }

          $row->beforeUpdate($data, $row);
    
          $row->fill( $data );
          $row->updateAutofill( $data, $row );
          $row->touch();
          $row->save();

          $row->afterUpdate($row);
        });
  
        return response()->json([
          'status' => 'success'
        ]);
      } catch (Exception $e) {
        return response()->json([
          'id' => $target_index,
          "status" => "forbidden",
          "message" => $e->getMessage()
        ], 403);
      }
    }

    public function singlecol_${this.col.name}_delete(Request $request,${this.table.name} $row, $index) {
      try {
        $data_single = $row->${this.col.name};

        array_splice($data_single, $index, 1);

        $data = array("${this.col.name}"=>$data_single);

        DB::transaction(function () use ($data, $row, $index) {
          if (!$row->canUpdate( $data )) {
            throw new Exception("Permission denied");
          }

          $row->beforeUpdate($data, $row);
    
          $row->fill( $data );
          $row->updateAutofill( $data, $row );
          $row->touch();
          $row->save();

          $row->afterUpdate($row);
        });
  
        return response()->json([
          'status' => 'success',
          'id' => $index
        ]);
      } catch (Exception $e) {
        return response()->json([
          'id' => $index,
          "status" => "forbidden",
          "message" => $e->getMessage()
        ], 403);
      }
    }

    public function singlecol_${this.col.name}_get(Request $request,${this.table.name} $row, $index) {
      try {
        $output = $row->${this.col.name};

        if ($index >= sizeof($output) || $index < 0) {
          return response()->json([
            "status" => "not found"
          ], 404);
        }

        $output = $output[$index];
  
        if (!$row->canRead()) {
          throw new Exception("Permission denied");
        }
  
        return response()->json($output);
      } catch (Exception $e) {
        return response()->json([
          "status" => "forbidden",
          "message" => $e->getMessage()
        ], 403);
      }
    }

    public function singlecol_${this.col.name}__view_create(Request $request, ${this.table.name} $row) {
      $mode = "create";
      return view('${this.table.name_raw}.${this.col.name}.update', compact("mode", "row")); 
    }

    public function singlecol_${this.col.name}__view_update(Request $request, ${this.table.name} $row, $index) {
      $mode = "update";

      $output = $row->${this.col.name};

      if ($index >= sizeof($output) || $index < 0) {
        return abort(404);
      }

      $data = $output[$index];
      return view('${this.table.name_raw}.${this.col.name}.update', compact("mode","row","data","index")); 
    }
    `;

    if (this.col._hidden) {
      res = '';
    }
    return res;
  }

  public afterConstruct() {

  }


  
}