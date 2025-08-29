import { customersServicesClient, deliveryServicesClient, storesServicesClient } from "../../../..";
import {
  MenuData,
  OrderInput,
  OrderItem,
  ResolvedModifier,
  ResolvedModifierItem,
  ResolvedOrderItem,
  TotalResolved,
} from "../../../../../partners-stores-managers-dashboards-service/src/types/order";
import {
    CouponDetailsService,
  StoreIdRepo,
  StoreService,
  StoreTransactionService,
} from "../../../../../partners-stores-managers-dashboards-service/src/types/stores";
import {
   ProductSoldService
} from "../../../../../partners-stores-managers-dashboards-service/src/types/stores";

import { CustomerServeceParams, CustomerTransactionService } from "../../../../../customers-service/types/customers";
import { ordersService } from "../orders.service";
import { CurrentOrderRepo, OrderFinancialLogService } from "../../../../types/orders";
import { DriverOrderRequest, StoreOrderRequest } from "../../../../../socket-service/types/types";
import { Options } from "../../../../../delivery-service/src/modules/delivery/delivery.service";
import { GetDriverRequest, OrderWithDriver } from "../../../../../partners-stores-managers-dashboards-service/src/types/finderClient";

export async function createOrderCase(
  orderInput: OrderItem[],
  paymentMethod :"cash"|"online",
  orderType :"delivery"|"take_away",
  customerId :number,
  storeId: string,
  couponCode :string,
  delivery_note : string,
  lat :number,
  lon :number,
  total_price :number
) {
  let menuAr = await storesServicesClient.getStoreProductsService({
    ln: 'ar',
    storeId: storeId,
  } as StoreService);
    let menuEn = await storesServicesClient.getStoreProductsService({
    ln: 'en',
    storeId: storeId,
  } as StoreService);
  let resolveOrderAr = resolveOrderDetails(menuAr.products,{
    OrderInputs : orderInput,
total_price :total_price ,
delivery_note : delivery_note
  }as OrderInput);
  let resolveOrderEn = resolveOrderDetails(menuEn.products, {
    OrderInputs : orderInput,
total_price :total_price ,
delivery_note : delivery_note
  }as OrderInput);

  let isOpenShift = await storesServicesClient.isOpenNowService({
    storeId: storeId,
  } as StoreIdRepo);
  let isOpenStatus = await storesServicesClient.isStoreStatusOpenService({
    storeId: storeId,
  } as StoreIdRepo);

  let isOpen = isOpenShift&&isOpenStatus
  if(!isOpen){
    throw "sorry store is busy or close now"
  }
  let copounDetails = await storesServicesClient.getCouponDetailsService({
    couponCode: couponCode,
    storeId : storeId
  } as CouponDetailsService)
      let wallet =await customersServicesClient.getCustomerWalletService({customerId :customerId}as CustomerServeceParams)
      let discountPercentage =1;
      if(copounDetails.discount_percentage){
        discountPercentage = copounDetails.discount_percentage
      }
  let totalResolved :TotalResolved ={
    orderAR: resolveOrderAr.order,
    orderEn: resolveOrderEn.order,
    delivery_note: delivery_note,
    total_price:roundCouponDiscount( resolveOrderEn.total_price * discountPercentage),
    //TODO
    deliveryFee: 0
  }

  let customer =await customersServicesClient.getCustomerProfileService({customerId : customerId }as CustomerServeceParams)
    let order = await ordersService.initOrderService()
     await ordersService.insertOrderStatusService(order.id,order.internalId ,"new")
    let store = await storesServicesClient.getstoreDetailsService({storeId:storeId}as StoreIdRepo)
    //TODO deliveryDiscount
  
  if(paymentMethod =="online" ){
    //TODO PaymentService

  }
  let currentOrder :CurrentOrderRepo = {
    order_id:order.id,
    customer_id: customerId,
    store_id: storeId,
    store_name_ar: store.store_name_ar,
    store_name_en: store.store_name_en,
    internal_store_id: store.internal_id,
    //TODO
    driver_id: null,
    amount: (resolveOrderEn.total_price * discountPercentage),
    order_details_text: totalResolved,
    payment_method: paymentMethod,
    orders_type: orderType,
    location_latitude: lat,
    location_longitude: lon,
     //TODO
    store_destination: 0 ,
    customer_destination: getDistanceInKm(lat,lon ,store.Latitude, store.longitude),
    delivery_fee: null,
    coupon_code: couponCode
  }
  
  ordersService.insertCurrentOrderService(currentOrder)
  console.log("socket store id ",storeId)
  let storeAccepted =await deliveryServicesClient.orderNotificationToStore(storeId,{ 
     orderId: order.id,
    storeId: storeId, 
    items: totalResolved,
    total : 0,
    customer: { name: customer.full_name, phone: customer.phone_number }
  }as StoreOrderRequest ,{timeoutMs : 100000}as Options )

  if( storeAccepted.status != "accepted"){
    throw "store not accepted"
  }
    let driverAccepted =await deliveryServicesClient.orderNotificationToDriver({ 
  driversForOrder: 1,
  maxDistance: 8,
  id :order.id,
  locationCode : store.location_code,
  longitude:store.longitude,
  latitude:store.Latitude,

     }as GetDriverRequest ,{ 
  orderResolved : totalResolved,
  orderCouponDetails :couponCode,
  storeNameAr: store.store_name_ar,      
  storeNameEn: store.store_name_en,       
  storeLat:store.Latitude,          
  storeLon:store.longitude,          
  customerLat: lat,       
  customerLon: lon,       // Customer longitude
  customerNumber: customer.phone_number,    // Customer phone number
  paymentMethod: "cash",
  deliveryDiscount: 0,  
  orderDiscount: 0,     
  totalBill: 0,      
      }as OrderWithDriver ,{timeoutMs : 1000,maxAttempts : 15}as Options )

      if(driverAccepted.status!= "accepted"){
        throw "no driver found"
      }

}
















