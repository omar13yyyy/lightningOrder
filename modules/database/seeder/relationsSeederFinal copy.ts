import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

import { CssFunction, faker as fakerEN } from "@faker-js/faker";
import { fakerAR as faker } from "@faker-js/faker";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import bcrypt from 'bcryptjs'
import { encodeToQuadrants } from "../../geo/geohash";
import {BtuidGenerator} from 'btuid'
export async function seederGenerateCSV(){

const rootPath: string =process.env.ROOT_LOCATION ||""

const filePath = path.join(rootPath,"testBtuidData", 'seeder');


const btuid = new BtuidGenerator({ path: filePath })


  const ADDRESSESCOUNT = 100;
  const STORECATEGORIESCOUNT = 3;
  const TAGSCOUNT = 21;
  const CUSTOMERCOUNT = 20;
  const DRIVERCOUNT = 10;
  const PARTNERSCOUNT = 6;
  const STORESCOUNT = 150;
  const ORDERSCOUNT = 10000;
  const SOLDPRODUCTSCOUNT = 1000;
  const TRANDSCOUNT = 10;
  const COUPONSCOUNT = 10;
  const DOCUMENTIMAGESSCOUNT = 50;
  const DRIVERDOCUMENTIMAGESSCOUNT = 50 ;
  const driverTRANSACTIONSCOUNT = 35;
  const SYSTEMSETTINGCOUNT = 10;
  const VISITEDSSCOUNT = 500 ;
  const WITHDRAWALREQUESTSCOUNT =PARTNERSCOUNT*2






const enumOrderStatuses = ["accepted", "rejected", "with_driver", "delivered"];

const enumUserTypes = [
  "customer",
  "store",
  "partner",
  "store_Payments",
  "partner_Payments",
];

const enumDaysOfWeek = ['Sun', 'Mon','Tue','Wed', 'Thu','Fri','Sat'];

const enumOnExpense = ["partner", "our_company", "both"];

const enumCouponTypes = ["personal", "public"];

const enumDriverTransactionTypes = [
  "order_cost",
  "driver_profits_received_to_driver",
  "driver_order_cost_received_from_driver",
];

const enumVehicleTypes = ["car", "motorcycle", "bicycle", "electric_bike"];

const enumStoreTransactionTypes = ["deposit", "withdraw", "discount"];

const enumTrustPointsOperationTypes = ["auto", "manual"];

const enumPartnerStatuses = ["available", "blocked"];

const enumUserTransactionTypes = ["input", "output"];

const enumStoreStatuses = ["open", "close", "busy"];

const enumOrdersTypes = ["take_away", "delivery","take_away_and_delivery"];
const enumPaymentMethodTypes = [
  "cash",
  "online",
  "wallet",
  "wallet_and_cash",
  "wallet_and_online",
];
const modifiersENtypes = ["Optional", "Multiple"];
const enum_sizes_en = ["small", "medium","large","veryLarge","verysmall"];
const enum_sizes_ar = ["small", "medium","large","veryLarge","verysmall"];
const enumWithdrawalStatus =[ 'new','wait','done'];
const enumWithdrawalUser =[ 'driver','partner'];
const enumOrdersType =[ 'take_away','delivery'];


function generateUniqueValues(generator, count) {
  const uniqueSet = new Set();

  while (uniqueSet.size < count) {
    uniqueSet.add(generator());
  }

  return Array.from(uniqueSet);
}

function randomEnum(enumArray) {
  return enumArray[Math.floor(Math.random() * enumArray.length)];
}
function randomArrayElement(array) {
  return array[Math.floor(Math.random() * array.length)];
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
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  const dirPath = path.join(__dirname, 'CSV');  
  fs.writeFileSync(`${dirPath}/${filename}.csv`, content, "utf8");
  console.log(`✅ تم حفظ الملف: ${filename}.csv`);
  //console.log(`${filename}.csv`);

}
interface Addresses {
  country: string;
    under_country: string;
    under2_country: string;
    under3_country: string;
    create_at: string;
    full_address: string;
}
const addressesArray :Addresses[]= [];

function generateAddress(addressId) {
  let myObj = {
    country: faker.location.country(),
    under_country: faker.location.state(),
    under2_country: faker.location.city(),
    under3_country: faker.location.street(),
    create_at :faker.date.recent().toISOString(),
    full_address:"null"
  };
  myObj.full_address = `${myObj.country}, ${myObj.under_country}, ${myObj.under2_country}, ${
    myObj.under3_country
  } : ${addressId++}`;
  addressesArray.push(myObj);
}

//----------------------------------------------

//---Array---

const customersArray :any= [];
let secret = process.env.TOKEN_SECRET_CUSTOMER
async function generateCustomer(id, address) {
  customersArray.push({
    customer_id: id,
    full_name: faker.person.fullName(),
    phone_number: `093659840${id}`,
    email: faker.internet.email(),
    encrypted_password: await bcrypt.hash("1234567890", 10),
    is_confirmed: faker.datatype.boolean(),
    birth_date: faker.date
      .birthdate({ min: 18, max: 60, mode: "age" })
      .toISOString(),
    address: address,
    create_at: faker.date.recent().toISOString(),

  });
}

//----------------------------------------------

//---Array---

const customerWalletsArray :any= [];

function generateCustomerWallets(customerId) {
  customerWalletsArray.push({
    customer_wallet_id: customerId,
    balance_previous_day:faker.number.int({ min:0, max: 100 }),
    last_updated_at: faker.date.recent().toISOString(),
  });
}

//----------------------------------------------
//---Array---
const driversArray :any = [];

async function generateDriver(id, userName) {
  driversArray.push({
    driver_id: id,
    full_name: faker.person.fullName(),
    phone_number: faker.phone.number,
    email: faker.internet.email(),
    is_activated: faker.datatype.boolean(),
    vehicle_type: faker.helpers.arrayElement(enumVehicleTypes),
    //TODO : get real address
    address: faker.location.streetAddress(),
    bank_name: faker.company.name(),
    iban: faker.finance.iban(),
    user_name: userName,
    encrypted_password: await bcrypt.hash("1234567890", 10),
  });
}

//----------------------------------------------
//---Array---

// توليد بيانات لجدول trust_points_log
//---Array---
const trustPointsArray :any = [];
function generateTrustPoint(id, driverId) {
  trustPointsArray.push({
    log_id: id,
    //TODO real driver id
    driver_id: driverId,
    operation_type: randomEnum(enumTrustPointsOperationTypes),
    points: faker.number.int({ min: 1, max: 100 }),
    reason: faker.lorem.sentence(),
    log_date: faker.date.recent().toISOString(),
  });
}

//----------------------------------------------
//---Array---
const partnersArray :any = [];
async function generatePartner(id, userName) {
  partnersArray.push({
    partner_id: id,
    partner_name: faker.person.fullName(),
    phone_number: faker.phone.number(),
    company_name_ar: faker.company.name(),
    company_name_en: fakerEN.company.name(),
    user_name: userName,
    encrypted_password: await bcrypt.hash("1234567890", 10),
    bank_name: faker.company.name(),
    iban: faker.finance.iban(),
    email: faker.internet.email(),
    status: randomEnum(enumPartnerStatuses),
    wallet_balance: 0,
    last_updated_at: faker.date.recent().toISOString(),
  });
}

//----------------------------------------------
//---Array---

const storeCategoriesArray :any = [];
function generateStoreCategory(id, uuid) {
  storeCategoriesArray.push({
    category_id: uuid,
    internal_id: id,
    category_name_ar: faker.commerce.department(),
    category_name_en: fakerEN.commerce.department(),
    category_image: "burger.png",
  });
}

//----------------------------------------------

//---Array---
const tagsArray :any = [];
function generateTag(id,category_id,internal_id) {
  tagsArray.push({
    tag_id: id,
    internal_id:internal_id,
    // no arabic food.ethnicCategory
    tag_name_ar: faker.commerce.department(),
    tag_name_en: fakerEN.food.ethnicCategory(),
    category_id :category_id 

  });
}

//----------------------------------------------

//---Array--
const storeTagsArray :any = [];
function generateStoreTag(id,i,storeUUID, tageId,internal_tag_id) {
  storeTagsArray.push({
    id:id,
    tag_id: tageId,
    internal_tag_id :internal_tag_id,
    store_id: storeUUID,
    internal_store_id: i,
  });
}
//----------------------------------------------

//---Array--
const categoryTagsArray :any = [];
function generateCategoryTag(i,categoryUUID,internalCategoryId, tageId,internal_tag_id) {
  categoryTagsArray.push({
    tag_id: tageId,
    internal_tag_id:internal_tag_id,
    store_id: categoryUUID,
    internal_category_id :internalCategoryId  ,
    internal_store_id: i,
  });
}
//----------------------------------------------

//---Array---

const storesArray :any = [];

async function generateStore(id, userName, uuid, partnerId,full_address,categoryId,internal_category_id) {
  let Latitude= faker.number.float({ min: 33.45, max: 33.55, fractionDigits: 5 })
    let longitude = faker.number.float({ min: 36.20, max: 36.35, fractionDigits:5})
    let locationCode =encodeToQuadrants(Latitude,longitude)
  storesArray.push({
    store_id: uuid,
    internal_id: id,
    partner_id: partnerId,
    store_name_ar: faker.commerce.department()+id,
    store_name_en: fakerEN.commerce.department()+id,
    store_name_ar_clean: faker.commerce.department()+id,
    phone_number: faker.phone.number(),
    email: faker.internet.email(),
    full_address: full_address,
    status: randomEnum(enumStoreStatuses),
    internal_category_id :internal_category_id,
    category_id:categoryId,
    min_order_price: faker.number.float({ min: 5, max: 100, fractionDigits: 1 }),
    Latitude: Latitude,
    longitude: longitude,
    logo_image_url: "storeLogo.jpg",
    cover_image_url: "storeCover.jpg",
    store_description: faker.lorem.sentence(),
    location_code: locationCode,
    platform_commission: faker.number.float({ min: 0, max: 1 , fractionDigits: 1}),
    orders_type: randomEnum(enumOrdersTypes),
    preparation_time:faker.number.int({ min: 1, max: 100 }),
    user_name: userName,
    encrypted_password: await bcrypt.hash("1234567890", 10),
  });
}

//----------------------------------------------

//---Array---
const trendsArray :any = [];
function generateTrends(store_id, uuid) {
  trendsArray.push({
    //TODO real store id
    internal_store_id: store_id,
    details: faker.lorem.sentence(),
    contract_image: "logo.jpg",
    from_date: faker.date.recent().toISOString(),
    to_date: faker.date.recent().toISOString(),
    create_at: faker.date.recent().toISOString(),
  });
}

//----------------------------------------------

//---Array---
const workingHoursArray :any = [];
function generateWorkingHours(id, store_id, srore_uuid, day) {
  workingHoursArray.push({
    shift_id: id,
    store_id: srore_uuid,
    internal_store_id: store_id,
    day_of_week: day,
    opening_time: faker.date.recent().toLocaleTimeString(),
    closing_time: faker.date.recent().toLocaleTimeString(),
  });
}

//----------------------------------------------

//---Array---
const productsArray :any = [];
function generateProducts(id, uuid, uuidObject) {
  productsArray.push({
    store_id: uuid,
    internal_store_id: id,
    product_data_ar_jsonb: generateJsonbDataEnAr("ar", uuidObject),
    product_data_en_jsonb: generateJsonbDataEnAr("en", uuidObject),
  });
}

//----------------------------------------------
//---Array---

const couponsArray :any = [];

function generateCoupoun(store_id, store_uuid, couponCode) {
  couponsArray.push({
    code: couponCode,
    store_id: store_uuid,
    internal_store_id: store_id ,
    description: faker.commerce.productDescription(),
    discount_value_percentage: parseFloat(
      faker.number.float({ min: 0.05, max: 0.5 }).toFixed(2)
    ),
    delivery_discount_percentage: parseFloat(
      faker.number.float({ min: 0.05, max: 0.5 }).toFixed(2)
    ),
    on_expense: faker.helpers.arrayElement(enumOnExpense),
    min_order_value: faker.number.int({ min: 20, max: 300 }),
    expiration_date: faker.date.future().toISOString(),
    max_usage: faker.number.int({ min: 10, max: 100 }),
    real_usage: faker.number.int({ min: 0, max: 10 }),
    coupon_type: faker.helpers.arrayElement(enumCouponTypes),
  });
}

//----------------------------------------------
//---Array---

const OrderStatusArray :any = [];

function generateOrderStatus(orderId, status,storeId) {
  OrderStatusArray.push({
    order_id: orderId,
    store_id:storeId,
    status: status,
    status_time: faker.date.recent().toISOString(),
  });
}


//----------------------------------------------

//current order :
//---Array---
const ordersArray :any = [];
function generateOrders(
  uuid,internal_id
){
        ordersArray.push({
order_id: uuid,
internal_id :internal_id
        })
}
const currentOrdersArray :any = [];
function generateCurrentOrder(
  orderUUID,
  internalId,
  customerid,
  storeId,
  internalStoreId,
  driverId,
  amount,
  couponCode,
  storeNameAr,storeNameEn,
  order_details_text
) {
  currentOrdersArray.push({
    order_id: orderUUID,
    internal_id: internalId,
    customer_id: customerid,
    store_id: storeId,
    store_name_ar :storeNameAr,
    store_name_en :storeNameEn,
    internal_store_id: internalStoreId,
    driver_id: driverId,
    amount: amount,
    order_details_text: order_details_text,
    created_at: faker.date.recent().toISOString(),
    payment_method: randomEnum(enumPaymentMethodTypes),
    orders_type: randomEnum(enumOrdersType),
    location_latitude: faker.number.float({ min: 33.45, max: 33.55, fractionDigits: 5 }),
    location_longitude: faker.number.float({ min: 36.20, max: 36.35, fractionDigits:5}),
    delivery_fee: faker.number.int({ min: 1000, max: 50000 }),
    store_destination:faker.number.float({
      min: 100,
      max: 3635,
      fractionDigits: 6,
    }),
    customer_destination :faker.number.float({
      min: 100,
      max: 3635,
      fractionDigits: 6,
    }),

    coupon_code: couponCode || "NULL",
  });
}

//----------------------------------------------
//---Array---
const pastOrdersArray :any = [];
function generatePastOrder(
  orderId,
  internal_order_id,
  customerId,
  storeId,
  internalStoreId,
  driverId,
  amount,
  PaymentMethod,
  relatedRating,
  couponCode,storeNameAr,storeNameEn
  ,order_details_text
) {
  pastOrdersArray.push({
    order_id: orderId,
    internal_id:internal_order_id ,
    customer_id: customerId,
    store_id: storeId,
        store_name_ar :storeNameAr,
    store_name_en :storeNameEn,
    internal_store_id: internalStoreId,
    driver_id: driverId,
    order_details_text: order_details_text,
    amount: amount,
    created_at: faker.date.recent().toISOString(),
    payment_method: PaymentMethod,
        orders_type: randomEnum(enumOrdersType),

    location_latitude: faker.number.float({ min: 33.45, max: 33.55, fractionDigits: 5 }),
    location_longitude: faker.number.float({ min: 36.20, max: 36.35, fractionDigits:5}),
    store_destination:faker.number.float({
      min: 100,
      max: 3635,
      fractionDigits: 6,
    }),
    customer_destination :faker.number.float({
      min: 100,
      max: 3635,
      fractionDigits: 6,
    }),
    delivery_fee: faker.number.float({ min: 5, max: 20 }),
    coupon_code: couponCode,
    completed_at: faker.date.recent().toISOString(),
    delivery_duration: faker.number.int({ min: 10, max: 60 }),
    related_rating: relatedRating,
  });
}

//----------------------------------------------

//---Array---
const ratingsArray :any = [];
function generateRating( customerId, orederId,enternal_order_id, orderRating, driverRating,internal_store_id) {
  ratingsArray.push({
    order_id: orederId,
    internal_order_id : enternal_order_id,
    internal_store_id :internal_store_id,
    customer_id: customerId,
    driver_rating: driverRating,
    order_rating: orderRating,
    comment: faker.lorem.sentence(),
    rating_at: faker.date.recent().toISOString(),
  });
}

//----------------------------------------------
//---Array---
const storeRatingsArray :any = [];
function generateStoreRatings(store_internal_id) {
  storeRatingsArray.push({
    store_internal_id: store_internal_id,
    rating_previous_day: faker.number.float({ min: 2, max: 5 , fractionDigits: 1}),
    number_of_raters: faker.number.int({ min: 10, max: 60 }),
    last_updated_at: faker.date.recent().toISOString(),
  });
}

//----------------------------------------------
//---Array---
const storeTransactionsArray :any = [];
function generateStoreTransactions(
  id,
  partnerId,
  storeId,
  storeInternalId,
  amount
) {
  storeTransactionsArray.push({
    transaction_id: id,
    partner_id: partnerId,
    store_id: storeId,
    internal_store_id: storeInternalId,
    transaction_type: randomEnum(enumStoreTransactionTypes),
    amount: amount,
    amount_platform_commission : amount/10,
    transaction_date: faker.date.recent().toISOString(),
    notes: faker.lorem.sentence(),
  });
}

//----------------------------------------------

//---Array---

const storeWalletsArray :any = [];
function generateStoreWallet(storId, internalStoreId, partnerId) {
  storeWalletsArray.push({
    //real store ids
    store_id: storId,
    internal_store_id: internalStoreId,
    partner_id: partnerId,
    balance_previous_day: 0,
    last_updated_at: faker.date.recent().toISOString(),
  });
}

//----------------------------------------------
const driverWalletsArray :any = [];

function generateDriverWalletsPreviousDay(id) {
  driverWalletsArray.push({
    driver_wallet_orders_id: id,
    balance_previous_day: 0,
    order_count: 0,
    last_updated_at: faker.date.recent().toISOString(),
  });
}

//---Array---

//----------------------------------------------

//----------------------------------------------
//NOTE best seles not work corectly

const soldProductsArray :any = [];
function generateSoldProduct(id,pastOrder) {

  let price = faker.number.int({ min: 1000, max: 1000000 })
  soldProductsArray.push({
	product_sold_id:faker.string.uuid(),  
    order_id: pastOrder.id,
    customer_id: pastOrder.customer_id,
    store_internal_id:pastOrder.internal_store_id,
    product_name_en: fakerEN.food.dish(),
    product_name_ar: faker.person.fullName(),
    internal_store_id :faker.number.int({ min: 1, max: 10000 }),
    product_internal_id: faker.number.int({ min: 1, max: 10000 }),
    product_id:faker.string.uuid(),
    size_name_en: faker.helpers.arrayElement(enum_sizes_ar),
    size_name_ar: faker.helpers.arrayElement(enum_sizes_ar),
    price: price,
    //full_price is :without discount
    full_price: price * 1.2,
    coupon_code: pastOrder.coupon_code,
        create_at: faker.date.recent().toISOString()

  });
}

//----------------------------------------------

const driverPointsArray :any = [];

function generateDriverPoints(id) {
  driverPointsArray.push({
    driver_id: id,
    completed_orders_previous_day: 0,
    average_rating_previous_day: 0,
    trust_points_previous_day: 0,
    last_updated_at: faker.date.recent().toISOString(),
    total_ratings_previous_day: faker.number.int({ min: 0, max: 50 }),
  });
}
//---Array---
//ADDED
//----------------------------------------------
const customerTransactionsArray :any = [];

function generateCustomerTransaction(
  transactionId,
  driverId,
  transactionType,
  amount
) {
  customerTransactionsArray.push({
    //TODO : real data
    transaction_id: transactionId,
    order_id: faker.string.uuid(),
    order_internal_id: faker.number.int({ min: 1, max: ORDERSCOUNT }),
    driver_id: driverId,
    transaction_type: transactionType,
    amount: amount,
    transaction_at: faker.date.recent({ days: 90 }).toISOString(),
    notes: faker.lorem.sentence(),
  });
}

//----------------------------------------------
//---Array--
const orderFinancialLogsArray :any = [];
function generateorderFinancialLogs(uuid, driverId, orderId,storeId,orderInternalId) {
  orderFinancialLogsArray.push({
    log_id: uuid,
    driver_id: driverId,
    order_id: orderId,
    order_internal_id :orderInternalId,

    store_id :storeId,
    order_amount : faker.number.float({ min: 50000, max: 200000 , fractionDigits: 1}),
    platform_commission: faker.number.float({ min: 0, max: 1 , fractionDigits: 1}),
    driver_earnings: faker.number.float({ min: 500, max: 2000, fractionDigits: 1 }),
    log_date: faker.date.recent().toISOString(),
  });
}

//----------------------------------------------

//---Array---
const electronicPaymentArray :any = [];
function generateElectronicPayment(id, orderId, customerId, paidAmount) {
  electronicPaymentArray.push({
    //TODO Real DATA
    payment_id: id,
    order_id: orderId,
    card_type: faker.helpers.arrayElement(["visa", "mastercard", "amex"]),
    customer_id: customerId,
    paid_amount: paidAmount,
    bank_transaction: faker.finance.transactionDescription(),
    payment_at: faker.date.recent().toISOString(),
  });
}

//----------------------------------------------

//---Array---
const statisticsPreviousDayArray :any = [];
function generateStatisticsPreviousDay(storId) {
  statisticsPreviousDayArray.push({
    //TODO real DATA
    store_id: storId,
    total_orders: faker.number.int({ min: 50, max: 200 }),
    total_revenue: faker.number.float({ min: 1000, max: 10000 , fractionDigits: 1}),
    average_delivery_time: faker.date.recent().toISOString(),
    customers_visited: faker.number.int({ min: 5, max: 50 }),
    balance_previous_day: faker.finance.amount({min :10000, max:50000, dec :2}),
    platform_commission_balance_previous_day: faker.finance.amount({min :200, max:5000, dec :2}),

    last_updated_at: faker.date.recent().toISOString(),
  })
}

//----------------------------------------------
//---Array---
const systemSettingsArray :any = [];
function generateSystemSettings(setting_key,setting_value) {
  systemSettingsArray.push({
    setting_key: setting_key,
    setting_value: setting_value,
    description: faker.lorem.sentence(),
    last_updated_at: faker.date.recent().toISOString(),
  });
}

//----------------------------------------------
//---Array---

const dailyStatisticsDayArray :any = [];

function generateDailyStatistics() {
  dailyStatisticsDayArray.push({
    daily_statistics: true,
    total_orders: faker.number.int({ min: 100, max: 1000 }).toString(),
    total_revenue: faker.finance.amount({min :10000, max:50000, dec :2}),
    average_delivery_time: faker.date.recent().toISOString(),
    new_customers_count: faker.number.int({ min: 5, max: 100 }),
    last_updated_at: faker.date.recent().toISOString(),
  });
}
//----------------------------------------------
//---Array---

const customersVisitedArray :any = [];

function generateCustomersVisited(id,customerId,store_id) {
  customersVisitedArray.push({
    visit_id : id,
    customer_id :customerId ,
    store_id : store_id,
    create_at: faker.date.recent().toISOString(),
  });
}

//----------------------------------------------
//---Array---

const documentImagesDayArray :any = [];

function generateDocumentImage(id) {
  documentImagesDayArray.push({
    document_id: id,
    document_description: faker.lorem.sentence(),
    user_id: 1,
    user_type: randomEnum(enumUserTypes),
    image_url: faker.image.url(),
    uploaded_at: faker.date.recent().toISOString(),
    expired: faker.datatype.boolean(),
  });
}

//----------------------------------------------
//---Array---

const withdrawalDocumentImagesDayArray :any = [];

function generateWithdrawalDocumentImage(id,partnerId,Withdrawal_id) {
  withdrawalDocumentImagesDayArray.push({
    document_id: id,
    user_id: partnerId,
    document_description: faker.lorem.sentence(),
    user_type: randomEnum(enumWithdrawalUser),
    image_url: faker.image.url(),
    Withdrawal_id:Withdrawal_id,
    uploaded_at: faker.date.recent().toISOString(),
    expired: faker.datatype.boolean(),
  });
}
//----------------------------------------------
//---Array---

const withdrawalRequestsArray :any = [];

function generateWithdrawalRequests(id,partnerId) {
  withdrawalRequestsArray.push({
    withdrawal_id: id,
    partner_id: partnerId,
    withdrawal_status: randomEnum(enumWithdrawalStatus),
    withdrawal_user: randomEnum(enumWithdrawalUser),
    uploaded_at: faker.date.recent().toISOString(),
    done: faker.datatype.boolean(),
  });
}

//ADDED
//----------------------------------------------
const deliveryDocumentImagesDayArray :any = [];

function generateDriverDocumentImage(id,userId) {
  deliveryDocumentImagesDayArray.push({
    document_id: id,
    document_description: faker.lorem.sentence(),
    user_id: userId,
    image_url: faker.image.url(),
    uploaded_at: faker.date.recent().toISOString(),
    expired: faker.datatype.boolean(),
  });
}
//---Array---

//ADDED
//------------------------------------

//---Array---

const driverTransactionsArray :any = [];
function generateDriverTransactions(id,driver_id) {
  const amount = faker.number.int({ min: 1000, max: 1000000 })
  const platform_commission = 0.2;
  const driver_earnings = parseFloat((amount - platform_commission).toFixed(2));

  driverTransactionsArray.push({
    transaction_id: id,
    driver_id: driver_id,
    transaction_type: faker.helpers.arrayElement(enumDriverTransactionTypes),
    amount:amount,
    transaction_at: faker.date.recent().toISOString(),
    notes: faker.lorem.sentence(),
    platform_commission:platform_commission,
    driver_earnings:driver_earnings,
  });
}

//--------------------------------------------------------------------------

function generateJsonbDataEnAr(ln, uuidObject) {
  function generateJsonCategorybDataEnAr() {
    let category_id = uuidObject.uniqueUUID[uuidObject.lastUUID];
    uuidObject.lastUUID++;

    let category_name = faker.food.ethnicCategory();
    let category_order = faker.number.int({
      min: 1,
      max: 100,
    });
    if (ln == "en") {
      category_name = fakerEN.food.ethnicCategory();
    }
    let category = {
      //uuid but we use int for seeder integrations
      category_id: category_id,
      name: category_name,
      order: category_order,
    };

    return category;
  }

  function generateJsonItembDataEnAr(sizes, categoryArray) {
    let item_id = uuidObject.uniqueUUID[uuidObject.lastUUID];
    uuidObject.lastUUID++;
    let items_name = faker.food.dish();
    let items_description = faker.food.description();
    let items_is_activated = faker.datatype.boolean();
    let items_order = faker.number.int({
      min: 1,
      max: 100,
    });
    let allergens = ["صويا", "بقوليات"];
    let is_item_best_seller = faker.datatype.boolean();
    let internal_item_id = faker.number.int({
      min: 0,
      max: 100000,
    })

    if (ln == "en") {
      items_name = fakerEN.food.dish();
      items_description = fakerEN.food.description();
      allergens = ["a", "bbbab"];
      internal_item_id = faker.number.int({
      min: 0,
      max: 100000,
    })
    }
    const category_id = categoryArray[faker.number.int({ min: 0, max: categoryArray.length-1 })].category_id
    let item = {
      item_id: item_id,
      internal_item_id: internal_item_id,
      image_url: "logo.jpg",
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

  function generateJsonSizebDataEnAr(modifiers_array) {
    let size_id = uuidObject.uniqueUUID[uuidObject.lastUUID];
    uuidObject.lastUUID++;
    let size_index = faker.number.int({
      min: 0,
      max: 4,
    });
    let size_name = enum_sizes_ar[size_index];
    let calories = faker.number.int({
      min: 100,
      max: 99999,
    });
    let size_price = faker.number.int({
      min: 1000,
      max: 100000,
    });

    if (ln == "en") {
       size_name = enum_sizes_en[size_index];
    }
    const modifiers_id_array:any[] = []      
    for(let i = 0 ;i<modifiers_array.length;i++){
     modifiers_id_array.push( modifiers_array[i].modifiers_id)
    }
    let size = {
      size_id: size_id,
      name: size_name,
      calories: calories,
      price: size_price,
      modifiers_id: modifiers_id_array,
      order: faker.number.int({
      min: 0,
      max: 200,
    }),
    };
    return size
  }
  function generateJsonModifierbDataEnAr(modifierItemsArray) {
    let modifier_id = uuidObject.uniqueUUID[uuidObject.lastUUID];
    uuidObject.lastUUID++;

    let modifier_name_label = faker.food.adjective();
    let modifier_name_title = faker.food.adjective();
    let modifier_name_type = randomEnum(modifiersENtypes);
    let number1 = faker.number.int({
      min: 1,
      max: 4,
    });
    let number2 = faker.number.int({
      min: number1 + 1,
      max: number1 + 4,
    });
    let modifier_name_min = faker.number.int({ min: 0, max: 14 });
    let modifier_name_max = faker.number.int({
      min: modifier_name_min,
      max: modifier_name_min + 12,
    });

    if (ln =="en") {
      modifier_id = fakerEN.string.uuid();

      modifier_name_label = fakerEN.food.adjective();
      modifier_name_title = fakerEN.food.adjective();
      modifier_name_type = randomEnum(modifiersENtypes);
    }
    let modifier = {
      modifiers_id: modifier_id,
      label: modifier_name_label,
      title: modifier_name_title,
      type: modifier_name_type,
      min: modifier_name_min,
      max: modifier_name_max,
      items: modifierItemsArray,
    };

    return modifier;
  }

  function generateJsonModifierItembDataEnAr() {
    let modifier_item_id = uuidObject.uniqueUUID[uuidObject.lastUUID];
    uuidObject.lastUUID++;
    let modifier_item_name = faker.food.adjective();
    let modifier_item_price = faker.number.int({
      min: 500,
      max: 99999,
    });
    let modifier_item_is_default = faker.datatype.boolean();
    let modifier_item_is_enable = faker.datatype.boolean();
    let modifier_modifier_item_order = faker.number.int({
      min: 0,
      max: 200,
    });

    if (ln == "en") {
      modifier_item_id = uuidObject.uniqueUUID[uuidObject.lastUUID];
      uuidObject.lastUUID++;

      modifier_item_name = faker.food.adjective();
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

  let modifierItemsArray :any = [];
  let categoriesCount = faker.number.int({ min: 1, max: 10 });
  let itemsCount = faker.number.int({ min: 0, max: 10 });
  let modifiersCount = faker.number.int({ min: 0, max: 5 });
    let modifierArray :any = [];

  for (let mc = 0; mc < modifiersCount; mc++) {
    let modifierItemsCount = faker.number.int({ min: 1, max: 5 });
    for (let mic = 0; mic < modifierItemsCount; mic++) {

   
    let modifierItem = generateJsonModifierItembDataEnAr();
    modifierItemsArray.push(modifierItem);
    }
      let modifier_item = generateJsonModifierbDataEnAr(modifierItemsArray);
      modifierArray.push(modifier_item);
  }
  let categoriesArray :any = [];

  for (let cc = 0; cc < categoriesCount; cc++) {
    let category = generateJsonCategorybDataEnAr();
    categoriesArray.push(category);
  }
  let itemsArray :any = [];

  for (let ic = 0; ic < itemsCount; ic++) {
    let sizesArray :any = [];
    let sizesCount = faker.number.int({ min: 1, max: 4 });
    for (let sc = 0; sc < sizesCount; sc++) {
      let size = generateJsonSizebDataEnAr(modifierArray);
      sizesArray.push(size);
    }
    let items = generateJsonItembDataEnAr(sizesArray,categoriesArray);
    itemsArray.push(items);
  }
  let store = {
    category: categoriesArray,
    items: itemsArray,
    modifiers: modifierArray,
  };
  return JSON.stringify(store);
}

let transaction_store_id = 1;
let store_internal_id = 1;
let tagId =1


const uniqueUUID = generateUniqueValues(
  () => faker.string.uuid(),
  STORECATEGORIESCOUNT + TRANDSCOUNT + STORESCOUNT + 1000000
);

let uuidObject = {
  lastUUID: 0,
  uniqueUUID: uniqueUUID,
};
const uniqueCouponCode = generateUniqueValues(
  () => faker.string.alpha({ length: { min: 5, max: 15 } }),
  COUPONSCOUNT
);

let couponCodeObject = {
  lastCouponCode: 0,
  uniqueCouponCode: uniqueCouponCode,
};
function addressMultigenerator(count) {
  for (let i = 1; i < count + 1; i++) {
    generateAddress(i);
  }
}

function storeCategoriesMultigenerator(count, uuidObject) {
  for (let i = 1; i < count + 1; i++) {
    generateStoreCategory(i, uuidObject.uniqueUUID[uuidObject.lastUUID]);
   
    generateCategoryTag(i,uuidObject.uniqueUUID[uuidObject.lastUUID],faker.number.int({ min: 1, max: STORECATEGORIESCOUNT }), faker.number.int({ min: 1, max: TAGSCOUNT }),faker.number.int({ min: 1, max: TAGSCOUNT }))
    uuidObject.lastUUID++;
  }
}

function tagsMultigenerator(count) {
  for (let i = 1; i < count + 1; i++) {
    generateTag(i,randomArrayElement(storeCategoriesArray).category_id,i);
  }
}
async function customersMultigenerator(count) {
  for (let i = 1; i < count + 1; i++) {
    await generateCustomer(i, randomArrayElement(addressesArray).full_address);
    generateCustomerWallets(i );
  }
}
const uniqueUserNames = generateUniqueValues(
  () => fakerEN.internet.username(),
  STORESCOUNT + DRIVERCOUNT + PARTNERSCOUNT+SYSTEMSETTINGCOUNT
);
let userNameObject = {
  lastUserName: 0,
  uniqueUserNames: uniqueUserNames,
};

async function DriversMultigenerator(count) {
  for (let i = 1; i < count + 1; i++) {
    await generateDriver(
      i,
      userNameObject.uniqueUserNames[userNameObject.lastUserName]
    );
    generateDriverWalletsPreviousDay(i);
    generateDriverPoints(i);
    userNameObject.lastUserName++;
  }
}

async function partnerMultigenerator(count) {
  for (let i = 1; i < count + 1; i++) {
    await generatePartner(
      i,
      userNameObject.uniqueUserNames[userNameObject.lastUserName]
    );
    userNameObject.lastUserName++;
  }
}

async function StoreMultigenerator(count,uuidObject) {
  let storeTagsId = 1
  for (let i = 1; i < count + 1; i++) {
    let partnerIndex = faker.number.int({ min: 0, max: PARTNERSCOUNT - 1 });
    let category =storeCategoriesArray[ faker.number.int({ min: 0, max: STORECATEGORIESCOUNT - 1 })]
    await generateStore(
      i,
      userNameObject.uniqueUserNames[userNameObject.lastUserName],
      uuidObject.uniqueUUID[uuidObject.lastUUID],
      partnersArray[partnerIndex].partner_id,faker.helpers.arrayElement(addressesArray).full_address
    ,category.category_id,category.internal_id);
        generateStoreRatings(i);
generateStatisticsPreviousDay(uuidObject.uniqueUUID[uuidObject.lastUUID]);
    for (let j = 1; j < faker.number.int({ min: 1, max: 3 }); j++){
        let tag = randomEnum (tagsArray)
      generateStoreTag(storeTagsId,i,uuidObject.uniqueUUID[uuidObject.lastUUID], tag.tag_id,tag.internal_id);
       storeTagsId++
  }
    for (let f = 1; f < 8; f++)
      generateWorkingHours(
        f + i*10,
        i,
        uuidObject.uniqueUUID[uuidObject.lastUUID],
        enumDaysOfWeek[f-1]
      );

    generateProducts(i, uuidObject.uniqueUUID[uuidObject.lastUUID], uuidObject);
    generateStoreWallet(
      uuidObject.uniqueUUID[uuidObject.lastUUID],
      i,
      partnersArray[partnerIndex].partner_id
    );

    uuidObject.lastUUID++;
    userNameObject.lastUserName++;


    if (faker.datatype.boolean()) {
      generateTrends(i, uuidObject.uniqueUUID[uuidObject.lastUUID]);
      uuidObject.lastUUID++;
    }

  }
}
function coupounsMultiGenerator(count) {
let storeIndex = faker.number.int({ min: 0, max: STORESCOUNT-1 })
for(let i = 0 ; i< count ; i++){
generateCoupoun(
  storesArray[storeIndex].internal_id,
  storesArray[storeIndex].store_id,
  couponCodeObject.uniqueCouponCode[couponCodeObject.lastCouponCode],
);
  couponCodeObject.lastCouponCode++
}
}
function ordersMultiGenerator(count) {
  function ordersProcess(i) {
    let customerIndex = faker.number.int({
      min: 0,
      max: CUSTOMERCOUNT - 1,
    });
    let driverIndex = faker.number.int({
      min: 0,
      max: DRIVERCOUNT - 1,
    });
    let storeIndex = faker.number.int({
      min: 0,
      max: STORESCOUNT - 1,
    });

    let couponIndex = faker.number.int({
      min: 0,
      max: COUPONSCOUNT - 1,
    });
    let amount = faker.number.float({
      min: 1000,
      max: 1000000,
      fractionDigits: 2,
    });
    let orderId = uuidObject.uniqueUUID[uuidObject.lastUUID];
    uuidObject.lastUUID++;
    generateOrders(orderId,i)
    generateCurrentOrder(
      orderId,
      i,
      customersArray[customerIndex].customer_id,
      storesArray[storeIndex].store_id,
      storesArray[storeIndex].internal_id,
      driversArray[driverIndex].driver_id,
      amount,
      couponsArray[couponIndex].code,
      storesArray[storeIndex].store_name_ar,
      storesArray[storeIndex].store_name_en,
      "order_html_text"
    );


    generateElectronicPayment(
      uuidObject.uniqueUUID[uuidObject.lastUUID],
      orderId,
      customersArray[customerIndex].customer_id,
      amount
    );
    uuidObject.lastUUID++;

    let status = randomEnum(enumOrderStatuses);
    if (status=="accepted") {
      generateOrderStatus(
        
        orderId,
        status,
        storesArray[storeIndex].internal_id
      );
      uuidObject.lastUUID++;
    } else if (status=="rejected") {
      generateOrderStatus(
        
        orderId,
        status,
        storesArray[storeIndex].internal_id
      );
      uuidObject.lastUUID++;
    } else if (status=="with_driver") {
      generateOrderStatus(
      
        orderId,
        status,
        storesArray[storeIndex].internal_id
      );
      uuidObject.lastUUID++;

      generateStoreTransactions(
        transaction_store_id,
                storesArray[storeIndex].partner_id,
        storesArray[storeIndex].store_id,
        storesArray[storeIndex].internal_id,
        amount
      );
      transaction_store_id++;
    } else if (status=="delivered") {
      let PaymentMethod = randomEnum(enumPaymentMethodTypes);
      if (PaymentMethod == "cash") {
      } else if (PaymentMethod == "online") {
      } else if (PaymentMethod == "wallet") {
        generateCustomerTransaction(
          uuidObject.uniqueUUID[uuidObject.lastUUID],
          driversArray[driverIndex].driver_id,
          "output",
          amount
        );
        uuidObject.lastUUID++;
      } else if (PaymentMethod == "wallet_and_cash") {
        generateCustomerTransaction(
          uuidObject.uniqueUUID[uuidObject.lastUUID],
          driversArray[driverIndex].driver_id,
          "output",
          amount / 2
        );
      } else if (PaymentMethod == "wallet_and_online") {
        generateCustomerTransaction(
          uuidObject.uniqueUUID[uuidObject.lastUUID],
          driversArray[driverIndex].driver_id,
          "output",
          amount / 2
        );
      }

      generateTrustPoint(
        uuidObject.uniqueUUID[uuidObject.lastUUID],
        driversArray[driverIndex].driver_id
      );
      uuidObject.lastUUID++;

      generateOrderStatus(orderId, status,storesArray[storeIndex].internal_id);
      generateorderFinancialLogs(
        uuidObject.uniqueUUID[uuidObject.lastUUID],
        driversArray[driverIndex].driver_id,
        orderId,
        storesArray[storeIndex].internal_id,i
      );
      uuidObject.lastUUID++;

      let orderRating = faker.number.int({ min: 1, max: 5 });
      let driverRating = faker.number.int({ min: 1, max: 5 });
      generatePastOrder(
        orderId,
        i,
        customersArray[customerIndex].customer_id,
        storesArray[storeIndex].store_id,
        storesArray[storeIndex].internal_id,
        driversArray[driverIndex].driver_id,
        amount,
        PaymentMethod,
        orderRating,
        couponsArray[couponIndex].code,
        storesArray[storeIndex].store_name_ar,
        storesArray[storeIndex].store_name_en,
        "order_html_text"
      );
      currentOrdersArray.pop();
      generateRating(
        customersArray[customerIndex].customer_id,
        orderId,i,
        orderRating,
        driverRating,
        storesArray[storeIndex].internal_id
      );
      store_internal_id++
      generateStoreTransactions(
        transaction_store_id,
                storesArray[storeIndex].partner_id,
        storesArray[storeIndex].store_id,
        storesArray[storeIndex].internal_id,
        amount
      );
      transaction_store_id++
    }
    //input

    generateCustomerTransaction(
      uuidObject.uniqueUUID[uuidObject.lastUUID],
      driversArray[driverIndex].driver_id,
      "input",
      amount / 2
    );
    uuidObject.lastUUID++;
  }
  for (let i = 1; i < count; i++) ordersProcess(i);
}

function soldProductMultiGenerator(count) {
  for (let i = 1; i < count; i++) {
    generateSoldProduct(i,faker.helpers.arrayElement(pastOrdersArray));
  }
}

function documentImagesMultiGenerator(count) {
  for (let i = 1; i < count; i++) {
    generateDocumentImage(i);
    generateDriverDocumentImage(i,randomArrayElement(driversArray).driver_id)
  }
}

function SystemSettingsMultiGenerator() {
    generateSystemSettings("delivery_cost_per_km",5000);
    generateSystemSettings("delivery_time_per_km",5);
    generateSystemSettings("max_distance_km",15);
    generateSystemSettings("min_delivery_cost",8000);


}


function driverTransactionsMultiGenerator(count) {
  for (let i = 1; i < count; i++) {
    generateDriverTransactions(i,randomEnum(driversArray).driver_id)
  }
}
function customersVisitedMultiGenerator(count) {
  for (let i = 1; i < count; i++) {
    generateCustomersVisited(i,faker.number.int({ min: 1, max: CUSTOMERCOUNT }),faker.number.int({ min: 1, max: STORESCOUNT}))
  }
}

function withdrawalRequestsMultiGenerator(count) {
  for (let i = 1; i < count; i++) {
    let partnerId =partnersArray[ faker.number.int({ min: 1, max: PARTNERSCOUNT-1 })].partner_id;
    generateWithdrawalRequests(i,partnerId);
    generateWithdrawalDocumentImage(i,partnerId,i)
  }
}


addressMultigenerator(ADDRESSESCOUNT);
storeCategoriesMultigenerator(STORECATEGORIESCOUNT, uuidObject);
tagsMultigenerator(TAGSCOUNT);
await customersMultigenerator(CUSTOMERCOUNT);
await DriversMultigenerator(DRIVERCOUNT);
await partnerMultigenerator(PARTNERSCOUNT);
await StoreMultigenerator(STORESCOUNT, uuidObject);
coupounsMultiGenerator(COUPONSCOUNT)
ordersMultiGenerator(ORDERSCOUNT);
soldProductMultiGenerator(SOLDPRODUCTSCOUNT);
documentImagesMultiGenerator(DOCUMENTIMAGESSCOUNT);
generateDailyStatistics();
SystemSettingsMultiGenerator();
driverTransactionsMultiGenerator(driverTRANSACTIONSCOUNT)
customersVisitedMultiGenerator(VISITEDSSCOUNT)
withdrawalRequestsMultiGenerator(WITHDRAWALREQUESTSCOUNT)


//----------------------------------------------------------------
saveToCSV("address", addressesArray, Object.keys(addressesArray[0]));
saveToCSV("customers", customersArray, Object.keys(customersArray[0]));
saveToCSV(
  "customer_wallets_previous_day",
  customerWalletsArray,
  Object.keys(customerWalletsArray[0])
);
saveToCSV("drivers", driversArray, Object.keys(driversArray[0]));
saveToCSV(
  "trust_points_log",
  trustPointsArray,
  Object.keys(trustPointsArray[0])
);
saveToCSV("partners", partnersArray, Object.keys(partnersArray[0]));
saveToCSV(
  "store_categories",
  storeCategoriesArray,
  Object.keys(storeCategoriesArray[0])
);
saveToCSV("tags", tagsArray, Object.keys(tagsArray[0]));
saveToCSV("store_tags", storeTagsArray, Object.keys(storeTagsArray[0]));
saveToCSV("category_tags", categoryTagsArray, Object.keys(categoryTagsArray[0]));

saveToCSV("stores", storesArray, Object.keys(storesArray[0]));
saveToCSV("trends", trendsArray, Object.keys(trendsArray[0]));
saveToCSV(
  "working_hours",
  workingHoursArray,
  Object.keys(workingHoursArray[0])
);
saveToCSV("products", productsArray, Object.keys(productsArray[0]));
saveToCSV("coupons", couponsArray, Object.keys(couponsArray[0]));
saveToCSV("order_status", OrderStatusArray, Object.keys(OrderStatusArray[0]));
saveToCSV(
  "orders",
  ordersArray,
  Object.keys(ordersArray[0])
);
saveToCSV(
  "current_orders",
  currentOrdersArray,
  Object.keys(currentOrdersArray[0])
);
saveToCSV("past_orders", pastOrdersArray, Object.keys(pastOrdersArray[0]));
saveToCSV("ratings", ratingsArray, Object.keys(ratingsArray[0]));
saveToCSV(
  "store_ratings_previous_day",
  storeRatingsArray,
  Object.keys(storeRatingsArray[0])
);
saveToCSV(
  "store_transactions",
  storeTransactionsArray,
  Object.keys(storeTransactionsArray[0])
);
saveToCSV(
  "store_wallets",
  storeWalletsArray,
  Object.keys(storeWalletsArray[0])
);
saveToCSV(
  "driver_wallets_previous_day",
  driverWalletsArray,
  Object.keys(driverWalletsArray[0])
);


saveToCSV(
  "products_sold",
  soldProductsArray,
  Object.keys(soldProductsArray[0])
);

saveToCSV(
  "driver_points",
  driverPointsArray,
  Object.keys(driverPointsArray[0])
);
saveToCSV(
  "customer_transactions",
  customerTransactionsArray,
  Object.keys(customerTransactionsArray[0])
);
saveToCSV(
  "order_financial_logs",
  orderFinancialLogsArray,
  Object.keys(orderFinancialLogsArray[0])
);
saveToCSV(
  "electronic_payment",
  electronicPaymentArray,
  Object.keys(electronicPaymentArray[0])
);
saveToCSV(
  "statistics_previous_day",
  statisticsPreviousDayArray,
  Object.keys(statisticsPreviousDayArray[0])
);
saveToCSV(
  "system_settings",
  systemSettingsArray,
  Object.keys(systemSettingsArray[0])
);
saveToCSV(
  "daily_statistics",
  dailyStatisticsDayArray,
  Object.keys(dailyStatisticsDayArray[0])
);
saveToCSV(
  "document_images",
  documentImagesDayArray,
  Object.keys(documentImagesDayArray[0])
);
saveToCSV(
  "delivery_document_images",
  deliveryDocumentImagesDayArray,
  Object.keys(deliveryDocumentImagesDayArray[0])
);
saveToCSV(
  "driver_transactions",
  driverTransactionsArray,
  Object.keys(driverTransactionsArray[0])
);

saveToCSV(
  "customers_visited",
  customersVisitedArray,
  Object.keys(customersVisitedArray[0])
);
generateWithdrawalDocumentImage
saveToCSV(
  "withdrawal_requests",
  withdrawalRequestsArray,
  Object.keys(withdrawalRequestsArray[0])
);
saveToCSV(
  "withdrawal_document_images",
  withdrawalDocumentImagesDayArray,
  Object.keys(withdrawalDocumentImagesDayArray[0])
);



}
//---------------------------------------------------------------------------------------------------------
/*
const generator = new BuidGenerator();
generator.initFakeCharJumps();
generator.configBuid();
const buid = generator.getBuid();
const storeCategoriesArrayTestBuid :any = [];
function generateStoreCategoryTestBuid(id, uuid) {
  storeCategoriesArrayTestBuid.push({
    category_id: uuid,
    internal_id: id,
    category_name_ar: faker.commerce.department(),
    category_name_en: faker.commerce.department(),
    category_image: "/images/test/public/logo.jpg",
  });
}
const storeCategoriesArrayTestCuid :any = [];
function generateStoreCategoryTestCuid(id, uuid) {
  storeCategoriesArrayTestCuid.push({
    category_id: uuid,
    internal_id: id,
    category_name_ar: faker.commerce.department(),
    category_name_en: faker.commerce.department(),
    category_image: "/images/test/public/logo.jpg",
  });
}
function storeCategoriesMultigeneratorTest1() {
  for (let i = 1; i < 10000 + 1; i++) {
    const buid = generator.getBuid();

    generateStoreCategoryTestBuid (i,buid)
    generateStoreCategoryTestCuid (i,createId())
  }
}
storeCategoriesMultigeneratorTest1()
saveToCSV(
  "store_categories_buid",
  storeCategoriesArrayTestBuid,
  Object.keys(storeCategoriesArrayTestBuid[0])
);

saveToCSV(
  "store_categories_cuid",
  storeCategoriesArrayTestCuid,
  Object.keys(storeCategoriesArrayTestCuid[0])
);

}

const generator = new BuidGenerator();
generator.initFakeCharJumps();
generator.configBuid();
const buid = generator.getBuid();
const uuids :any = [];
for (let i = 0; i < 10000000; i++) {
  uuids.push(generator.getBuid());
}

fs.writeFileSync('Buids.txt', uuids.join('\n'));


*/
