export interface Item {
  id: number;
  weight: number;
  value: number;
}

export interface Input {
  items: Item[];
  capacity: number;
}
