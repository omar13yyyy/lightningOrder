
export function roundToNearest(value, step) :number {
  return Math.round(value / step) * step;
}