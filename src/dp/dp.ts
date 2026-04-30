import type { Item, KnapsackInput } from "src/interfaces.ts";

export interface DPResult {
  table: number[][];
  maxValue: number;
  selectedItems: Item[];
  selectedCells: { row: number; col: number }[];
}

export const dp = ({ items, capacity }: KnapsackInput): DPResult => {
  const n = items.length;

  const table: number[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const currentItem = items[i - 1];

    for (let w = 1; w <= capacity; w++) {
      if (currentItem.weight <= w) {
        table[i][w] = Math.max(
          table[i - 1][w],
          table[i - 1][w - currentItem.weight] + currentItem.value,
        );
      } else {
        table[i][w] = table[i - 1][w];
      }
    }
  }

  const selectedItems: Item[] = [];
  const selectedCells: { row: number; col: number }[] = [];
  let currentCapacity = capacity;

  for (let i = n; i > 0; i--) {
    if (table[i][currentCapacity] !== table[i - 1][currentCapacity]) {
      const includedItem = items[i - 1];
      selectedItems.push(includedItem);
      selectedCells.push({ row: i, col: currentCapacity });
      currentCapacity -= includedItem.weight;
    }
  }

  selectedItems.reverse();

  return {
    table,
    maxValue: table[n][capacity],
    selectedItems,
    selectedCells,
  };
};
