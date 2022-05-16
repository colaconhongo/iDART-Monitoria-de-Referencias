import { Model, ModelFields } from 'pinia-orm';
import Drug from '../drugs/drug';

export default class Form extends Model {
  static entity = 'forms';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      form: this.attr(''),
      actionlanguage1: this.uid(),
      actionlanguage2: this.attr(''),
      actionlanguage3: this.attr(''),
      formlanguage1: this.attr(''),
      formlanguage2: this.attr(''),
      formlanguage3: this.attr(''),
      dispinstructions1: this.attr(''),
      dispinstructions2: this.attr(''),

      // Relationship

      drugs: this.hasMany(Drug, 'form'),
    };
  }
}
