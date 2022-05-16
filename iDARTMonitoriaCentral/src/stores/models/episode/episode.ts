import { Model, ModelFields } from 'pinia-orm';
import Clinic from '../clinic/clinic';

export default class Episode extends Model {
  static entity = 'episodes';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      startdate: this.attr(''),
      stopdate: this.uid(),
      startreason: this.attr(''),
      stopreason: this.attr(''),
      startnotes: this.attr(''),
      stopnotes: this.attr(''),
      patientuuid: this.attr(''),
      syncstatus: this.attr(''),
      usuuid: this.attr(''),
      clinicuuid: this.attr(''),

      // Relationship

      //patient: this.belongsTo(Patient, 'patientuuid'),
      clinic: this.belongsTo(Clinic, 'clinicuuid'),
    };
  }
}
