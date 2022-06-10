import { useRepo } from 'pinia-orm';
import Episode from 'src/stores/models/episode/episode';
import api from '../apiService/apiService';
import moment from 'moment';
import District from 'src/stores/models/district/district';
import Clinic from 'src/stores/models/clinic/clinic';
import ClinicService from 'src/services/clinicService/clinicService';

const sync_temp_episode = useRepo(Episode);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('sync_temp_episode', params)
      .then((resp) => {
        sync_temp_episode.save(resp.data);
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('patient_episodes_vw?offset=' + offset + '&limit=100')
        .then((resp) => {
          sync_temp_episode.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          }
        });
    }
  },

  getById(nid) {
    return api()
      .get('patient_episodes_vw?idpatient=eq.' + nid)
      .then((resp) => {
        console.log('EPISODE: ' + resp.data);
        sync_temp_episode.save(resp.data as Episode);
        if (resp.data.length > 0) {
          //setTimeout(this.get(offset), 2);
        }
      });
  },
  getWithLimit(offset: number, limit: number) {
    if (offset >= 0) {
      return api()
        .get('sync_temp_episode?offset=' + offset + '&limit=' + limit + '')
        .then((resp) => {
          sync_temp_episode.save(resp.data);
          offset = offset + limit;
          if (resp.data.length > 0) {
            setTimeout(this.getWithLimit(offset, limit), 2);
          }
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('sync_temp_episode/' + id, params)
      .then((resp) => {
        sync_temp_episode.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('sync_temp_episode/' + id)
      .then(() => {
        sync_temp_episode.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return sync_temp_episode.getModel().$newInstance();
  },
  getAllFromStorage() {
    console.log(sync_temp_episode.all());
    return sync_temp_episode.all();
  },
  getAllStartEpisode() {
    return sync_temp_episode
      .query()
      .where((episode) => {
        return episode.stopreason === null && episode.stopdate === null;
      })
      .orderBy('startdate', 'desc')
      .get();
  },
  getAllEndingEpisode() {
    return sync_temp_episode
      .query()
      .where((episode) => {
        console.log(episode);
        return episode.startreason === null;
      })
      .orderBy('startdate', 'desc')
      .get();
  },

  getEpisodesByYear(year) {
    const yearBefore = year -1;
    const startDate =  moment('12-21-'+yearBefore).format('MM-DD-YYYY')
    console.log(startDate)
    const endDate = moment('12-20-'+year).format('MM-DD-YYYY')
    console.log(endDate)
      return api()
        .get('sync_temp_episode?stopdate=gt.'+startDate+'&stopdate=lt.'+endDate)
        .then((resp) => {
          sync_temp_episode.save(resp.data);
        });
  },

 

  getEpisodesByYearAndDistrictAndClinicAndPharmacyFromLocalStorage (year:number, district:District,pharmacy:Clinic) {
   const yearBefore = year -1;
    const startDate = new Date('12-21-'+yearBefore)
    console.log(startDate)
    const endDate = new Date('12-20-'+year)
    console.log(endDate)

     let clinics = [] ;

      clinics = ClinicService.getDDPharmByDistrictAndPharmFromLocalStorage(district,pharmacy);
      clinics = clinics.map(clinic => clinic.uuid);
    const episodes = sync_temp_episode
    .query()
    .where((sync_temp_episode) => {
      return new Date(sync_temp_episode.stopdate) >= startDate && new Date(sync_temp_episode.stopdate) <= endDate &&
       clinics.includes(sync_temp_episode.clinicuuid) })
      .orderBy('stopdate','desc')
.get();
    return episodes
  },
};
