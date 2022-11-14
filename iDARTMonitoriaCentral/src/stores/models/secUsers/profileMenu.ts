import { Model, ModelFields } from 'pinia-orm';


export default class RoleMenu extends Model {
    static entity = 'profileMenus'
     static primaryKey = ['profile_id', 'menu_id']

     static fields(): ModelFields {
      return {
        profile_id: this.attr(null),
        menu_id: this.attr(null)
      }
    }
  }
