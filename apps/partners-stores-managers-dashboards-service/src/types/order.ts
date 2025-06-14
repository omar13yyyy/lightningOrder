interface OrderItem {
  item_id: string;
  size_id: string;
  modifiers: ModifierOrderInput[];
}

interface ModifierOrderInput {
  modifiers_id: string;
  modifiers_item: ModifierItemOrderInput[];
}

interface ModifierItemOrderInput {
  modifiers_item_id: string;
  number: number;
}
export type OrderInput = OrderItem[];
//------------------------
export interface ResolvedModifierItem {
  name: string;
  price: number;
  number: number;

}

export interface ResolvedModifier {
  title: string;
  items: ResolvedModifierItem[];
}

export interface ResolvedOrderItem {
  item_name: string;
  size_name: string;
  size_price: number;
  modifiers: ResolvedModifier[];
}
export interface TotalResolved {
  order :ResolvedOrderItem[];
  total_price: number;

}
//----------------------------------------------------
export interface MenuData {
  items: Item[];
  category: Category[];
  modifiers: Modifier[];
}
export interface Category {
  name: string;
  order: number;
  category_id: string;
}

export interface Item {
  item_id: string;
  name: string;
  description: string;
  image_url: string;
  allergens: string[];
  category_id: string;
  order: number;
  is_activated: boolean;
  is_best_seller: boolean;
  external_price: string;
  internal_item_id: number;
  sizes: ItemSize[];
}
export interface ItemSize {
  name: string; 
  order: number;
  price: number;
  size_id: string;
  calories: number;
  modifiers_id: string[];
}
export interface Modifier {
  modifiers_id: string;
  title: string;
  label: string;
  type: 'Optional' | 'Multiple'; 
  min: number;
  max: number;
  items: ModifierItem[];
}

export interface ModifierItem {
  name: string;
  order: number;
  price: number;
  is_enable: boolean;
  is_default: boolean;
  modifiers_item_id: string;
}

