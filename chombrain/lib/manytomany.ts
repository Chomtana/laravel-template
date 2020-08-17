import Table from "./table";
import Relation from "./relation";
import * as _ from 'lodash'

class ManyToMany extends Relation {

  constructor() {
    super()
  }

  public renderChild(mode: string = "Model"): string {
    if (mode=="Model")
      var res =
`
  public function ${this.parentName}()
  {
    return $this->belongsToMany('App\\Models\\Chomtana\\${this.parentTable.view_name}','${this.pivotTable.view_name}','${this.childColumn.name}','${this.parentColumn.name}')
            ->withPivot(${JSON.stringify(_.map(this.pivotTable.view_table.cols,"name"))})
            ->withTimestamps();
  }
`
    else if (mode=="Migration")
      var res =
      `

      `
    return res;
  }

  public renderParent(mode: string = "Model"): string {
    if (mode=="Model")
      var res =
`
  public function ${this.childName}()
  {
    return $this->belongsToMany('App\\Models\\Chomtana\\${this.childTable.view_name}','${this.pivotTable.view_name}','${this.parentColumn.name}','${this.childColumn.name}')
            ->withPivot(${JSON.stringify(_.map(this.pivotTable.view_table.cols,"name"))})
            ->withTimestamps();
  }
`
    else if (mode=="Migration")
      var res =
      `

      `
    return res;
  }
}

export default ManyToMany
