BEGIN;
COPY orders FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/orders.csv' DELIMITER ',' CSV HEADER;
COPY past_orders FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/past_orders.csv' DELIMITER ',' CSV HEADER;
COPY current_orders FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/current_orders.csv' DELIMITER ',' CSV HEADER;
COPY order_status FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/order_status.csv' DELIMITER ',' CSV HEADER;
COPY order_financial_logs FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/order_financial_logs.csv' DELIMITER ',' CSV HEADER;
COPY electronic_payment FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/electronic_payment.csv' DELIMITER ',' CSV HEADER;
COPY ratings FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/ratings.csv' DELIMITER ',' CSV HEADER;




END;