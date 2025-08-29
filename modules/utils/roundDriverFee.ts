export function roundDriverFee(num): number {
  return Math.ceil(num / 100) * 100;
}
export function roundCouponDiscount(num): number {
  return Math.ceil(num / 100) * 100;
}