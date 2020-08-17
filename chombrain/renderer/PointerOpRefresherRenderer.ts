import File from "./File";
import Table from "../lib/table";
import Renderer from "./Renderer";
import * as _ from "lodash";
import Relation from "../lib/relation";
import Migration from "../lib/migration";

class PointerOpRefresherRenderer extends Renderer {
  public file: File;
  public migration: Migration;

  constructor(migration: Migration, options: any = {}) {
    super(
      "../../frontend/src/connector/refreshData.js"
    );
    this.migration = migration;
    //console.log(this.middleware)
  }

  private importConnectors() {
    var res = "";
    for(var table of this.migration.tables) {
      res += "import refresh"+table.name+' from "./'+table.name+"/refresh"+table.name+'";\n';
    }
    return res;
  }

  private writeRefreshes() {
    var res = "";
    for(var table of this.migration.tables) {
      res += "refresh"+table.name+"({noWakeup: true});\n";
    }
    return res;
  }

  protected getRenderStr(): string {
    let res = `
import api from "../api";
import { config } from "../config";

${this.importConnectors()}

export default function refreshData() {
  ${this.writeRefreshes()}
}

`;
    return res;
  }

  protected renderParts(): void {

  }
}

export default PointerOpRefresherRenderer;
