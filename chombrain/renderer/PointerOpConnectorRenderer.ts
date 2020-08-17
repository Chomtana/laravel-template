import File from "./File";
import Table from "../lib/table";
import Renderer from "./Renderer";
import * as _ from "lodash";
import Relation from "../lib/relation";

class PointerOpConnectorRenderer extends Renderer {
  public file: File;
  public table: Table;

  constructor(table: Table, options: any = {}) {
    super(
      "../../frontend/src/connector/" +
        table.name +
        "/refresh" +
        table.name +
        ".js"
    );
    this.table = table;
    //console.log(this.middleware)
  }

  private importWakeup() {
    /*var tables = _.union(
      this.table.childRelations.map(re => re.parentTable.name),
      this.table.parentRelations.map(re => re.childTable.name)
    );*/

    var tables = this.table.migration.tables.filter(t=>t.name_raw!=this.table.name_raw).map(t=>t.name);

    return tables
      .map(name => `import { wakeup${name}, register${name}Hook } from "../${name}/refresh${name}"`)
      .join("\n");
  }

  private renderChildTemplate(table: Table) {
    var res = {};
    for(var col of table.cols) {
      if (col._fillable && !col._generated) {
        res[col.name] = col.getDefaultValue();
        if (typeof res[col.name] === "undefined") res[col.name] = null;
      }
    }
    for(var re of table.parentRelations) {
      if (!re.childTable.is_view) {
        res[re.childName] = [];
      }
    }
    if (typeof res["id"] === "undefined") res["id"] = -1;
    return res;
  }

  protected getRenderStr(): string {
    let res = `
import api from "../../api";
import createGlobalPointer from "../../pointer/createGlobalPointer";
import createGlobalPointerOp from "../../pointer/createPointerOp";
import globalPointerOp from "../../pointer/globalPointerOp";
import globalPointer from "../../pointer/globalPointer";
import defaultOpRenderer from "../../pointer/defaultOpRenderer";
import { config } from "../../config";

import afterReady${this.table.name} from "./afterReady${this.table.name}";

${this.importWakeup()}

export function backWire${this.table.name}(pp) {
  //backwire itself
  register${this.table.name}Hook(pp);
  const p = globalPointer("${this.table.name_raw}");
  const pcorrect = p.find({id: pp("id")()});
  if (typeof pcorrect === "undefined") p.push_front(pp);

  ${this.renderBackWireChildRelation("pp", this.table.parentRelations)}
  ${this.renderBackWireParentRelation("pp", this.table.childRelations)}

  const op = globalPointerOp("${this.table.name_raw}");
  op.rerenderAll();
}

export function register${this.table.name}Hook(pp) {
  ${this.renderChildRelations("pp", this.table.parentRelations)}
  ${this.renderParentRelations("pp", this.table.childRelations)}

  pp.hook("afterCommit",(val)=>{
    if (typeof val.id === "undefined" || val.id == -1 || pp.mark("create_new")) {
      api.post("/${this.table.name_raw}/create", val).then(res=>{
        if (res.data.status === "success") {
          alert("เพิ่มข้อมูลเรียบร้อย");
          pp.set(res.data.data);
          backWire${this.table.name}(pp);
        } else {
          alert("เกิดข้อผิดพลาดบางประการ")
        }
      }).catch(err=>{
        console.log(err);
        alert("มีข้อผิดพลาดบางประการ\\n"+err.response.data.message);
      })
    } else {
      api.post("/${this.table.name_raw}/"+val.id+"/update", val).then(res=>{
        if (res.data.status === "success") {
          alert("แก้ไขเรียบร้อย");
          pp.set(res.data.data);
          backWire${this.table.name}(pp);
        } else {
          alert("เกิดข้อผิดพลาดบางประการ")
        }
      }).catch(err=>{
        console.log(err);
        alert("มีข้อผิดพลาดบางประการ\\n"+err.response.data.message);
      })
    }
  }, {name: "serverUpdater"})

  pp.hook("beforeDelete", (val, options)=>{
    //console.log(val());
    if (options.commit) {
      api.post("/${this.table.name_raw}/"+val("id")()+"/delete", val).then(res=>{
        if (res.data.status === "success") {
          alert("ลบเรียบร้อย");
        } else {
          alert("เกิดข้อผิดพลาดบางประการ")
        }
      }).catch(err=>{
        console.log(err);
        alert("มีข้อผิดพลาดบางประการ\\n"+err.response.data.message);
      })
    }
  })
}

export function wakeup${this.table.name}(extraparams) {
  return async function(op) {
    try {
      let response = await api.get("/${this.table.name_raw}", { params: extraparams });
      let data = response.data;

      var p = createGlobalPointer("${this.table.name_raw}", data);
      p.childPerform(register${this.table.name}Hook);

      op.setRawPointer("default", p);
      op.setRenderer("default", defaultOpRenderer);
      op.setDefaultParams("default", { limit: config.PER_PAGE });

      p.childTemplate(${JSON.stringify(this.renderChildTemplate(this.table))})

      p.hook("afterMark",(key, value, oldVal) => {
        if (key == "simpleSearch") {
          extraparams.simple_search = value;
          refresh${this.table.name}(extraparams);
        }
      });

      op.isReady = true;

      afterReady${this.table.name}(op, p);
    } catch (err) {
      console.log(err);
    }
  };
}

export default function refresh${this.table.name}(extraparams) {
  if (!extraparams) extraparams = {};
  var op = createGlobalPointerOp("${this.table.name_raw}", wakeup${this.table.name}(extraparams), false);
}

`;
    return res;
  }

