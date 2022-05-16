import { Model, ModelFields } from 'pinia-orm';
import Form from '../form/form';

export default class Drug extends Model {
  static entity = 'drugs';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      form: this.attr(''),
      dispensinginstructions1: this.uid(),
      dispensinginstructions2: this.attr(''),
      modified: this.attr(''),
      name: this.attr(''),
      packsize: this.attr(''),
      sidetreatment: this.attr(''),
      defaultamnt: this.attr(''),
      defaulttimes: this.attr(''),
      stockcode: this.attr(''),
      pediatric: this.attr(''),
      active: this.attr(''),
      tipodoenca: this.attr(''),
      atccode_id: this.attr(''),

      // Relationship

      mainForm: this.belongsTo(Form, 'form'),
    };
  }
}
