import server from './apps/app-geteway/server'
import {seeder} from './modules/database/seeder/copyToDatabases'
import {createDatabases} from './modules/database/createDatabases'
import {seederGenerateCSV} from './modules/database/seeder/relationsSeederFinal'
import dotenv from 'dotenv';

dotenv.config()


// await seederGenerateCSV()

// await createDatabases()
// await seeder()
 
  server()




