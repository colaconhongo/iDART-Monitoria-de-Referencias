import { Model, ModelFields } from 'pinia-orm';
import ClinicSector from '../clinicSector/clinicSector';

export default class ClinicSectorType extends Model {
  static entity = 'clinicsectortypes';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),

      // Relationship

      clinicSectors: this.hasMany(ClinicSector, 'clinicsectortype'),
    };
  }
}
