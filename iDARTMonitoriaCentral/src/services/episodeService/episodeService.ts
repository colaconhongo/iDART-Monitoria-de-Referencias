import { useRepo } from 'pinia-orm';
import Episode from 'src/stores/models/episode/episode';
import api from '../apiService/apiService';
import moment from 'moment';

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
            setTimeout(this.get(offset), 2);
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
    const startDate = moment('01-01-' + year).format('MM-DD-YYYY');
    console.log(startDate);
    const endDate = moment('12-31-' + year).format('MM-DD-YYYY');
    console.log(endDate);
    return api()
      .get(
        'sync_temp_episode?stopdate=gt.' + startDate + '&stopdate=lt.' + endDate
      )
      .then((resp) => {
        sync_temp_episode.save(resp.data);
      });
  },

  getEpisodesByYearFromLocalStorage(year) {
    // const startDate =  moment('01-01-'+year).format('DD-MM-YYYY')
    const startDate = new Date('01-01-' + year);
    console.log(startDate);
    //  const endDate = moment('12-31-'+year).format('DD-MM-YYYY')
    const endDate = new Date('12-31-' + year);
    const episodes = sync_temp_episode
      .query()
      .where((sync_temp_episode) => {
        return (
          sync_temp_episode.stopdate >= startDate &&
          sync_temp_episode.stopdate <= endDate
        );
      })
      .orderBy('stopdate', 'desc')
      .get();
    return episodes;
  },
};
