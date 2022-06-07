import { Model, ModelFields } from 'pinia-orm';

export default class ClinicInformation extends Model {
  static entity = 'ClinicInformations';

  static fields(): ModelFields {
    return {
      id: this.attr(null),
      registerdate: this.attr(''),
      uuid: this.uid(),
      stopdate: this.attr(null),
      weight: this.attr(''),
      height: this.attr(''),
      imc: this.attr(''),
      distort: this.attr(false),
      systole: this.attr(''),
      istreatmenttpi: this.attr(''),
      istreatmenttb: this.attr(''),
      iscough: this.attr(false),
      isfever: this.attr(false),
      islostweight: this.attr(false),
      issweeting: this.attr(false),
      hasfatigueortiredneslasttwoweeks: this.attr(false),
      hasparenttbtreatmement: this.attr(false),
      isreferedtoustb: this.attr(false),
      haspatientcamecorrectdate: this.attr(false),
      latedays: this.attr(false),
      patientforgotmedicine: this.attr(false),
      dayswithoutmedicine: this.attr(false),
      latemotives: this.attr(false),
      adversereactionmedicine: this.attr(false),
      adversereaction: this.attr(''),
      isreferedtousram: this.attr(false),
      ispregnant: this.attr(false),
      hashadmenstruationlasttwoweeks: this.attr(false),
      starttreatmentdate: this.attr(false),
      patientuuid: this.attr(''),
      syncstatus: this.attr(false),
    };
  }
}
