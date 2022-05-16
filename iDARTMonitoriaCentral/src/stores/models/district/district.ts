import { Model, ModelFields } from 'pinia-orm';
import Province from '../province/province';

export default class District extends Model {
  static entity = 'districts';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      uuid: this.uid(),
      code: this.attr(''),
      name: this.attr(''),
      province: this.attr(''),

      // Relationship

      mainProvince: this.belongsTo(Province, 'province'),
    };
  }
}
