import { Model, ModelFields } from 'pinia-orm';
import ClinicSector from '../clinicSector/clinicSector';
import Episode from '../episode/episode';
import StockCenter from '../stockCenter/stockCenter';

export default class Clinic extends Model {
  static entity = 'clinics';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      uuid: this.uid(),
      clinicdetails_id: this.attr(25),
      subdistrict: this.attr(''),
      code: this.attr(''),
      clinicname: this.attr(''),
      facilitytype: this.attr(''),
      province: this.attr(''),
      district: this.attr(''),
      telephone: this.attr(''),
      notes: this.attr(''),
      mainclinic: this.attr(false),
      // Relationship

      // clinicsectors: this.hasMany(ClinicSector, 'clinic'),
      // episodes: this.hasMany(Episode, 'clinicuuid'),
      // stockCenter: this.hasMany(StockCenter, 'clinicuuid'),
    };
  }
}
