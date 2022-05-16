import { Model, ModelFields } from 'pinia-orm';

export default class Dispense extends Model {
  static entity = 'dispenses';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      clinicalstage: this.attr(''),
      current: this.attr(''),
      date: this.attr(''),
      doctor: this.attr(''),
      duration: this.attr(''),
      modified: this.attr(''),
      patient: this.attr(''),
      weight: this.attr(''),
      reasonforupdate: this.attr(''),
      notes: this.attr(''),
      enddate: this.attr(''),
      drugtypes: this.attr(''),
      regimenome: this.attr(''),
      datainicionoutroservico: this.attr(''),
      motivomudanca: this.attr(''),
      linhanome: this.attr(''),
      ppe: this.attr(''),
      ptv: this.attr(''),
      tb: this.attr(''),
      tpi: this.attr(''),
      tpc: this.attr(''),
      dispensatrimestral: this.attr(''),
      tipodt: this.attr(''),
      gaac: this.attr(''),
      af: this.attr(''),
      ca: this.attr(''),
      ccr: this.attr(''),
      saaj: this.attr(''),
      fr: this.attr(''),
      amountpertime: this.attr(''),
      dispensedate: this.attr(''),
      drugname: this.attr(''),
      expirydate: this.attr(''),
      patientid: this.attr(''),
      patientfirstname: this.attr(''),
      patientlastname: this.attr(''),
      dateexpectedstring: this.attr(''),
      pickupdate: this.attr(''),
      timesperday: this.attr(''),
      weekssupply: this.attr(''),
      qtyinhand: this.attr(''),
      summaryqtyinhand: this.attr(''),
      qtyinlastbatch: this.attr(''),
      syncstatus: this.attr(''),
      syncuuid: this.attr(''),
      uuidopenmrs: this.attr(''),
      mainclinic: this.attr(''),
      mainclinicname: this.attr(''),
      mainclinicuuid: this.attr(''),
      prescriptionid: this.attr(''),
      tipods: this.attr(''),
      dispensasemestral: this.attr(''),
      durationsentence: this.attr(''),
      dc: this.attr(''),
      prep: this.attr(''),
      ce: this.attr(''),
      cpn: this.attr(''),
      prescricaoespecial: this.attr(''),
      motivocriacaoespecial: this.attr(''),
    };
  }
}
