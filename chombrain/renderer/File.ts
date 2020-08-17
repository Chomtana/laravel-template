import * as path from 'path';
import * as fs from 'fs';

class File {
  public path: string;
  public filename: string;
  public dirname: string;

  constructor(p: string) {
    this.path = path.join(__dirname,p);
    this.filename = path.basename(this.path)
    this.dirname = path.dirname(this.path)
    
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.dirname,{
        recursive: true
      })
    }
  }

  public exist(): boolean {
    return fs.existsSync(this.path)
  }

  public read(): string {
    if (!fs.existsSync(this.path)) return "";
    return fs.readFileSync(this.path, "utf8");
  }

  public write(data: string) {
    fs.writeFileSync(this.path,data)
  }

  public append(data: string) {
    fs.appendFileSync(this.path,data)
  }

  public empty() {
    this.write("");
  }

}

export default File;