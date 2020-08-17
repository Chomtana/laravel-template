import File from './File'

abstract class Renderer {
  public file: File;
  private replace: boolean;

  constructor(filename: string, replace: boolean = true) {
    this.file = new File(filename)
    this.replace = replace;
    if(replace) this.file.empty()
  }

  protected abstract getRenderStr(): string;

  protected abstract renderParts(): void;

  public render() {
    if(this.replace || !this.file.exist()) this.file.write(this.getRenderStr())
    this.renderParts()
  }
}

export default Renderer