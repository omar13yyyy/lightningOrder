import { OrderInput } from "../../apps/partners-stores-managers-dashboards-service/src/types/order";

export function printOrderInput(order: OrderInput) {
  console.log("Total Price:", order.total_price);
  console.log("Delivery Note:", order.delivery_note);

  order.OrderInputs.forEach((item, index) => {
    console.log(`Item ${index + 1}:`);
    console.log("item_id:", item.item_id);
    console.log("size_id:", item.size_id);

    item.modifiers.forEach((modifier, modIndex) => {
      console.log(`  Modifier ${modIndex + 1}:`);
      console.log("modifiers_id:", modifier.modifiers_id);

      modifier.modifiers_item.forEach((modItem, modItemIndex) => {
        console.log(`    Modifier Item ${modItemIndex + 1}:`);
        console.log("modifiers_item_id:", modItem.modifiers_item_id);
        console.log("number:", modItem.number);
      });
    });
    console.log("count:", item.count);
    console.log("note:", item.note);
  });
}
