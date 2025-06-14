import { createClient } from 'redis';
import { DriverData, StoreData } from './redisGeo.types';


export class DataStore {

  private client = createClient();

  // إضافة عنصر إلى مصفوفة معينة
  async addToTrendStoreList(item: StoreData) {

  await this.client.geoAdd('trend_stores', 
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
  async removeFromTrendStoreList(center, radiusInKM) {
  return  await this.client.geoSearch(
  'trend_stores', // المفتاح
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