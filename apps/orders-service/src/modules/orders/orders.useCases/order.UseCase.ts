import { customersServicesClient, storesServicesClient } from "../../../..";
import {
  MenuData,
  OrderInput,
  ResolvedModifier,
  ResolvedModifierItem,
  ResolvedOrderItem,
  TotalResolved,
} from "../../../../../partners-stores-managers-dashboards-service/src/types/order";
import {
    CouponDetailsService,
  StoreIdRepo,
  StoreService,
} from "../../../../../partners-stores-managers-dashboards-service/src/types/stores";
import { publishOrderCreated } from "../../../../../../modules/nats/publishers/order.pub";
import { PublishOrderCreated } from "../../../../../../modules/nats/types/type";
import { CustomerServeceParams, CustomerTransactionService } from "../../../../../customers-service/types/customers";

export async function createOrderCase(
  orderInput: OrderInput,
  customerId :number,
  storeId: string,
  couponCode :string,
  delivery_note : string,
) {
  let menuAr: MenuData = await storesServicesClient.getStoreProductsService({
    ln: 'ar',
    storeId: storeId,
  } as StoreService);
    let menuEn: MenuData = await storesServicesClient.getStoreProductsService({
    ln: 'en',
    storeId: storeId,
  } as StoreService);
  let resolveOrderAr = resolveOrderDetails(menuAr, orderInput);
  let resolveOrderEn = resolveOrderDetails(menuEn, orderInput);

  let isOpenShift = await storesServicesClient.isOpenNowService({
    storeId: storeId,
  } as StoreIdRepo);
  let isOpenStatus = await storesServicesClient.isStoreStatusOpenService({
    storeId: storeId,
  } as StoreIdRepo);

  let isOpen = isOpenShift&&isOpenStatus
  if(!isOpen){
    throw "sorry store is close now "
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
      total_price: (resolveOrderEn.total_price*discountPercentage)
  }
  
  let PublishOrderCreated : PublishOrderCreated ={
      orderResolved: totalResolved,
      orderCouponDetails: copounDetails,
      status: "create"
  }
  publishOrderCreated(PublishOrderCreated)
}
export async function orderDeliveryUseCase(

) {
          



}
export async function orderTransactionUseCase(
  orderInput: OrderInput,
  customerId :number,
  storeId: string,
  couponCode :string,
  delivery_note : string,
) {
      let wallet =await customersServicesClient.getCustomerWalletService({customerId :customerId}as CustomerServeceParams)

    if(wallet > 0 ){
    await customersServicesClient.insertToCustomerTransactionsService({}as CustomerTransactionService)
  }
}

























export function resolveOrderDetails(menu: MenuData, order: OrderInput) {
  let totalPrice = 0;
  let orderResolves: ResolvedOrderItem[] = order.OrderInputs.map(
    (orderItem) => {
      const item = menu.items.find((i) => i.item_id === orderItem.item_id);
      if (!item) throw new Error(`Item not found: ${orderItem.item_id}`);

      const size = item.sizes.find((s) => s.size_id === orderItem.size_id);
      if (!size)
        throw new Error(`Size not found for item ${orderItem.item_id}`);

      const resolvedModifiers: ResolvedModifier[] = orderItem.modifiers.map(
        (modInput) => {
          const modifier = menu.modifiers.find(
            (m) => m.modifiers_id === modInput.modifiers_id
          );
          if (!modifier)
            throw new Error(`Modifier not found: ${modInput.modifiers_id}`);
          let modiCount = 0;
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
  if (totalPrice == order.total_price) {
    return {
      order: orderResolves,
      total_price: totalPrice,
    };
  } else throw "totalPrice is change ";

  //--------------------------------------------------------
}
