import { Model, ModelFields } from 'pinia-orm';

export default class ReferralClinic extends Model {
  static entity = 'referralClinics';
  static fields(): ModelFields {
    return {
      id: this.uid(),
      district: this.attr(''),
      mainclinicuuid: this.attr(''),
      mainclinicname: this.attr(''),
    };
  }
}
