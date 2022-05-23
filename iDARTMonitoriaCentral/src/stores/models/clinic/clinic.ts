import { Model, ModelFields } from 'pinia-orm';
import ClinicSector from '../clinicSector/clinicSector';
import Episode from '../episode/episode';
import StockCenter from '../stockCenter/stockCenter';

export default class Clinic extends Model {
  static entity = 'clinics';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      code: this.attr(''),
      uuid: this.uid(),
      clinicname: this.attr(''),
      facilitytype: this.attr(''),
      notes: this.attr(''),
      telephone: this.attr(''),
      mainclinic: this.attr(''),
      province: this.attr(''),
      district: this.attr(''),
      subdistrict: this.attr(''),
      clinicdetails_id: this.attr(''),
      // Relationship

      clinicsectors: this.hasMany(ClinicSector, 'clinic'),
      episodes: this.hasMany(Episode, 'clinicuuid'),
      stockCenter: this.hasMany(StockCenter, 'clinicuuid'),
    };
  }
}
