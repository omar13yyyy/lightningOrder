BEGIN;


COPY drivers FROM 'E:\lightningOrder/modules/database/seeder/CSV/drivers.csv' DELIMITER ',' CSV HEADER;
COPY driver_points FROM 'E:\lightningOrder/modules/database/seeder/CSV/driver_points.csv' DELIMITER ',' CSV HEADER;
COPY driver_transactions FROM 'E:\lightningOrder/modules/database/seeder/CSV/driver_transactions.csv' DELIMITER ',' CSV HEADER;
COPY driver_wallets_previous_day FROM 'E:\lightningOrder/modules/database/seeder/CSV/driver_wallets_previous_day.csv' DELIMITER ',' CSV HEADER;
COPY trust_points_log FROM 'E:\lightningOrder/modules/database/seeder/CSV/trust_points_log.csv' DELIMITER ',' CSV HEADER;
COPY delivery_document_images FROM 'E:\lightningOrder/modules/database/seeder/CSV/delivery_document_images.csv' DELIMITER ',' CSV HEADER;





END;
