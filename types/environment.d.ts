declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PG_COSTOMERS_HOST: string;
        PG_COSTOMERS_PORT: string;
        PG_COSTOMERS_USER: string;
        PG_COSTOMERS_PASSWORD: string;
        PG_COSTOMERS_DATABASE: string;
        
        PG_DASHBOARD_HOST: string;
        PG_DASHBOARD_PORT: string;
        PG_DASHBOARD_USER: string;
        PG_DASHBOARD_PASSWORD: string;
        PG_DASHBOARD_DATABASE: string;
        
        PG_ORDERS_HOST: string;
        PG_ORDERS_PORT: string;
        PG_ORDERS_USER: string;
        PG_ORDERS_PASSWORD: string;
        PG_ORDERS_DATABASE: string;
        
        PG_DELIVERY_HOST: string;
        PG_DELIVERY_PORT: string;
        PG_DELIVERY_USER: string;
        PG_DELIVERY_PASSWORD: string;
        PG_DELIVERY_DATABASE: string; 
        
        ROOT_LOCATION : string;
        PORT: string;
        Host: string;
        TOKEN_SECRET: string;
        TOKEN_SECRET_ADMIN: string;
        WSPORT:string
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}