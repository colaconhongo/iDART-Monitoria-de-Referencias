import { Model, ModelFields } from 'pinia-orm';
import Profile from './profile';
import SecUserProfile from './secUserProfile';

export default class SecUsers extends Model {
  static entity = 'secUsers';
  static primaryKey = 'userid';
  static fields() {
    return {
      userid: this.uid(),
      username: this.attr(''),
      nome: this.attr(''),
      apelido: this.attr(''),
      contacto: this.attr(''),
      email: this.attr(''),
      role: this.attr(''),
      pass: this.attr(''),
      profiles: this.belongsToMany(
        Profile,
        SecUserProfile,
        'userid',
        'profile_id'
      ),
    };
  }
}