export async function orderDeliveryUseCase(

) {
          



}
export async function orderTransactionCase(
  totalResolved: TotalResolved,
  customerId :number,
  storeId: string,
  couponCode :string,
  driverId : number,
  orderId :string,
    store_destination: number,
  customer_destination: number,
  location_latitude :number,
  location_longitude :number,
order_internal_id :number,

  paymentMethod :'cash'|'online'|'wallet'|'wallet_and_cash'|'wallet_and_online'|'NULL',
  
) {
      let wallet =await customersServicesClient.getCustomerWalletService({customerId :customerId}as CustomerServeceParams)

    if(wallet > 0 ){
    await customersServicesClient.insertToCustomerTransactionsService({}as CustomerTransactionService)
  }

let store = await storesServicesClient.getstoreDetailsService({storeId : storeId}as StoreIdRepo)
let storeTransactionService :StoreTransactionService ={
  partner_id: store.partner_id,
  store_id: storeId,
  internal_store_id: store.internal_id,
  transaction_type: "deposit",
  //TODO   amount: 0 coupon
  amount: 0,
  amount_platform_commission: store.platform_commission
}
storesServicesClient.insertStoreTransactionService(storeTransactionService)

let currentOrderRepo :CurrentOrderRepo = {
  order_id: orderId,
  customer_id: customerId,
  store_id: storeId,
  store_name_ar:store.store_name_ar,
  store_name_en: store.store_name_en,
  internal_store_id: store.internal_id,
  driver_id: driverId,
    //TODO   amount: 0 coupon

  amount: 0,
  order_details_text: JSON.stringify(totalResolved),
  payment_method: paymentMethod,
  orders_type: "delivery",
  location_latitude: location_latitude,
  location_longitude: location_longitude,
  store_destination: store_destination,
  customer_destination: customer_destination,
  delivery_fee:totalResolved.deliveryFee,
  coupon_code: couponCode
}
ordersService.insertCurrentOrderService(currentOrderRepo)

ordersService.insertOrderStatusService(orderId,store.internal_id,"accepted")
let orderFinancialLogService :OrderFinancialLogService = {
  driver_id: driverId,
  order_id: orderId,
  order_internal_id:order_internal_id,
  store_id: storeId,
  order_amount: totalResolved.deliveryFee,
  platform_commission: store.platform_commission,
  //todo driver_earnings = totalResolved.deliveryFee - نسبة المنصة 
  driver_earnings: totalResolved.deliveryFee,
}
ordersService.insertOrderFinancialLogService(orderFinancialLogService)
let productSoldList :ProductSoldService[] = []
for (let i = 0 ; i<  totalResolved.orderAR.length;i++){


let productSold :ProductSoldService= {
  order_id: orderId,
  customer_id: customerId,
  store_internal_id: store.internal_id,
  product_name_en: totalResolved.orderEn[i].item_name,
  product_name_ar: totalResolved.orderAR[i].item_name,
  internal_store_id: store.internal_id,
  product_internal_id: 0,
  product_id: "",
  size_name_en: totalResolved.orderEn[i].size_name,
  size_name_ar: totalResolved.orderAR[i].size_name,
  price: totalResolved.orderAR[i].size_price,
 
  full_price: totalResolved.total_price,
  coupon_code: couponCode
}
productSoldList.push(productSold)
} 
storesServicesClient.insertProductSoldService(productSoldList);

}




