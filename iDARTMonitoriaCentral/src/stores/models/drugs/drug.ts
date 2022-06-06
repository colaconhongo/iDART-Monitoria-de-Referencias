import { Model, ModelFields } from 'pinia-orm';
import Form from '../form/form';
import Stock from '../stock/stock';

export default class Drug extends Model {
  static entity = 'drugs';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      atccode_id: this.attr(''),
      name: this.attr(''),
      form: this.attr(''),
      packsize: this.attr(''),
      defaultamnt: this.attr(''),
      defaulttimes: this.attr(''),
      tipodoenca: this.attr(''),
      dispensinginstructions1: this.uid(),
      dispensinginstructions2: this.attr(''),
      active: this.boolean(true),
      modified: this.attr(''),
      sidetreatment: this.attr(''),
      stockcode: this.attr(''),
      pediatric: this.attr(''),

      // Relationship

      //  mainForm: this.belongsTo(Form, 'form'),
      //  stocks: this.hasMany(Stock, 'drug'),
    };
  }
}
