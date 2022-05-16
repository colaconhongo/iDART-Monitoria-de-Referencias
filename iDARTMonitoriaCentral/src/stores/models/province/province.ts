import { Model, ModelFields } from 'pinia-orm';
import District from '../district/district';

export default class Province extends Model {
  static entity = 'provinces';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      uuid: this.uid(),
      code: this.attr(''),
      name: this.attr(''),
      country: this.attr(''),

      // Relationship

      districts: this.hasMany(District, 'province'),
    };
  }
}
