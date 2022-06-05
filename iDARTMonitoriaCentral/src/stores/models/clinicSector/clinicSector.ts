import { Model, ModelFields } from 'pinia-orm';
import Clinic from '../clinic/clinic';
import ClinicSectorType from '../clinicSectorType/clinicSectorType';

export default class ClinicSector extends Model {
  static entity = 'clinicsectors';

  static primaryKey = 'id';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      code: this.attr(''),
      uuid: this.uid(),
      sectorname: this.attr(''),
      clinic: this.attr(''),
      clinicsectortype: this.attr(''),
      telephone: this.attr(''),
      clinicuuid: this.attr(''),

      // Relationship

      clinicsectortypee: this.belongsTo(ClinicSectorType, 'clinicsectortype'),
      //  clinic: this.belongsTo(Clinic, 'clinic'),
    };
  }
}
