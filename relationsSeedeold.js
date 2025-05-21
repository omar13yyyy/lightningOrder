import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

import { faker as fakerEN } from "@faker-js/faker";
import { fakerAR as faker } from "@faker-js/faker";
import { bcryptjs} from "bcryptjs";


/*
const fs = require("fs");
const { faker } = require("faker");
const createObjectCsvWriter = require("csv-writer").createObjectCsvWriter;
*/
const ADDRESSESCOUNT =100 ;

const TRUSTPOINTSCOUNT =100; 
const PARTNERSCOUNT = 100 ;
const STORECATEGORIESCOUNT =100 ; 
const TAGSCOUNT =100 ;
const STORETAGSCOUNT =100
const STORECOUNT = 100;
const TRANDSCOUNT = 100;
const WORKINGHOURSCOUNT =100
const PRODUCTSCOUNT =100;
const COUPONSCOUNT =100;
const PASTORDERSCOUNT =100
const RAINTINGSCOUNT =100
const STORETRANSACTIONSCOUNT =100
const STORERATINGSCOUNT =100 ;
const STOREWALLETSCOUNT = STORECOUNT//1;


const NUM_SOLD_PRODUCTS = 1000;
const CUSTOMERTRANSACTIONS =100

const ORDERFINANCIALLOGSCOUNT =100;
const ELECTRONICPAYMENTCOUNT =100 ;
const STATISTICSPREVIOUSDAYCOUNT =1
const driverTRANSACTIONSCOUNT =100 ;
const NUM_COUPONS = 100;
const CURRENTORDERSCOUNT = 300;
const SYSTEMSETTINGCOUNT =100

const CUSTOMERCOUNT = 100 //saveToCSV
const CUSTOMERWALLETSCOUNT = 100//saveToCSV
const DRIVERCOUNT = 100//saveToCSV
//DriverWalletsPreviousDay =DRIVERCOOUNT saveToCSV ADD JUST ONE
//DriverPoints saveToCSV
//DailyStatistics IS saveToCSV
//OrderStatus IS saveToCSV
// documentImages IS saveToCSV

let customer_id =1 ;
let internal_id =1 ;
let partner_id =1 ;
let store_internal_id =1 ;
let driver_id =1 ;
let tag_id =1
const enumOrderStatuses = [
  "accepted",
  "rejected",
  "with_driver",
  "delivered",
  "NULL",
];

const enumUserTypes = [
  "customer",
  "store",
  "partner",
  "driver",
  "store_Payments",
  "partner_Payments",
  "driver_Payments",
  "NULL",
];

const enumDaysOfWeek = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "NULL",
];

const enumOnExpense = ["partner", "our_company", "both", "NULL"];

const enumCouponTypes = ["personal", "public", "NULL"];

const enumDriverTransactionTypes = [
  "order_cost",
  "driver_profits_received_to_driver",
  "driver_order_cost_received_from_driver",
  "NULL",
];

const enumVehicleTypes = [
  "car",
  "motorcycle",
  "bicycle",
  "electric_bike",
  "NULL",
];

const enumStoreTransactionTypes = ["deposit", "withdraw", "discount", "NULL"];

const enumTrustPointsOperationTypes = ["auto", "manual", "NULL"];

const enumPartnerStatuses = ["available", "blocked", "NULL"];

const enumUserTransactionTypes = ["input", "output", "NULL"];

const enumStoreStatuses = ["open", "close", "busy", "NULL"];

const enumOrdersTypes = [
  "take_away",
  "delivery",
  "take_away_and_delivery",
  "NULL",
];
const enumPaymentMethodTypes = [
  "cach",
  "online",
  "wallet",
  "wallet_and_cach",
  "wallet_and_online",
  "NULL",
];
const modifiersARtypes = [
  "اختياري",
  "متعدد"
];
const modifiersENtypes = [
"Optional", "Multiple"
];
function randomEnum(enumArray) {
  return enumArray[Math.floor(Math.random() * enumArray.length)];
}

