export interface Item {
  item: number;
  weight: number;
  value: number;
}

export interface KnapsackInput {
  items: Item[];
  capacity: number;
}
