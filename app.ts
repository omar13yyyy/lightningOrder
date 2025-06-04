import server from './apps/app-geteway/server'
import {seeder} from './modules/database/seeder/copyToDatabases'
import {createDatabases} from './modules/database/createDatabases'
import {seederGenerateCSV} from './modules/database/seeder/relationsSeederFinal'
import dotenv from 'dotenv';
import { encodeToQuadrants, generateNeighbors } from "./modules/geo/geohash";

dotenv.config()

await seederGenerateCSV()
 
await createDatabases()
 await seeder()

  server() 





//console.log(encodeToQuadrants(34.35, 33.35, 20))