function saveToCSV(filename, rows, headers) {
  if (!rows || rows.length === 0) {
    console.warn(`⚠️ لا توجد بيانات لكتابة الملف: ${filename}.csv`);
    return;
  }

  // توليد العناوين تلقائيًا إذا لم تُمرر
  const finalHeaders = headers || Object.keys(rows[0]);

  const content = [
    finalHeaders.join(","), // السطر الأول: العناوين
    ...rows.map((row) =>
      finalHeaders
        .map((h) => `"${(row[h] ?? "").toString().replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  fs.writeFileSync(`seeder/CSV/${filename}.csv`, content, "utf8");
  console.log(`✅ تم حفظ الملف: ${filename}.csv`);
}
function generateDataForTable(tableName, columnNames, generateRowData,DataCount) {
  const csvWriter = createObjectCsvWriter({
    path: `seeder/CSV/${tableName}.csv`,
    header: columnNames.map((name) => ({ id: name, title: name })),
  });

  const data = [];
  for (let i = 0; i < DataCount; i++) {
    data.push(generateRowData());
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log(`تم إنشاء ملف ${tableName}.csv`));

  return data;
}
function generateAddresses(ADDRESSESCOUNT) {
  return Array.from({ length: count }, () => {
    const country = faker.location.country();
    const under = faker.location.state();
    const under2 = faker.location.city();
    const under3 = faker.location.street();
    const full = `${country}, ${under}, ${under2}, ${under3} : ${++internal_id}`;
    return {
      country,
      under_country: under,
      under2_country: under2,
      under3_country: under3,
      full_address: full,
      create_at: fakerEN.date.recent().toISOString(),
    };
  });
}

const addresses = generateAddresses();

//---Array---
const addressesArray = addresses;

saveToCSV("address", addresses, Object.keys(addresses[0]));
//----------------------------------------------
async function generateCustomers(CUSTOMERCOUNT) {
  const rows = [];
  for (let i = 0; i < n; i++) {
    rows.push({
      customer_id: ++customer_id,
      full_name: faker.person.fullName(),
      phone_number: faker.phone.number("+963#########"),
      email: faker.internet.email(),



      encrypted_password: await bcryptjs.hash("1234567890", 10),
      is_confirmed: faker.datatype.boolean(),
      birth_date: fakerEN.date
        .birthdate({ min: 18, max: 60, mode: "age" })
        .toISOString(),
      address: faker.location.streetAddress(),
    });
  }
  return rows;
}

const customers =  await generateCustomers();

//---Array---
const customersArray = customers;

saveToCSV("customers", customers, Object.keys(customers[0]));
//----------------------------------------------

function generateCustomerWallets(CUSTOMERWALLETSCOUNT) {
  const rows = [];
  for (let i = 0; i < n; i++) {
    rows.push({
      customer_wallet_id: i + 1,
      balance_previous_day: faker.finance.amount(0, 500, 2),
      last_updated_at: fakerEN.date.recent().toISOString(),
    });
  }
  return rows;
}

const customerWallets = generateCustomerWallets();

//---Array---
const customerWalletsArray = customerWallets;

saveToCSV("customer_wallets_previous_day", customerWallets, Object.keys(customerWallets[0]));

//----------------------------------------------

function generateDrivers(DRIVERCOUNT) {
  return Array.from({ length: count }, async (_, i) => ({
    driver_id: ++driver_id,
    full_name: faker.person.fullName(),
    phone_number: faker.phone.number("+96279#######"),
    email: faker.internet.email(),
    is_activated: faker.datatype.boolean(),
    vehicle_type: faker.helpers.arrayElement(enumVehicleTypes),
    //TODO : get real address
    address: faker.location.streetAddress(),
    bank_name: faker.company.name(),
    iban: faker.finance.iban(),
    user_name: fakerEN.helpers.unique(fakerEN.internet.username, [], { maxRetries: 10000 }),
    encrypted_password: await bcryptjs.hash("1234567890", 10),
  }));
}
const drivers = await generateDrivers();
//---Array---
const driversArray = drivers;

saveToCSV("drivers", drivers, Object.keys(drivers[0]));

//----------------------------------------------

// توليد بيانات لجدول trust_points_log
//---Array---
const trustPointsArray = generateDataForTable(
  "trust_points_log",
  ["log_id", "driver_id", "operation_type", "points", "reason", "log_date"],
  () => ({
    log_id: faker.datatype,
    //TODO real driver id
    driver_id: faker.number.int(),
    operation_type: randomEnum(enumTrustPointsOperationTypes),
    points: faker.number.int({ min: 1, max: 100 }),
    reason: faker.lorem.sentence(),
    log_date: fakerEN.date.recent(),
  })
,TRUSTPOINTSCOUNT);
saveToCSV(trustPointsArray,)
//----------------------------------------------
//---Array---
const partnersArray = generateDataForTable(
  "partners",
  [
    "partner_id",
    "partner_name",
    "phone_number",
    "company_name_ar",
    "company_name_en",
    "user_name",
    "encrypted_password",
    "bank_name",
    "iban",
    "email",
    "status",
    "wallet_balance",
    "last_updated_at",
  ],
  async () => ({
    partner_id: ++partner_id,
    partner_name: faker.person.fullName(),
    phone_number: faker.phone.number(),
    company_name_ar: faker.company.name(),
    company_name_en: fakerEN.company.name(),
    user_name: fakerEN.helpers.unique(fakerEN.internet.username, [], { maxRetries: 10000 }),
    encrypted_password: await bcryptjs.hash("1234567890", 10),
    bank_name: faker.company.name(),
    iban: faker.finance.iban(),
    email: faker.internet.email(),
    status: randomEnum(enumPartnerStatuses),
    wallet_balance: faker.number.float({ min: 0, max: 10000 }),
    last_updated_at: fakerEN.date.recent(),
  })
 , PARTNERSCOUNT);

//----------------------------------------------
//---Array---
const storeCategoriesArray = generateDataForTable(
  "store_categories",
  [
    "category_id",
    "internal_id",
    "category_name_ar",
    "category_name_en",
    "category_image",
  ],
  () => ({
    category_id: faker.string.uuid(),
    internal_id: ++internal_id,
    category_name_ar: faker.commerce.department(),
    category_name_en: faker.commerce.department(),
    category_image: "/images/test/public/logo.jpg",
  })
,STORECATEGORIESCOUNT);
//----------------------------------------------


//---Array---
const tagsArray = generateDataForTable(
  "tags",
  ["tag_id", "tag_name_ar", "tag_name_en"],
  () => ({
    tag_id: ++tag_id,
    tag_name_ar: faker.food.ethnicCategory(),
    tag_name_en: fakerEN.food.ethnicCategory()
  })
,TAGSCOUNT);
//----------------------------------------------

//---Array--
const storeTagsArray = generateDataForTable(
  "store_tags",
  ["tag_id", "store_id", "internal_store_id"],
  () => ({
    tag_id: faker.number.int(),
    store_id: faker.number.int(),
    internal_store_id: faker.string.uuid(),
  })
,STORETAGSCOUNT);
//----------------------------------------------

//---Array---
const storesArray =await generateDataForTable(
  "stores",
  [
    "store_id",
    "internal_id",
    "store_name_ar",
    "store_name_en",
    "phone_number",
    "email",
    "full_address",
    "status",
    "category_id",
    "min_order_price",
    "Latitude",
    "longitude",
    "logo_image_url",
    "cover_image_url",
    "store_description",
    "location_code",
    "platform_commission",
    "orders_type",
    "user_name",
    "encrypted_password",
    "trend_id",
  ],

  async () => ({
    store_id: faker.string.uuid(),
    internal_id: ++store_internal_id,
    store_name_ar: faker.commerce.department(),
    store_name_en: faker.commerce.department(),
    phone_number: faker.phone.number(),
    email: faker.internet.email(),
    full_address: faker.location.streetAddress(),
    status: randomEnum(enumStoreStatuses),
    category_id: faker.number.int(),
    min_order_price: faker.number.float({ min: 5, max: 100 }),
    Latitude: faker.number.float({ min: 33.45, max: 33.55, precision: 0.00001 }),
    longitude: faker.number.float({ min: 36.20, max: 36.35, precision: 0.00001 }),
    logo_image_url: "/images/test/public/logo.jpg",
    cover_image_url: "/images/test/public/logo.jpg",
    store_description: faker.lorem.sentence(),
    location_code: faker.string.uuid(),
    platform_commission: faker.number.float({ min: 0, max: 1 }),
    orders_type: randomEnum(enumOrdersTypes),
    user_name: fakerEN.helpers.unique(fakerEN.internet.username, [], { maxRetries: 10000 }),
    encrypted_password: await bcryptjs.hash("1234567890", 10),
    trend_id: faker.string.uuid(),
  })
,STORECOUNT);
//----------------------------------------------

//---Array---

const trendsArray = generateDataForTable(
  "trends",
  [
    "trend_id",
    "internal_store_id",
    "details",
    "contract_image",
    "from_date",
    "to_date",
    "create_at",
  ],
  () => ({
    trend_id: faker.string.uuid(),
    //TODO real store id
    internal_store_id: faker.string.uuid(),
    details: faker.lorem.sentence(),
    contract_image: "/images/test/public/logo.jpg",
    from_date: fakerEN.date.recent(),
    to_date: fakerEN.date.recent(),
    create_at: fakerEN.date.recent(),
  })
,TRANDSCOUNT);
//----------------------------------------------

//---Array---
const workingHoursArray = generateDataForTable(
  "working_hours",
  [
    "shift_id",
    "store_id",
    "internal_store_id",
    "day_of_week",
    "opening_time",
    "closing_time",
  ],
  () => ({
    shift_id: faker.number.int(),
    store_id: faker.number.int(),
    internal_store_id: faker.string.uuid(),
    day_of_week: randomEnum(enumDaysOfWeek),
    opening_time: fakerEN.date.recent().toLocaleTimeString(),
    closing_time: fakerEN.date.recent().toLocaleTimeString(),
  })
,WORKINGHOURSCOUNT);

//----------------------------------------------

//---Array---
const productsArray = generateDataForTable(
  "products",
  [
    "store_id",
    "internal_store_id",
    "product_data_ar_jsonb",
    "product_data_en_jsonb",
  ],
  () => ({
    store_id: faker.number.int(),
    internal_store_id: faker.string.uuid(),
    product_data_ar_jsonb: generateJSONBEnArCsvSeeder("ar"),
    product_data_en_jsonb: generateJSONBEnArCsvSeeder("en")
  })
,PRODUCTSCOUNT);

//----------------------------------------------


const coupons = Array.from({ length: NUM_COUPONS }, () => {
  return {
    code: faker.string.uuid(),
    store_id: faker.number.int({ min: 1, max: 50 }),
    internal_store_id: faker.string.alphanumeric(8),
    description: faker.commerce.productDescription(),
    discount_value_percentage: parseFloat(
      faker.number.float({ min: 0.05, max: 0.5 }).toFixed(2)
    ),
    on_expense: faker.helpers.arrayElement(enumOnExpense),
    min_order_value: faker.number.int({ min: 20, max: 300 }),
    expiration_date: fakerEN.date.future(),
    max_usage: faker.number.int({ min: 10, max: 100 }),
    real_usage: faker.number.int({ min: 0, max: 10 }),
    coupon_type: faker.helpers.arrayElement(enumCouponTypes),
  };
},COUPONSCOUNT);
const couponsWriter = createObjectCsvWriter({
  path: "seeder/CSV/coupons.csv",
  header: Object.keys(coupons[0]).map((key) => ({ id: key, title: key })),
});
//---Array---
const couponsArray = coupons;
await couponsWriter.writeRecords(coupons);

//----------------------------------------------

function generateOrderStatus(n = 100) {
  const rows = [];
  for (let i = 0; i < n; i++) {
    rows.push({
      //TODO REAL 
      order_status_id: i + 1,
      order_id: faker.number.int({ min: 1000, max: 9999 }),
      status: randomEnum(enumOrderStatuses),
      status_time: fakerEN.date.recent().toISOString(),
    });
  }
  return rows;
}

//---Array---
const OrderStatus = generateOrderStatus();
const OrderStatusArray = OrderStatus;
saveToCSV("order_status", OrderStatus, Object.keys(OrderStatus[0]));

//----------------------------------------------

//current order :

const currentOrders = Array.from({ length: CURRENTORDERSCOUNT }, () => {
  const coupon = faker.helpers.arrayElement([...coupons, null]); // 50% احتمال وجود قسيمة

  return {
    order_id: faker.string.uuid(),
    customer_id: faker.number.int({ min: 1, max: 1000 }),
    store_id: faker.number.int({ min: 1, max: 50 }),
    internal_store_id: faker.string.alphanumeric(8),
    driver_id: faker.number.int({ min: 1, max: 500 }),
    order_details_text: faker.lorem.sentences(2),
    created_at: fakerEN.date.recent(),
    payment_method: randomEnum(enumPaymentMethodTypes),
    location_latitude: faker.number.float({ min: 33.45, max: 33.55, precision: 0.00001 }),
    location_longitude:  faker.number.float({ min: 36.20, max: 36.35, precision: 0.00001 }),
    delivery_fee: parseFloat(
      faker.number.float({ min: 1, max: 15 }).toFixed(2)
    ),
    coupon_code: coupon?.code || "",
  };
});
const currentOrdersWriter = createObjectCsvWriter({
  path: "seeder/CSV/current_orders.csv",
  header: [
    { id: "order_id", title: "order_id" },
    { id: "customer_id", title: "customer_id" },
    { id: "store_id", title: "store_id" },
    { id: "internal_store_id", title: "internal_store_id" },
    { id: "driver_id", title: "driver_id" },
    { id: "order_details_text", title: "order_details_text" },
    { id: "created_at", title: "created_at" },
    { id: "payment_method", title: "payment_method" },
    { id: "location_latitude", title: "location_latitude" },
    { id: "location_longitude", title: "location_longitude" },
    { id: "delivery_fee", title: "delivery_fee" },
    { id: "coupon_code", title: "coupon_code" },
  ],
});
//---Array---
const currentOrdersArray = currentOrders;
await currentOrdersWriter.writeRecords(currentOrders);

//----------------------------------------------

const pastOrders = await generateDataForTable(
  "past_orders",
  [
    "order_id",
    "internal_id",
    "customer_id",
    "store_id",
    "internal_store_id",
    "driver_id",
    "order_details_text",
    "created_at",
    "payment_method",
    "location_latitude",
    "location_longitude",
    "delivery_fee",
    "coupon_code",
    "completed_at",
    "delivery_duration",
    "related_rating",
  ],
  () => ({
    order_id: faker.string.uuid(),
    internal_id: ++internal_id,
    customer_id: faker.number.int(),
    store_id: faker.number.int(),
    internal_store_id: faker.string.uuid(),
    driver_id: faker.number.int(),
    order_details_text: faker.lorem.sentence(),
    created_at: fakerEN.date.recent(),
    payment_method: randomEnum(enumPaymentMethodTypes),
    location_latitude: faker.number.float({ min: 33.45, max: 33.55, precision: 0.00001 }),
    location_longitude: faker.number.float({ min: 36.20, max: 36.35, precision: 0.00001 }),
    delivery_fee: faker.number.float({ min: 5, max: 20 }),
    coupon_code: faker.string.alphanumeric(10),
    completed_at: fakerEN.date.recent(),
    delivery_duration: faker.number.int({ min: 10, max: 60 }),
    related_rating: faker.number.int({ min: 1, max: 5 }),
  }),PASTORDERSCOUNT
);
//---Array---

const pastOrdersArray = pastOrders;

//----------------------------------------------

//---Array---
const ratingsArray = generateDataForTable(
  "ratings",
  [
    "rating_id",
    "customer_id",
    "order_id",
    "driver_rating",
    "order_rating",
    "rating_score",
    "comment",
    "rating_date",
  ],
  () => ({
    rating_id: faker.number.int(),
    customer_id: faker.number.int(),
    order_id: faker.number.int(),
    driver_rating: faker.number.int({ min: 1, max: 5 }),
    order_rating: faker.number.int({ min: 1, max: 5 }),
    rating_score: faker.number.float({ min: 1, max: 5 }),
    comment: faker.lorem.sentence(),
    rating_date: fakerEN.date.recent(),
  }),RAINTINGSCOUNT
);
//----------------------------------------------
//---Array---
const storeRatingsArray = generateDataForTable(
  "store_ratings_previous_day",
  ["rating_id", "rating_previous_day", "number_of_raters", "last_updated_at"],
  () => ({
    rating_id: faker.number.int(),
    rating_previous_day: faker.number.float({ min: 0, max: 5 }),
    number_of_raters: faker.number.int({ min: 0, max: 100 }),
    last_updated_at: fakerEN.date.recent(),
  }),STORERATINGSCOUNT
);

//----------------------------------------------
//---Array---

const storeTransactionsArray = generateDataForTable(
  "store_transactions",
  [
    "transaction_id",
    "partner_id",
    "store_id",
    "internal_store_id",
    "transaction_type",
    "amount",
    "transaction_date",
    "notes",
  ],
  () => ({
    transaction_id: faker.number.int(),
    partner_id: faker.number.int(),
    store_id: faker.number.int(),
    internal_store_id: faker.string.uuid(),
    transaction_type: randomEnum(enumStoreTransactionTypes),
    amount: faker.number.float({ min: 10, max: 1000 }),
    transaction_date: fakerEN.date.recent(),
    notes: faker.lorem.sentence(),
  }),STORETRANSACTIONSCOUNT
);
//----------------------------------------------

//---Array---


const storeWalletsArray = generateDataForTable(
  "store_wallets",
  [
    "store_id",
    "internal_store_id",
    "partner_id",
    "balance_previous_day",
    "last_updated_at",
  ],
  () => ({
    //real store ids
    store_id: faker.number.int(),
    internal_store_id: faker.string.uuid(),
    partner_id: faker.number.int(),
    balance_previous_day: faker.number.float({ min: 0, max: 10000 }),
    last_updated_at: fakerEN.date.recent(),
  }),STOREWALLETSCOUNT
);

//----------------------------------------------
function generateDriverWalletsPreviousDay() {
  return [
    {
      //Todo real driver id
      driver_wallet_orders_id: 10,
      balance_previous_day: faker.finance.amount(0, 500),
      order_count: faker.number.int({ min: 0, max: 50 }),
      last_updated_at: fakerEN.date.recent().toISOString(),
    },
  ];
}

const DriverWalletsPreviousDay = generateDriverWalletsPreviousDay();
//---Array---
const driverWalletsArray = DriverWalletsPreviousDay;
saveToCSV(
  "driver_wallets_previous_day",
  driverWallets,
  Object.keys(driverWallets[0])
);
//ADDED
//----------------------------------------------

//----------------------------------------------

const soldProducts = Array.from({ length: NUM_SOLD_PRODUCTS }, () => {
  const order = faker.helpers.arrayElement(pastOrders);
  const coupon = faker.helpers.arrayElement([...coupons, null]);

  const price = parseFloat(faker.commerce.price({ min: 5, max: 100 }));
  const discount = coupon ? price * (coupon.discount_value_percentage || 0) : 0;
  const full_price = price + discount;

  return {
    //TODO real data
    create_at: `${fakerEN.date.recent().toISOString()};${faker.string.uuid()}`,
    order_id: order.order_id,
    customer_id: order.customer_id,
    product_name: faker.commerce.productName(),
    product_internal_id: faker.number.int({ min: 1, max: 10000 }),
    size_name: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
    price: parseFloat(price.toFixed(2)),
    full_price: parseFloat(full_price.toFixed(2)),
    coupon_code: coupon?.code || "",
  };
});

const soldProductsWriter = createObjectCsvWriter({
  path: "seeder/CSV/products_sold.csv",
  header: [
    { id: "create_at", title: "create_at" },
    { id: "order_id", title: "order_id" },
    { id: "customer_id", title: "customer_id" },
    { id: "product_name", title: "product_name" },
    { id: "product_internal_id", title: "product_internal_id" },
    { id: "size_name", title: "size_name" },
    { id: "price", title: "price" },
    { id: "full_price", title: "full_price" },
    { id: "coupon_code", title: "coupon_code" },
  ],
});
//---Array---
const soldProductsArray = soldProducts;
await soldProductsWriter.writeRecords(soldProducts);
function generateDriverPoints(drivers) {
  return drivers.map((d) => ({
    driver_id: d.driver_id,
    completed_orders_yesterday: faker.number.int({ min: 0, max: 20 }),
    average_rating_yesterday: faker.number.float({
      min: 3,
      max: 5,
      precision: 0.1,
    }),
    trust_points_yesterday: faker.number.float({
      min: 0,
      max: 100,
      precision: 0.1,
    }),
    last_updated_at: fakerEN.date.recent().toISOString(),
    total_ratings_yesterday: faker.number.int({ min: 0, max: 50 }),
  }));
}
const driverPoints = generateDriverPoints(drivers);
//---Array---
const driverPointsArray = driverWallets;
saveToCSV("driver_points", driverPoints, Object.keys(driverPoints[0]));
//ADDED
//----------------------------------------------

generateDataForTable(
  "customer_transactions",
  [
    "transaction_id",
    "driver_id",
    "transaction_type",
    "amount",
    "transaction_date",
    "notes",
  ],
  () => ({
    //TODO : real data
    transaction_id: faker.number.int({ min: 1, max: 1_000_000 }), // سيتم تجاهله غالبًا في الإدخال
    driver_id: faker.number.int({ min: 1, max: 10000 }),
    transaction_type: randomEnum(enumUserTransactionTypes),
    amount: Number(faker.finance.amount(1, 500, 2)),
    transaction_date: fakerEN.date.recent({ days: 90 }).toISOString(),
    notes: faker.lorem.sentence(),
  }),CUSTOMERTRANSACTIONS
);
//----------------------------------------------
//---Array---
const orderFinancialLogsArray = generateDataForTable(
  "order_financial_logs",
  [
    "log_id",
    "driver_id",
    "order_id",
    "platform_commission",
    "driver_earnings",
    "log_date",
  ],
  () => ({
    //TODO real DATA
    log_id: faker.number.int(),
    driver_id: faker.number.int(),
    order_id: faker.number.int(),
    platform_commission: faker.number.float({ min: 0, max: 1 }),
    driver_earnings: faker.number.float({ min: 50, max: 200 }),
    log_date: fakerEN.date.recent(),
  })
  , ORDERFINANCIALLOGSCOUNT 

);
//----------------------------------------------

//---Array---
const electronicPaymentArray = generateDataForTable(
  "electronic_payment",
  [
    "payment_id",
    "order_id",
    "card_type",
    "customer_id",
    "paid_amount",
    "bank_transaction",
    "payment_date",
  ],
  () => ({
    //TODO Real DATA
    payment_id: faker.number.int(),
    order_id: faker.number.int(),
    card_type: faker.helpers.arrayElement(["visa", "mastercard", "amex"]),
    customer_id: faker.number.int(),
    paid_amount: faker.number.float({ min: 5, max: 100 }),
    bank_transaction: faker.finance.transactionDescription(),
    payment_date: fakerEN.date.recent(),
  }),ELECTRONICPAYMENTCOUNT
);

//----------------------------------------------

//---Array---
const statisticsPreviousDayArray = generateDataForTable(
  "statistics_previous_day",
  [
    "statistics_id",
    "total_orders",
    "total_revenue",
    "average_delivery_time",
    "new_customers_count",
    "last_updated_at",
  ],
  () => ({
    //TODO real DATA
    statistics_id: true,
    total_orders: faker.number.int({ min: 50, max: 200 }),
    total_revenue: faker.number.float({ min: 1000, max: 10000 }),
    average_delivery_time: fakerEN.date.recent(),
    new_customers_count: faker.number.int({ min: 5, max: 50 }),
    last_updated_at: fakerEN.date.recent(),
  }),STATISTICSPREVIOUSDAYCOUNT
);

//----------------------------------------------
//---Array---
const systemSettingsArray = generateDataForTable(
  "system_settings",
  [
    "setting_key",
    "setting_value",
    "description",
    "category",
    "last_updated_at",
  ],
  () => ({
    setting_key: faker.internet.username(),
    setting_value: faker.internet.password(),
    description: faker.lorem.sentence(),
    category: faker.commerce.department(),
    last_updated_at: fakerEN.date.recent(),
  })
);
//----------------------------------------------

function generateDailyStatistics() {
  return [
    {
      daily_statistics: true,
      total_orders: faker.number.int({ min: 100, max: 1000 }).toString(),
      total_revenue: faker.finance.amount(10000, 50000, 2),
      average_delivery_time: fakerEN.date.recent().toISOString(),
      new_customers_count: faker.number.int({ min: 5, max: 100 }),
      last_updated_at: fakerEN.date.recent().toISOString(),
    },
  ];
}

//---Array---
const dailyStatisticsDay = generateDailyStatistics();
const dailyStatisticsDayArray = dailyStatisticsDay;

saveToCSV("daily_statistics", dailyStatisticsDay, Object.keys(dailyStatisticsDay[0]));
//ADDED
//----------------------------------------------

function generateDocumentImages(n = 100) {
  const rows = [];
  for (let i = 0; i < n; i++) {
    rows.push({
      //TODO real DATA
      document_id: i + 1,
      document_description: faker.lorem.sentence(),
      //TODO user->driver , partner.....
      user_id: 1,
      user_type: randomEnum(enumUserTypes),
      image_url: faker.image.url(),
      uploaded_at: fakerEN.date.recent().toISOString(),
      expired: faker.datatype.boolean(),
    });
  }
  return rows;
}

//---Array---

const documentImages = generateDocumentImages();
const documentImagesDayArray = documentImages;

saveToCSV("document_images",documentImages, Object.keys(documentImages[0]));
//ADDED
//------------------------------------

//---Array---



const driverTransactionsArray = generateDataForTable(
  "driver_transactions",
  [
    "transaction_id",
    "driver_id",
    "transaction_type",
    "amount",
    "transaction_at",
    "notes",
    "platform_commission",
    "driver_earnings",
  ],
  (id) => {
    //TODO real DATA
    const amount = parseFloat(faker.finance.amount(50, 500, 2));
    const platform_commission = parseFloat(faker.finance.amount(0, 10, 2));
    const driver_earnings = parseFloat(
      (amount - platform_commission).toFixed(2)
    );

    return {
      transaction_id: id,
      driver_id: faker.number.int({ min: 1000, max: 9999 }),
      transaction_type: faker.helpers.arrayElement(enumDriverTransactionTypes),
      amount,
      transaction_at: fakerEN.date.recent().toISOString(),
      notes: faker.lorem.sentence(),
      platform_commission,
      driver_earnings,
    };
  }
,driverTRANSACTIONSCOUNT);

//--------------------------------------------------------------------------


function generateJsonbDataEnAr(ln) {
  function generateJsonCategorybDataEnAr() {
    if(ln =="ar" ){
    const category_id = faker.string.uuid();
    const category_name = faker.string.uuid();
    const category_order = faker.string.uuid();
  }
  else if(ln =="en"){
    const category_id = fakerEn.string.uuid();
    const category_name = fakerEn.string.uuid();
    const category_order = fakerEn.string.uuid();
  }
    let category = {
      //uuid but we use int for seeder integrations
      category_id: cc,
      name: category_name,
      order: category_order,
    };

    return category;
  }


  function generateJsonItembDataEnAr(sizes, category_id) {
    if(ln =="ar" ){

    const item_id = faker.string.uuid();
    const items_name = faker.food.dish();
    const items_description = faker.food.description();
    const items_is_activated = faker.string.uuid();
    const items_order = faker.string.uuid();
    const allergens = ["ا","بقوليات"];
    const is_item_best_seller = faker.string.uuid();
    const internal_item_id = faker.number.int();
    }
    if(ln =="en" ){
      const item_id = fakerEn.string.uuid();
      const items_name = fakerEn.food.dish();
      const items_description = fakerEn.food.description();
      const items_is_activated = fakerEn.string.uuid();
      const items_order = fakerEn.string.uuid();
      const allergens = ["a","bbbab"];
      const is_item_best_seller = fakerEn.string.uuid();
      const internal_item_id = fakerEn.number.int();

    }
    let item = {
      item_id: item_id,
      internal_item_id: internal_item_id,
      image_url: "/images/test/public/logo.jpg",
      name: items_name,
      description: items_description,
      external_price: faker.commerce.price(),
      allergens: allergens,
      category_id: category_id,
      is_best_seller: is_item_best_seller,
      order: items_order,
      is_activated: items_is_activated,
      sizes: sizes,
    };

    return item;
  }

  function generateJsonSizebDataEnAr(modifiers_id_array) {
    if(ln =="ar" ){

    const size_id = faker.string.uuid();
    const size_name = faker.string.uuid();
    const calories = faker.string.uuid();
    const size_price = faker.string.uuid();
    const modifier_id = faker.string.uuid();
  
  
  }
    const size_order = [,];
    if(ln =="en" ){
      const size_id = fakerEn.string.uuid();
      const size_name = fakerEn.string.uuid();
      const calories = fakerEn.string.uuid();
      const size_price = fakerEn.string.uuid();
      const modifier_id = fakerEn.string.uuid();
    }
    let size = {
      size_id: size_id,
      name: size_name,
      calories: calories,
      price: size_price,
      modifiers_id: modifiers_id_array,
      order: size_order,
    };
  }
  function generateJsonModifierbDataEnAr(modifier_items) {

    if(ln =="ar" ){

    const modifier_id = faker.string.uuid();

    const modifier_name_label = faker.food.adjective()
    const modifier_name_title = faker.food.adjective()
    const modifier_name_type = faker.randomEnum(modifiersARtypes);


const number2 = faker.number.int({ min: number1 + 1, max: number1 + 100 });
    const modifier_name_min = faker.number.int({ min: 0, max: 14 });
    const modifier_name_max = faker.number.int({ min: modifier_name_min, max: modifier_name_min+12 })
    }
    if(ln =="en" ){

      const modifier_id = fakerEn.string.uuid();

      const modifier_name_label = fakerEn.food.adjective()
      const modifier_name_title = fakerEn.food.adjective()
      const modifier_name_type = fakerEn.randomEnum(modifiersENtypes);
      const modifier_name_min = fakerEn.string.uuid();
      const modifier_name_max = fakerEn.string.uuid();
    }
    let modifier = {
      modifiers_id: modifier_id,
      label: modifier_name_label,
      title: modifier_name_title,
      type: modifier_name_type,
      min: modifier_name_min,
      max: modifier_name_max,
      items: modifier_items,
    };

    return modifier;
  }

  function generateJsonModifierItembDataEnAr() {
    if(ln =="ar" ){

    const modifier_item_id = faker.string.uuid();

    const modifier_item_name = faker.string.uuid();
    const modifier_item_price = faker.string.uuid();
    const modifier_item_is_default = faker.string.uuid();
    const modifier_item_is_enable = faker.string.uuid();
    const modifier_modifier_item_order = faker.string.uuid();
    }
    if(ln =="en" ){

      const modifier_item_id = fakerEn.string.uuid();

      const modifier_item_name = fakerEn.string.uuid();
      const modifier_item_price = fakerEn.string.uuid();
      const modifier_item_is_default = fakerEn.string.uuid();
      const modifier_item_is_enable = fakerEn.string.uuid();
      const modifier_modifier_item_order = fakerEn.string.uuid();
    }
    let item = {
      modifiers_item_id: modifier_item_id,
      name: modifier_item_name,
      price: modifier_item_price,
      is_default: modifier_item_is_default,
      order: modifier_modifier_item_order,
      is_enable: modifier_item_is_enable,
    };

    return item;
  }

  let modifiersArray = [];
  
  for (let mc = 0; mc < modifiersCount; mc++) {
    let modifier_items = []
    for (let mic = 0; mic < modifierItemsCount; mic++) {
    let modifier_item = generateJsonModifierbDataEnAr();
    modifier_items.push(modifier_item);
    }
    let modifiers = generateJsonModifierItembDataEnAr(modifier_items);
    modifiersArray.push(modifiers)
  }
  let categoriesArray = [];

  for (let cc = 0; cc < categoriesCount; cc++) {
    let category = generateJsonCategorybDataEnAr();
    categoriesArray.push(category)
  }
  let itemsArray = [];

    for (let ic = 0; ic < itemsCount; ic++) {
      let sizesArray = [];

      for (let sc = 0; sc < sizesCout; sc++) {
        
        let size = generateJsonSizebDataEnAr(modifiersArray);
        sizesArray.push(size)
      }
      let items = generateJsonItembDataEnAr(categoriesArray, size);
      itemsArray.push(size)

    }
    let store = {
      category:categoriesArray,
      items:itemsArray,
      modifiers:modifiersArray
    }
  return JSON.stringify(store);
}
// دالة لتوليد بيانات CSV مع عمود JSONB EnAr
function generateJSONBEnArCsvSeeder() {
  /*
  const csvWriter = createObjectCsvWriter({
    path: "seeder/CSV/products_seeder.csv",
    header: [{ id: "product_data_ar_jsonb", title: "product_data_ar_jsonb" }],
  });

  const data = [];
  for (let i = 0; i < PRODUCTSCOUNT; i++) {
    const jsonData = generateJsonbData();
    data.push({
      product_data_ar_jsonb: jsonData,
    });
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("تم إنشاء ملف CSV بنجاح!"));
  return data;
}
*/
// تنفيذ الدالة لتوليد CSV
//---Array---





//----------------------------------------------
/*
function generateJsonbData() {
  const category_id = faker.string.uuid();
  const item_id = faker.string.uuid();
  const size_id_small = faker.string.uuid();
  const size_id_large = faker.string.uuid();
  const modifier_id = faker.string.uuid();
  const modifier_item_id1 = faker.string.uuid();
  const modifier_item_id2 = faker.string.uuid();

  // هيكل البيانات مع الفئات والعناصر
  const data = {
    category: {
      category_id: category_id,
      name: "المشروبات",
      order: 1,
    },
    items: [
      {
        item_id: item_id,
        internal_item_id: faker.number.int(),
        image_url: "/images/test/public/logo.jpg",
        name: "عصير برتقال طازج",
        description: "عصير برتقال طبيعي 100%",
        external_price: faker.commerce.price(),
        sizes: [
          {
            size_id: size_id_small,
            name: "صغير",
            calories: 120,
            price: 10.0,
            modifiers_id: [modifier_id],
          },
          {
            size_id: size_id_large,
            name: "كبير",
            calories: 150,
            price: 15.0,
            modifiers_id: [modifier_id],
          },
        ],
        allergens: ["الحمضيات"],
        category_id: category_id,
        is_best_seller: faker.datatype.boolean(),
        order: 3,
        is_activated: "متاح",
      },
    ],
    modifiers: [
      {
        modifiers_id: modifier_id,
        label: "اختيار نوع السكر",
        title: "اختيار نوع السكر",
        type: " - متعدد -اختياري",
        min: 0,
        max: 1,
        items: [
          {
            modifiers_item_id: modifier_item_id1,
            name: "بدون سكر",
            price: 0.0,
            is_default: true,
            order: 1,
            is_enable: true,
          },
          {
            modifiers_item_id: modifier_item_id2,
            name: "سكر خفيف",
            price: 0.0,
            is_default: false,
            order: 2,
            is_enable: true,
          },
        ],
      },
    ],
  };

  return JSON.stringify(data);
}


*/
