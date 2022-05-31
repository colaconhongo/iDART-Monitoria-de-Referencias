import { Model, ModelFields } from 'pinia-orm';
import Drug from '../drugs/drug';
import StockCenter from '../stockCenter/stockCenter';
import StockLevel from '../stockLevel/stockLevel';

export default class Stock extends Model {
  static entity = 'stocks';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      drug: this.attr(''),
      datereceived: this.attr(''),
      batchnumber: this.attr(''),
      expirydate: this.attr(''),
      modified: this.attr(''),
      shelfnumber: this.attr(''),
      unitsreceived: this.attr(''),
      manufacturer: this.attr(''),
      hasunitsremaining: this.attr(''),
      unitprice: this.attr(''),
      numeroguia: this.attr(''),
      stockcenter: this.attr(''),

      // Relationship

      //patient: this.belongsTo(Patient, 'patientuuid'),
      mainStock: this.belongsTo(StockCenter, 'stockcenter'),
      mainDrug: this.belongsTo(Drug, 'drug'),
      stocklevels: this.hasMany(StockLevel, 'batch'),
    };
  }

  getBalance() {
    const balance = 0;
    return balance;
  }
}
