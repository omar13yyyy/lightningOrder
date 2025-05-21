BEGIN;
COPY customers FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/customers.csv' DELIMITER ',' CSV HEADER;
COPY customer_wallets_previous_day FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/customer_wallets_previous_day.csv' DELIMITER ',' CSV HEADER;
COPY customer_transactions FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/customer_transactions.csv' DELIMITER ',' CSV HEADER;

END;