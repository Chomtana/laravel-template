import File from './File'
import Table from '../lib/table';
import Renderer from './Renderer';
import * as _ from 'lodash'

class RepositoryRenderer extends Renderer {
  public file: File;
  public table: Table;

  constructor(table: Table) {
    super("../../app/Repositories/Chomtana/"+table.name+"Repository.php")
    this.table = table
  }

  protected getRenderStr(): string {
    let res =
`<?php
namespace App\\Repositories\\Chomtana;

use Illuminate\\Http\\Request;
use App\\Repositories\\Repository;
${this.table.migration.renderModelsUse()}
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\DB;
use Carbon\\Carbon;

class ${this.table.name}Repository extends Repository {
  public $fromController = false;

  public function model() {
    return 'App\\Models\\Chomtana\\${this.table.name}';
  }

  public function formatRow($row) {
    if ($this->fromController) {
      if (!is_array($row)) $row = $row->toArray();

      //var_dump($row);

      ${this.table.cols_visible.map((col)=>{
        if (col._type.native_type == "date" || col._type.native_type == "datetime" || col._type.native_type == "timestamp") {
          return "if (isset($row['"+col.name+"'])) $row['"+col.name+"'] = Carbon::parse($row['"+col.name+"'])->toIso8601String();";
        }

        return "";
      }).join("\n")}

      if (isset($row['created_at'])) $row['created_at'] = Carbon::parse($row['created_at'])->toIso8601String();
      if (isset($row['updated_at'])) $row['updated_at'] = Carbon::parse($row['updated_at'])->toIso8601String();

      //var_dump($row['updated_at']);

      return $row;
    } else {
      return $row;
    }
  }

  public function formatRowBack($row) {
    ${this.table.cols_visible.map((col)=>{
      if (col._type.native_type == "datetime" || col._type.native_type == "timestamp") {
        return "if (isset($row['"+col.name+"'])) $row['"+col.name+"'] = Carbon::parse($row['"+col.name+"'])->toDateTimeString();";
      } else if (col._type.native_type == "date") {
        return "if (isset($row['"+col.name+"'])) $row['"+col.name+"'] = Carbon::parse($row['"+col.name+"'])->toDateString();";
      }

      return "";
    }).join("\n")}

    if (isset($row['created_at'])) $row['created_at'] = Carbon::parse($row['created_at'])->toDateTimeString();
    if (isset($row['updated_at'])) $row['updated_at'] = Carbon::parse($row['updated_at'])->toDateTimeString();

    //var_dump($row['updated_at']);

    return $row;
  }

  public function get($row, array $args = []) {
    $output = $row;

    if (!$row) return null;

    if (!$row->canRead()) {
      throw new \\Exception("Permission denied");
    }

    $row->onRead($row);

    if (isset($args["____revisions"])) {
      $revisions = Revisions::find($output->edit_histories[$args["____revisions"]]["revisions_id"]);
      $output = $this->formatRow($revisions->body);
      $output["____header"] = $revisions->header;
    } else {
      $output = $this->formatRow($output);
    }

    return $output;
  }

  public function create(array $data) {
    //$data = $request->all();
    $data = $this->formatRowBack($data);

    $row = new ${this.table.name};



    DB::transaction(function () use ($data, $row) {
      if (!${this.table.name}::canCreate($data)) {
        throw new \\Exception("Permission denied");
      }

      ${this.table.name}::beforeCreate($data);

      $row->fill($data);
      ${this.table.cols.map(x=>x.name).indexOf("description") != -1 && this.table.cols.map(x=>x.name).indexOf("product_id") != -1 ?
        "$row->description = $row->product->name;" :
      ""}
      $row->createAutofill($data,$row);
      $row->save();

      ${this.table.name_raw!="revisions" ? `
        $revision_data = [
          "reference_type" => $this->model(),
          "reference_id" => $row->id,
          "header" => [
            "type" => "create",
            "note" => $data["____note"] ?? "",
            "ip" => request()->ip(),
            "at" => Carbon::now()->toIso8601String()
          ],
          "body" => $row
        ];
        if (Auth::check()) {
          $revision_data["header"]["user_id"] = Auth::id();
          $revision_data["header"]["username"] = Auth::user()->name;
          $revision_data["header"]["email"] = Auth::user()->email;
        } else {
          $revision_data["header"]["guestname"] = $data["____guestname"] ?? "";
        }
        Revisions::beforeCreate($revision_data);
        $revision = new Revisions;
        $revision->createAutofill($revision_data,$revision);
        $revision->save();
        $revision->afterCreate($revision);

      ` : '' }

      $row->afterCreate($row);



      ${_.map(this.table.parentRelations,(x)=>x.renderParent("Repository_ChildCRUD_create")).join("\n\n\t")}

      if ($this->fromController) {
        $row->edit_histories = [$revision_data["header"]];
      }
    });

    return $row;
  }

  public function update($row, array $data) {
    $data = $this->formatRowBack($data);

    if ($row->is_view) $row = $row->nonview;

    DB::transaction(function () use ($data, $row) {
      if (!$row->canUpdate($data)) {
        throw new \\Exception("Permission denied");
      }

      $row->beforeUpdate($data, $row);

      $row->update($data);
      ${this.table.cols.map(x=>x.name).indexOf("description") != -1 && this.table.cols.map(x=>x.name).indexOf("product_id") != -1 ?
        "$row->description = $row->product->name;" :
      ""}
      $row->updateAutofill($data, $row);
      $row->touch();
      $row->save();

      ${this.table.name_raw!="revisions" ? `
        $revision_data = [
          "reference_type" => $this->model(),
          "reference_id" => $row->id,
          "header" => [
            "type" => "edit",
            "note" => $data["____note"] ?? "",
            "ip" => request()->ip(),
            "at" => Carbon::now()->toIso8601String()
          ],
          "body" => $row
        ];
        if (Auth::check()) {
          $revision_data["header"]["user_id"] = Auth::id();
          $revision_data["header"]["username"] = Auth::user()->name;
          $revision_data["header"]["email"] = Auth::user()->email;
        } else {
          $revision_data["header"]["guestname"] = $data["____guestname"] ?? "";
        }
        Revisions::beforeCreate($revision_data);
        $revision = new Revisions;
        $revision->createAutofill($revision_data,$revision);
        $revision->save();
        $revision->afterCreate($revision);

      ` : '' }

      $row->afterUpdate($row);

      ${_.map(this.table.parentRelations,(x)=>x.renderParent("Repository_ChildCRUD_update")).join("\n\n\t")}
    });

    $row = $row->refresh();

    return $row;
  }

  public function delete($row, array $args = []) {
    if ($row->is_view) $row = $row->nonview;

    if (!$row->canDelete()) {
      throw new \\Exception("Permission denied");
    }

    DB::transaction(function () use ($row) {
      $row->beforeDelete($row);

      $id = $row->id;

      $row->delete();

      $row->afterDelete($id);
    });

    return $row;
  }

  public function list(array $args = []) {
    ${this.table.name}::beforeList();

    $output = ${this.table.name}::filterRecordRules( ${this.table.view_name}::query() );

    ${this.table.cols_visible.map(col=>`
      if (isset($args['where__${col.name}'])) {
        $output = $output->where('${col.name}',$args['where__${col.name}']);
      }
    `).join("")}

    if (isset($args['where_raw'])) {
      if (is_array($args['where_raw'])) {
        foreach($args['where_raw'] as $expr) {
          $output = $output->whereRaw($expr);
        }
      } else {
        $output = $output->whereRaw($args['where_raw']);
      }
    }

    if (!$output) {
      throw new \\Exception("Permission Denied");
    }

    $sortBy = $args["sort_by"] ?? null;
    if (isset($sortBy) && $sortBy !== null) {
      foreach($sortBy as $sort) {
        $sort = explode(" ",trim($sort));
        if (sizeof($sort)==1) {
          $output = $output->orderBy($sort[0],'asc');
        } else {
          if (strcasecmp($sort[1],"DESC") == 0) {
            $output = $output->orderBy($sort[0],'desc');
          } else {
            $output = $output->orderBy($sort[0],'asc');
          }
        }
      }
    }

    $output = $output->orderBy('id','desc');

    $simpleSearch = $args["simple_search"] ?? null;
    if (isset($simpleSearch) && $simpleSearch !== null) {
      $output = $output->where(function ($query) use ($simpleSearch) {
        $query
          ${_.map(this.table.columns,(x)=>x.render("SimpleSearchEXP")).join("\n            ")}
        ;
      });
    }

    if (($args["paginate"] ?? false)=="true") {
      $output = $output->paginate();
      $output->appends(request()->except('page'))->links();
    } else {
      $output = $output->get();
    }

    if ($this->fromController) {
      for($i = 0;$i<sizeof($output);$i++) {
        $output[$i] = $this->formatRow($output[$i]);
      }
    }

    ${this.table.name}::afterList($output);

    return $output;
  }
}
`
    return res;
  };

  protected renderParts(): void {

  };
}

export default RepositoryRenderer;
