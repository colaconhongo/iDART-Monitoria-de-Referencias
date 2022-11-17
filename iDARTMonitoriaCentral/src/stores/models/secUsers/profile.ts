import { Model, ModelFields } from 'pinia-orm';
import Menu from './menu';
import ProfileMenu from './profileMenu';

export default class Profile extends Model {
  static entity = 'profiles';
  static primaryKey = 'id';
  static fields(): ModelFields {
    return {
      id: this.uid(),
      description: this.attr(''),
      // code: this.attr(''),
      active: this.boolean(true),
      menus: this.belongsToMany(Menu, ProfileMenu, 'profile_id', 'menu_id'),
    };
  }
}
