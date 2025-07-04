BEGIN;

/*
COPY products FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/products.csv' DELIMITER ',' CSV HEADER;
COPY products_sold FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/products_sold.csv' DELIMITER ',' CSV HEADER;
COPY store_wallets FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/store_wallets.csv' DELIMITER ',' CSV HEADER;
COPY store_transactions FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/store_transactions.csv' DELIMITER ',' CSV HEADER;

COPY statistics_previous_day FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/statistics_previous_day.csv' DELIMITER ',' CSV HEADER;
COPY daily_statistics FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/daily_statistics.csv' DELIMITER ',' CSV HEADER;
COPY document_images FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/document_images.csv' DELIMITER ',' CSV HEADER;
COPY coupons FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/coupons.csv' DELIMITER ',' CSV HEADER;
COPY withdrawal_requests FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/withdrawal_requests.csv' DELIMITER ',' CSV HEADER;
COPY withdrawal_document_images FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/withdrawal_document_images.csv' DELIMITER ',' CSV HEADER;
COPY system_settings FROM '/home/omar/project3/coding/backend/modules/database/seeder/CSV/system_settings.csv' DELIMITER ',' CSV HEADER;
*/



COPY products FROM 'E:\lightningOrder/modules/database/seeder/CSV/products.csv' DELIMITER ',' CSV HEADER;
COPY products_sold FROM 'E:\lightningOrder/modules/database/seeder/CSV/products_sold.csv' DELIMITER ',' CSV HEADER;
COPY store_wallets FROM 'E:\lightningOrder/modules/database/seeder/CSV/store_wallets.csv' DELIMITER ',' CSV HEADER;
COPY store_transactions FROM 'E:\lightningOrder/modules/database/seeder/CSV/store_transactions.csv' DELIMITER ',' CSV HEADER;

COPY statistics_previous_day FROM 'E:\lightningOrder/modules/database/seeder/CSV/statistics_previous_day.csv' DELIMITER ',' CSV HEADER;
COPY daily_statistics FROM 'E:\lightningOrder/modules/database/seeder/CSV/daily_statistics.csv' DELIMITER ',' CSV HEADER;
COPY document_images FROM 'E:\lightningOrder/modules/database/seeder/CSV/document_images.csv' DELIMITER ',' CSV HEADER;
COPY coupons FROM 'E:\lightningOrder/modules/database/seeder/CSV/coupons.csv' DELIMITER ',' CSV HEADER;
COPY withdrawal_requests FROM 'E:\lightningOrder/modules/database/seeder/CSV/withdrawal_requests.csv' DELIMITER ',' CSV HEADER;
COPY withdrawal_document_images FROM 'E:\lightningOrder/modules/database/seeder/CSV/withdrawal_document_images.csv' DELIMITER ',' CSV HEADER;
COPY system_settings FROM 'E:\lightningOrder/modules/database/seeder/CSV/system_settings.csv' DELIMITER ',' CSV HEADER;







END;
