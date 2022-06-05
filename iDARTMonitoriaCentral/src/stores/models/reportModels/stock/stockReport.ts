import { Model, ModelFields } from 'pinia-orm';

export default class StockReport extends Model {
  static entity = 'stockReports';

  static fields(): ModelFields {
    return {
      id: this.uid(),
      fnm: this.attr(''),
      drugname: this.attr(''),
      drugid: this.attr(''),
      clinicname: this.attr(''),
      clinicuuid: this.attr(''),
      estado: this.attr(''),
      active: this.attr(''),
      balance: this.attr(''),
    };
  }
}
