import type { Item, Input } from "../app/interfaces.ts";

export interface GreedyItem extends Item {
  ratio: number;
  isSelected?: boolean;
}

export interface GreedyResult {
  sortedItems: GreedyItem[];
  selectedItems: GreedyItem[];
  totalWeight: number;
  totalValue: number;
}

export const greedy = ({ items, capacity }: Input): GreedyResult => {
  const itemsWithRatio: GreedyItem[] = items.map((item) => ({
    ...item,
    ratio: item.value / item.weight,
    isSelected: false,
  }));

  const sortedItems = [...itemsWithRatio].sort((a, b) => {
    if (b.ratio === a.ratio) {
      return a.weight - b.weight;
    }
    return b.ratio - a.ratio;
  });

  const selectedItems: GreedyItem[] = [];
  let currentWeight = 0;
  let currentValue = 0;

  for (const item of sortedItems) {
    if (currentWeight + item.weight <= capacity) {
      item.isSelected = true;
      selectedItems.push(item);
      currentWeight += item.weight;
      currentValue += item.value;
    }
  }

  return {
    sortedItems,
    selectedItems,
    totalWeight: currentWeight,
    totalValue: currentValue,
  };
};
