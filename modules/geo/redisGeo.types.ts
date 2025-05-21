export interface StoreData {
  storeId: string; // أو number حسب نوع مفتاح المتجر
  tags: number[]; // مصفوفة الأوسمة
  categories: number[]; // مصفوفة الفئات
  latitude: number,
   longitude: number,
   member:string
}
export interface DriverData {
  driverId: string; // أو number حسب نوع مفتاح المتجر
  point: number[]
    latitude: number,
   longitude: number,
      member:string

}