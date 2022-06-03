import { Model, ModelFields } from 'pinia-orm';

export default class StockReportDetail extends Model {
  static entity = 'stockReportDetails';

  static fields(): ModelFields {
    return {
      id: this.uid(),
      drug: this.attr(''),
      lote: this.attr(''),
      guia: this.attr(''),
      initbalance: this.attr(''),
      expirydate: this.attr(''),
      datereceived: this.attr(''),
      curbalance: this.attr(''),
      clinicid: this.attr(''),
    };
  }
}
