import type { Item, KnapsackInput } from "../interfaces.ts";

export interface BruteForceResultLine {
  subset: Item[];
  totalWeight: number;
  totalValue: number;
  isValid: boolean;
  isBest: boolean;
}

const bruteForce = ({
  items,
  capacity,
}: KnapsackInput): BruteForceResultLine[] => {
  const n = items.length;
  const totalCombinations = 1 << n;
  const allCombinations: BruteForceResultLine[] = [];

  let bestMaxValue = -1;

  for (let i = 0; i < totalCombinations; i++) {
    const subset: Item[] = [];
    let totalWeight = 0;
    let totalValue = 0;

    for (let j = 0; j < n; j++) {
      if ((i & (1 << j)) !== 0) {
        subset.push(items[j]);
        totalWeight += items[j].weight;
        totalValue += items[j].value;
      }
    }

    const isValid = totalWeight <= capacity;

    allCombinations.push({
      subset,
      totalWeight,
      totalValue,
      isValid,
      isBest: false,
    });

    if (isValid && totalValue > bestMaxValue) {
      bestMaxValue = totalValue;
    }
  }

  if (bestMaxValue > -1) {
    for (const combination of allCombinations) {
      if (combination.isValid && combination.totalValue === bestMaxValue) {
        combination.isBest = true;
      }
    }
  }

  return allCombinations;
};

export default bruteForce;