export async function confirmReceiptDriverCase(orderId ,store_internal_id){
  ordersService.insertOrderStatusService(orderId,store_internal_id,"with_driver")
  


}


export async function mealReplacementCase(orderId ,store_internal_id){
  
  ordersService.orderNotificationToCustomer()
  


}
export async function MealNotReplacementCase(orderId ,store_internal_id){

  ordersService.insertOrderStatusService(orderId,store_internal_id,"driver_not_Received")
  


}


export async function DeliverdCase(orderId ,store_internal_id){

  ordersService.insertOrderStatusService(orderId,store_internal_id,"delivered")
  


}

export async function customerCase(orderId ,store_internal_id){

  ordersService.insertOrderStatusService(orderId,store_internal_id,"delivered")
  


}
export async function unreceivedOrderService(orderId ,store_internal_id){

  ordersService.insertOrderStatusService(orderId,store_internal_id,"delivered")
  


}

















export function resolveOrderDetails(menu: MenuData, order: OrderInput) {
  let totalPrice = 0;
  let orderResolves: ResolvedOrderItem[] = order.OrderInputs.map(
    (orderItem) => {
      console.log(menu)
      const item = menu.items.find((i) => i.item_id === orderItem.item_id);
      if (!item) throw new Error(`Item not found: ${orderItem.item_id}`);
                console.log("hereee3")

      const size = item.sizes.find((s) => s.size_id === orderItem.size_id);
      if (!size)
        throw new Error(`Size not found for item ${orderItem.item_id}`);
                      console.log("hereee4")

      console.log("hereee1")
      const resolvedModifiers: ResolvedModifier[] = orderItem.modifiers.map(
        (modInput) => {
          const modifier = menu.modifiers.find(
            (m) => m.modifiers_id === modInput.modifiers_id
          );
          if (!modifier)
            throw new Error(`Modifier not found: ${modInput.modifiers_id}`);
          let modiCount = 0;
                console.log("hereee2")

          const resolvedItems: ResolvedModifierItem[] =
            modInput.modifiers_item.map((modItemInput) => {
              const modItem = modifier.items.find(
                (mi) => mi.modifiers_item_id === modItemInput.modifiers_item_id
              );
              if (!modItem || !modItem.is_enable)
                throw new Error(
                  `Modifier item not found or disabled: ${modItemInput.modifiers_item_id}`
                );
              modiCount += modItemInput.number;
              totalPrice += modItem.price * modItemInput.number;
              return {
                name: modItem.name,
                number: modItemInput.number,
                price: modItem.price,
              };
            });
          if (modiCount > modifier.max || modiCount < modifier.min)
            throw new Error(
              `Modifier item count not currect: ${modifier.modifiers_id}`
            );

          return {
            title: modifier.title,
            items: resolvedItems,
          };
        }
      );
      totalPrice += size.price;
      return {
        item_name: item.name,
        size_name: size.name,
        size_price: size.price,
        size_calories: size.calories,
        modifiers: resolvedModifiers,
        count: orderItem.count,
        note: orderItem.note,
      };
    }
  );
  console.log("totalPrice = ",totalPrice)
    console.log("order.total_price = ",order.total_price)

  if (true/*totalPrice == order.total_price*/) {
    return {
      order: orderResolves,
      total_price: totalPrice,
    };
  } else throw "totalPrice is change ";

  //--------------------------------------------------------
}
function getDistanceInKm(lat: number, lon: number, Latitude: any, longitude: any): number | null {
  const userLat = Number(lat);
  const userLon = Number(lon);
  const storeLat = Number(Latitude);
  const storeLon = Number(longitude);

  if (
    !isFinite(userLat) ||
    !isFinite(userLon) ||
    !isFinite(storeLat) ||
    !isFinite(storeLon)
  ) {
    return null;
  }

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(storeLat - userLat);
  const dLon = toRad(storeLon - userLon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(userLat)) *
      Math.cos(toRad(storeLat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  // Round to 3 decimals to avoid noisy floats while keeping precision
  return Math.round(d * 1000) / 1000;
}

function roundCouponDiscount(arg0: number): number {
  const n = Number(arg0);
  if (!isFinite(n)) return 0;
  // Round to 2 decimals as currency-like rounding
  return Math.round(n * 100) / 100;
}
