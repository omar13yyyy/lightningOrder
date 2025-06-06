import server from './apps/app-geteway/server'
import {seeder} from './modules/database/seeder/copyToDatabases'
import {createDatabases} from './modules/database/createDatabases'
import {seederGenerateCSV} from './modules/database/seeder/relationsSeederFinal'
import dotenv from 'dotenv';
import { encodeToQuadrants, generateNeighbors } from "./modules/geo/geohash";
import { storesRepository } from './apps/partners-stores-managers-dashboards-service/src/modules/stores/stores.repository';

dotenv.config()

     //await seederGenerateCSV()
    // await createDatabases()

 //await seeder()    

 server() 
/*  const damasLat = 33.51814950118199;
const damasLan =36.29422578371265
const location_code =encodeToQuadrants(damasLat,damasLan)
console.log("location_code   : ",location_code)
console.log("location_code   : ","1234143212141412123214321234143412323414")

const nearStore = await storesRepository.getNearStores("ar",damasLat,damasLan,location_code,10,0,16)
const nearStoreByCat =await storesRepository.getNearStoresbyCategory("ar",damasLat,damasLan,location_code,"4a1bd9c1-23ed-4859-95b5-632059f37c21",10,0,16)
const nearStoreBytag =await storesRepository.getNearStoresbyTag("ar",damasLat,damasLan,location_code,"1",10,0,16)
console.log("nearStoreBytag : ",nearStoreBytag)
 */
//console.log(encodeToQuadrants(34.35, 33.35, 20))