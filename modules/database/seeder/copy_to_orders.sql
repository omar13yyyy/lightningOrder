BEGIN;

COPY orders FROM 'E:\lightningOrder/modules/database/seeder/CSV/orders.csv' DELIMITER ',' CSV HEADER;
COPY past_orders FROM 'E:\lightningOrder/modules/database/seeder/CSV/past_orders.csv' DELIMITER ',' CSV HEADER;
COPY current_orders FROM 'E:\lightningOrder/modules/database/seeder/CSV/current_orders.csv' DELIMITER ',' CSV HEADER;
COPY order_status FROM 'E:\lightningOrder/modules/database/seeder/CSV/order_status.csv' DELIMITER ',' CSV HEADER;
COPY order_financial_logs FROM 'E:\lightningOrder/modules/database/seeder/CSV/order_financial_logs.csv' DELIMITER ',' CSV HEADER;
COPY electronic_payment FROM 'E:\lightningOrder/modules/database/seeder/CSV/electronic_payment.csv' DELIMITER ',' CSV HEADER;
COPY ratings FROM 'E:\lightningOrder/modules/database/seeder/CSV/ratings.csv' DELIMITER ',' CSV HEADER;


END;