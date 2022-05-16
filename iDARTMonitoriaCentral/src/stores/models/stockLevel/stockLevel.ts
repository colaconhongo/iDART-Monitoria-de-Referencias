import { Model, ModelFields } from 'pinia-orm';
import Stock from '../stock/stock';

export default class StockLevel extends Model {
  static entity = 'stocklevels';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      batch: this.attr(''),
      fullcontainersremaining: this.attr(''),
      loosepillsremaining: this.attr(''),

      // Relationship
      stock: this.belongsTo(Stock, 'batch'),
    };
  }
}
