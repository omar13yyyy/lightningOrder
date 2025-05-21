BEGIN;
COPY customers FROM 'e:\backend\modules/database/seeder/CSV/customers.csv' DELIMITER ',' CSV HEADER;
COPY customer_wallets_previous_day FROM 'e:\backend\modules/database/seeder/CSV/customer_wallets_previous_day.csv' DELIMITER ',' CSV HEADER;
COPY customer_transactions FROM 'e:\backend\modules/database/seeder/CSV/customer_transactions.csv' DELIMITER ',' CSV HEADER;

END;