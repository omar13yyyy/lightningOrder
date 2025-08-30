BEGIN;



COPY store_categories FROM 'E:/lightningOrder/modules/database/seeder/CSV/store_categories.csv' DELIMITER ',' CSV HEADER;
COPY tags FROM 'E:/lightningOrder/modules/database/seeder/CSV/tags.csv' DELIMITER ',' CSV HEADER;
COPY address FROM 'E:/lightningOrder/modules/database/seeder/CSV/address.csv' DELIMITER ',' CSV HEADER;

COPY partners FROM 'E:/lightningOrder/modules/database/seeder/CSV/partners.csv' DELIMITER ',' CSV HEADER;

COPY stores FROM 'E:/lightningOrder/modules/database/seeder/CSV/stores.csv' DELIMITER ',' CSV HEADER;
COPY store_tags FROM 'E:/lightningOrder/modules/database/seeder/CSV/store_tags.csv' DELIMITER ',' CSV HEADER;
COPY working_hours FROM 'E:/lightningOrder/modules/database/seeder/CSV/working_hours.csv' DELIMITER ',' CSV HEADER;
COPY trends FROM 'E:/lightningOrder/modules/database/seeder/CSV/trends.csv' DELIMITER ',' CSV HEADER;
COPY store_ratings_previous_day FROM 'E:/lightningOrder/modules/database/seeder/CSV/store_ratings_previous_day.csv' DELIMITER ',' CSV HEADER;

COPY products FROM 'E:/lightningOrder/modules/database/seeder/CSV/products.csv' DELIMITER ',' CSV HEADER;
COPY products_sold FROM 'E:/lightningOrder/modules/database/seeder/CSV/products_sold.csv' DELIMITER ',' CSV HEADER;
COPY store_wallets FROM 'E:/lightningOrder/modules/database/seeder/CSV/store_wallets.csv' DELIMITER ',' CSV HEADER;
COPY store_transactions FROM 'E:/lightningOrder/modules/database/seeder/CSV/store_transactions.csv' DELIMITER ',' CSV HEADER;

COPY statistics_previous_day FROM 'E:/lightningOrder/modules/database/seeder/CSV/statistics_previous_day.csv' DELIMITER ',' CSV HEADER;
COPY daily_statistics FROM 'E:/lightningOrder/modules/database/seeder/CSV/daily_statistics.csv' DELIMITER ',' CSV HEADER;
COPY document_images FROM 'E:/lightningOrder/modules/database/seeder/CSV/document_images.csv' DELIMITER ',' CSV HEADER;
COPY coupons FROM 'E:/lightningOrder/modules/database/seeder/CSV/coupons.csv' DELIMITER ',' CSV HEADER;
COPY withdrawal_requests FROM 'E:/lightningOrder/modules/database/seeder/CSV/withdrawal_requests.csv' DELIMITER ',' CSV HEADER;
COPY withdrawal_document_images FROM 'E:/lightningOrder/modules/database/seeder/CSV/withdrawal_document_images.csv' DELIMITER ',' CSV HEADER;
COPY system_settings FROM 'E:/lightningOrder/modules/database/seeder/CSV/system_settings.csv' DELIMITER ',' CSV HEADER;








END;
