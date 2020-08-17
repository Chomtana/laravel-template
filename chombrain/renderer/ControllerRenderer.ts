import File from './File'
import Table from '../lib/table';
import Renderer from './Renderer';
import * as _ from 'lodash'

class ControllerRenderer extends Renderer {
  public file: File;
  public table: Table;

  constructor(table: Table) {
    super("../../app/Http/Controllers/Chomtana/"+table.name+"Controller.php")
    this.table = table
  }

  protected getRenderStr(): string {
    let res =
`<?php
namespace App\\Http\\Controllers\\Chomtana;

use Illuminate\\Http\\Request;
use App\\Http\\Controllers\\Controller;
${this.table.migration.renderModelsUse()}
${this.table.migration.renderRepositoriesUse()}
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\DB;

class ${this.table.name}Controller extends Controller {

  private $repo;

  function __construct(${this.table.name}Repository $repo) {
    $this->repo = $repo;
    $repo->fromController = true;
  }

  public function get(Request $request,${this.table.view_name} $row) {
    try {
      $output = $this->repo->get($row,$request->all());

      return response()->json($output);
    } catch (Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => parseSQLException($e->getMessage())
      ], 403);
    }
  }

  public function create(Request $request) {
    try {
      $row = $this->repo->create($request->all());

      return response()->json([
        'id' => $row->id,
        'status' => 'success',
        'data' => $row
      ]);

    } catch (\\Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => parseSQLException($e->getMessage())
      ], 403);
    }
  }

  public function update(Request $request,${this.table.name} $row) {
    try {
      $row = $this->repo->update($row, $request->all());

      return response()->json([
        'id' => $row->id,
        'status' => 'success',
        'data' => $row
      ]);
    } catch (Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => parseSQLException($e->getMessage())
      ], 403);
    }
  }

  public function delete(Request $request,${this.table.name} $row) {
    try {
      $row = $this->repo->delete($row);

      return response()->json([
        'id' => $row->id,
        'status' => 'success',
        'data' => $row
      ]);
    } catch (\\Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => parseSQLException($e->getMessage())
      ], 403);
    }
  }

  public function list(Request $request) {
    try {
      $output = $this->repo->list($request->all());

      return response()->json($output);
    } catch (\\Exception $e) {
      return response()->json([
        "status" => "forbidden",
        "message" => parseSQLException($e->getMessage())
      ], 403);
    }
  }

  public function view_list(Request $request) {
    return view('${this.table.name_raw}.list');
  }

  public function view_create(Request $request) {
    $mode = "create";
    return view('${this.table.name_raw}.update', compact("mode"));
  }

  public function view_update(Request $request, ${this.table.name} $row) {
    $mode = "update";
    $data = $row;
    return view('${this.table.name_raw}.update', compact("mode","row","data"));
  }

  ${_.map(this.table.cols_visible,(x)=>x.render("ControllerFunc")).join("\n\n")}

  ${_.map(this.table.childRelations,(x)=>x.renderChild("ControllerFunc")).join("\n\n\t")}

  ${_.map(this.table.parentRelations,(x)=>x.renderParent("ControllerFunc")).join("\n\n\t")}
}
`
    return res;
  };

  protected renderParts(): void {

  };
}

export default ControllerRenderer;
