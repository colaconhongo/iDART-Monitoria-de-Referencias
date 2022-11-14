import { Model, ModelFields } from 'pinia-orm';

export default class Menu extends Model {
  static entity = 'menus';
  static primaryKey = 'id';
  static fields(): ModelFields {
    return {
      id:  this.attr(null),
      description: this.attr(''),
      code: this.attr('')
    };
  }
}