  //render relation that this table is parent (render child relations of this table)
  protected renderChildRelations(pointerName, relation: Relation[], recursive: Boolean = true) {
    return relation
      .map(
        re => !re.childTable.is_view ? 
        `
          ${pointerName}("${re.childName}").hook("beforePGet", async re => {
            //console.log(re.parent());
            if (re.isReady) return;

            var pstore = globalPointerOp("${re.childTable.name_raw}")
            await pstore.waitForReady();
            pstore = pstore.use("default").raw;

            try {
              let response = await api.get(
                "/${this.table.name_raw}/" + re.parent("id")() + "/${re.childName}"
              );
              let data = response.data;
              var ree = [];
              for(var one of data) {
                var targetid = one.id;

                try {
                  var targetop = globalPointerOp("${re.childTable.name_raw}"/*, wakeup${re.childTable.name}({})*/);
                  await targetop.waitForReady();
        
                  if (targetid != -1) {
                    var targetp = targetop.use("default").render({
                      find: ["id", targetid]
                    });
        
                    if (typeof targetp !== "undefined") {
                      //re.set(targetp);
                      ree.push(targetp);
                    } else {
                      pstore.push(data);
                      ree.push(pstore(pstore().length-1));
                    }
                  }
                } catch (err) {
                  console.log(err);
                }
              }

              re.set(ree);

              //console.log("updated", re());
            } catch (err) {
              console.log(err);
            }
          });

          ${pointerName}("${re.childName}").childTemplate(${JSON.stringify(this.renderChildTemplate(re.childTable))})

          ${pointerName}("${re.childName}").hook("afterPush", async (x, curr, parent, child)=>{
            var pstore = globalPointerOp("${re.childTable.name_raw}");
            await pstore.waitForReady();
            pstore = pstore.use("default").raw;
            pstore.push(x);
            let target = pstore(pstore().length-1);
            register${re.childTable.name}Hook(target);
            child.set(target);
          })
        ` : `
        ${pointerName}("${re.childName}").hook("beforePGet", async re => {
          if (re.isReady) return;

          try {
            let response = await api.get(
              "/${this.table.name_raw}/" + re.parent("id")() + "/${re.childName}"
            );
            let data = response.data;
            re.set(data);

            ${recursive ? `
              re.childPerform(ree => {
                ${this.renderChildRelations("ree", re.childTable.parentRelations)}
                ${this.renderParentRelations("ree", re.childTable.childRelations)}
        
              })
            `: ""}
          } catch (err) {
            console.log(err);
          }
        });
        `
      )
      .join("\n");
  }

  //render relation that this table is child (render parent relations of this table)
  protected renderParentRelations(pointerName, relation: Relation[], recursive: Boolean = true) {
    return relation
      .map(
        re => `
      const ${re.parentName}Hook = async () => {
        var re = ${pointerName}.pnext("${re.parentName}");
        var targetid = parseInt( ${pointerName}("${re.childColumn.name}")() );

        if (re.isReady && parseInt(re("id")()) == targetid) return;

        try {
          var targetop = globalPointerOp("${re.parentTable.name_raw}"/*, wakeup${re.parentTable.name}({})*/);
          await targetop.waitForReady();

          if (targetid != -1) {
            var targetp = targetop.use("default").render({
              find: ["id", targetid]
            });

            re.set(targetp);
          }
        } catch (err) {
          console.log(err);
        }
      }

      ${pointerName}("${re.parentName}").hook("beforePGetBP", ${re.parentName}Hook);

      //${pointerName}("${re.childColumn.name}").hook("afterSetBP", ${re.parentName}Hook);
    `
      )
      .join("\n");
  }

  //render relation that this table is parent (render child relations of this table)
  protected renderBackWireChildRelation(pointerName,relation: Relation[]) {
    return relation
      .map(
        re => `
        `
      )
      .join("\n");
  }

  //render relation that this table is child (render parent relations of this table)
  protected renderBackWireParentRelation(pointerName,relation) {
    function calculateChildRelationOfParent(re: Relation) {
      return _.find(re.parentTable.parentRelations,ree => ree.childTable.name_raw == re.childTable.name_raw);
    }

    return relation
      .map(
        re => `
          let backWire${re.parentName}Relation = async () => {
            var targetid = parseInt( ${pointerName}("${re.childColumn.name}")() );
            var parentpstore = globalPointer( "${re.parentTable.name_raw}" );
            var parentp = parentpstore.find({ id: targetid });

            if (typeof parentp !== "undefined") {
              var parentre = parentp( "${calculateChildRelationOfParent(re).childName}" )
              await parentre.waitForReady();
              var parentreval = parentre.find({ id: parseInt( ${pointerName}("id")() ) });
              
              if (typeof parentreval === "undefined") {
                parentre.push( ${pointerName} );
              }
              
            }
          }
          backWire${re.parentName}Relation()          
        `
      )
      .join("\n");
  }

  protected renderParts(): void {
    class AfterReadyPart extends Renderer {
      public file: File;
      public table: Table;

      constructor(table: Table) {
        super(
          "../../frontend/src/connector/" +
            table.name +
            "/afterReady" +
            table.name +
            ".js",
          false
        );
        this.table = table;
      }

      protected getRenderStr(): string {
        let res = `
export default function afterReady${this.table.name}(op, p) {

}
`;
        return res;
      }

      protected renderParts() {}
    }
    new AfterReadyPart(this.table).render();

  }
}

export default PointerOpConnectorRenderer;
