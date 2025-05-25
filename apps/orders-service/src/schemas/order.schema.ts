export const orderSchema = {
  type: "object",
  properties: {
    customerId: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          productId: { type: "string" },
          quantity: { type: "integer", minimum: 1 }
        },
        required: ["productId", "quantity"]
      }
    },
    couponCode: { type: "string" }
  },
  required: ["customerId", "items"]
};