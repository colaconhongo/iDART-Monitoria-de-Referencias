import { Model, ModelFields } from 'pinia-orm';

export default class Prescription extends Model {
  static entity = 'Prescriptions';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      date: this.attr(''),
      patientid: this.attr(''),
      durationsentence: this.attr(''),
      regimenome: this.attr(''),
      linhanome: this.attr(''),
      prescricaoespecial: this.attr(''),
      drugname: this.attr(''),
      motivocriacaoespecial: this.attr(''),
      prescriptionid: this.attr(''),
      pickupdate: this.attr(''),
      qtyinhand: this.attr(''),
      duration: this.attr(''),
      dateexpectedstring: this.attr(''),
      syncstatus: this.attr(''),
    };
  }
}
