import { Model, ModelFields } from 'pinia-orm';

export default class Regimen extends Model {
  static entity = 'regimens';

  static primaryKey = 'regimeid';

  static fields(): ModelFields {
    return {
      regimeid: this.attr(null),
      codigoregime: this.attr(''),
      regimeesquema: this.attr(''),
      active: this.uid(),
      regimenomeespecificado: this.attr(''),
      regimeesquemaidart: this.attr(''),

      // Relationship

      //patient: this.belongsTo(Patient, 'patientuuid'),
    };
  }
}
