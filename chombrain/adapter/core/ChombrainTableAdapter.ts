import ChombrainQueryAdapter from './ChombrainQueryAdapter';

export default abstract class ChombrainTableAdapter {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public async get() {
    return await this.query().all();
  }

  public query(): ChombrainQueryAdapter {
    return new ChombrainQueryAdapter().table(this.name);
  }

  /**column definition will be defined automatically by chombrain code generator*/
  public col: Array<any> = [];
}