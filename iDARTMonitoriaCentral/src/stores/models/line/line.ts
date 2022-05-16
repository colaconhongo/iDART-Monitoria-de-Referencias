import { Model, ModelFields } from 'pinia-orm';

export default class Line extends Model {
  static entity = 'lines';

  static primaryKey = 'linhaid';

  static fields(): ModelFields {
    return {
      linhaid: this.attr(null),
      linhanome: this.attr(''),
      active: this.attr(''),

      // Relationship

      //  clinicSectors: this.hasMany(ClinicSector, 'clinicsectortype'),
    };
  }
}
