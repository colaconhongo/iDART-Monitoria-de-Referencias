import { Model, ModelFields } from 'pinia-orm';
import Episode from '../episode/episode';

export default class Patient extends Model {
  static entity = 'patients';

  static primaryKey = ['id', 'mainclinicname'];

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      accountstatus: this.attr(''),
      cellphone: this.attr(''),
      dateofbirth: this.attr(''),
      clinic: this.attr(''),
      clinicname: this.attr(''),
      mainclinic: this.attr(''),
      mainclinicname: this.attr(''),
      firstnames: this.attr(''),
      homephone: this.attr(''),
      lastname: this.attr(''),
      modified: this.attr(''),
      patientid: this.attr(''),
      province: this.attr(''),
      sex: this.attr(''),
      workphone: this.attr(''),
      address1: this.attr(''),
      address2: this.attr(''),
      address3: this.attr(''),
      nextofkinname: this.attr(''),
      nextofkinphone: this.attr(''),
      race: this.attr(''),
      uuidopenmrs: this.attr(''),
      datainiciotarv: this.attr(''),
      syncstatus: this.attr(''),
      syncuuid: this.attr(''),
      clinicuuid: this.attr(''),
      mainclinicuuid: this.attr(''),
      prescriptiondate: this.attr(''),
      duration: this.attr(''),
      prescriptionenddate: this.attr(''),
      regimenome: this.attr(''),
      linhanome: this.attr(''),
      dispensatrimestral: this.attr(''),
      dispensasemestral: this.attr(''),
      prescriptionid: this.attr(''),
      prescricaoespecial: this.attr(''),
      motivocriacaoespecial: this.attr(''),
      jsonprescribeddrugs: this.attr(''),
      exclusaopaciente: this.attr(''),
      estadopaciente: this.attr(''),

      // Relationship

      episodes: this.hasMany(Episode, 'patientuuid'),
    };
  }
}
