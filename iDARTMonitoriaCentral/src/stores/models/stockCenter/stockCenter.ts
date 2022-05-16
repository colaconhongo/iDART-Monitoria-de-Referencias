import { Model, ModelFields } from 'pinia-orm';
import Clinic from '../clinic/clinic';
import Stock from '../stock/stock';

export default class StockCenter extends Model {
  static entity = 'stockcenters';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      stockcentername: this.attr(''),
      preferred: this.attr(''),
      clinicuuid: this.attr(''),

      // Relationship
      mainClinic: this.belongsTo(Clinic, 'clinicuuid'),
      stock: this.hasMany(Stock, 'stockcenter'),
    };
  }
}
