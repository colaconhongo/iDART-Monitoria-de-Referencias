import { Model, ModelFields } from 'pinia-orm';


export default class SecUserProfile extends Model {
    static entity = 'secUserProfiles'
     static primaryKey = ['userid', 'profile_id']

     static fields(): ModelFields {
      return {
        userid: this.attr(null),
        profile_id: this.attr(null)
      }
    }
  }
