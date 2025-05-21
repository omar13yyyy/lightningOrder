import { createClient } from 'redis';
import { DriverData, StoreData } from './redisGeo.types';


export class DataStore {

  private client = createClient();

  // إضافة عنصر إلى مصفوفة معينة
  async addToTrandStoreList(item: StoreData) {

  await this.client.geoAdd('trand_stores', 
    [item]
  );
  }
  async addToStoreList(item: StoreData) {
      await this.client.geoAdd('stores', 
    [item]
  );
  }
  async addTodriverList(item:DriverData) {
      await this.client.geoAdd('drivers', 
    [item]
  );
  }

  async removeFromStoreList(center, radiusInKM) {
  return  await this.client.geoSearch(
  'stores', // المفتاح
  { // from
    longitude: center.longitude,
    latitude: center.latitude
  },
  { // by
    radius: radiusInKM,
    unit: 'km'
  },
  { // options
   // WITHDIST: true,
    COUNT: 20,
    SORT: 'ASC'
  }
);
  }
  async removeFromTrandStoreList(center, radiusInKM) {
  return  await this.client.geoSearch(
  'trand_stores', // المفتاح
  { // from
    longitude: center.longitude,
    latitude: center.latitude
  },
  { // by
    radius: radiusInKM,
    unit: 'km'
  },
  { // options
   // WITHDIST: true,
    COUNT: radiusInKM,
    SORT: 'ASC'
  }
);
  }
  removeDriverList() {
    this.client.del('drivers');
  }
  async getNearestDriver(center, radiusInKM) {
  return  await this.client.geoSearch(
  'drivers', // المفتاح
  { // from
    longitude: center.longitude,
    latitude: center.latitude
  },
  { // by
    radius: radiusInKM,
    unit: 'km'
  },
  { // options
   // WITHDIST: true,
    COUNT: 20,
    SORT: 'ASC'
  }
);

}

}