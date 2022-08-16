import { Model, ModelFields } from 'pinia-orm';

export default class SecUsers extends Model {
  static entity = 'secUsers';
  static primaryKey = 'username';
  static fields(): ModelFields {
    return {
      username: this.attr(''),
      role: this.attr(''),
      pass: this.attr(''),
    };
  }
}
