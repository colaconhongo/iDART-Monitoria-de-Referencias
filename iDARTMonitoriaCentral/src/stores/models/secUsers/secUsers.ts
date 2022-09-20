import { Model, ModelFields } from 'pinia-orm';

export default class SecUsers extends Model {
  static entity = 'secUsers';
  static primaryKey = 'userid';
  static fields(): ModelFields {
    return {
      userid: this.uid(),
      username: this.attr(''),
      nome: this.attr(''),
      apelido: this.attr(''),
      contacto: this.attr(''),
      email: this.attr(''),
      role: this.attr(''),
      pass: this.attr(''),
    };
  }
}
