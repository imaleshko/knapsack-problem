import type { Item, KnapsackInput } from "@/interfaces.ts";

export interface BranchesNode {
  stepId: number;
  level: number;
  profit: number;
  weight: number;
  bound: number;
  itemsSelected: Item[];
  action: "Корінь" | "Беремо" | "Пропускаємо";
  isPruned: boolean;
}

export interface BranchesResult {
  maxValue: number;
  bestItems: Item[];
  evaluatedNodes: BranchesNode[];
}

export const branches = ({
  items,
  capacity,
}: KnapsackInput): BranchesResult => {
  const n = items.length;
  let stepCounter = 0;

  const sortedItems = [...items].sort(
    (a, b) => b.value / b.weight - a.value / a.weight,
  );

  const calculateBound = (
    profit: number,
    weight: number,
    level: number,
  ): number => {
    if (weight >= capacity) return 0;

    let profitBound = profit;
    let j = level + 1;
    let totalWeight = weight;

    while (j < n && totalWeight + sortedItems[j].weight <= capacity) {
      totalWeight += sortedItems[j].weight;
      profitBound += sortedItems[j].value;
      j++;
    }

    if (j < n) {
      profitBound +=
        (capacity - totalWeight) *
        (sortedItems[j].value / sortedItems[j].weight);
    }

    return profitBound;
  };

  let maxProfit = 0;
  let bestItems: Item[] = [];
  const evaluatedNodes: BranchesNode[] = [];

  const queue: BranchesNode[] = [];

  const root: BranchesNode = {
    stepId: ++stepCounter,
    level: -1,
    profit: 0,
    weight: 0,
    bound: 0,
    itemsSelected: [],
    action: "Корінь",
    isPruned: false,
  };
  root.bound = calculateBound(0, 0, -1);
  queue.push(root);
  evaluatedNodes.push(root);

  while (queue.length > 0) {
    const u = queue.shift()!;

    if (u.level === n - 1) continue;

    const nextLevel = u.level + 1;
    const currentItem = sortedItems[nextLevel];

    const includeBranch: BranchesNode = {
      stepId: ++stepCounter,
      level: nextLevel,
      profit: u.profit + currentItem.value,
      weight: u.weight + currentItem.weight,
      bound: 0,
      itemsSelected: [...u.itemsSelected, currentItem],
      action: "Беремо",
      isPruned: false,
    };

    if (includeBranch.weight <= capacity && includeBranch.profit > maxProfit) {
      maxProfit = includeBranch.profit;
      bestItems = includeBranch.itemsSelected;
    }

    includeBranch.bound = calculateBound(
      includeBranch.profit,
      includeBranch.weight,
      includeBranch.level,
    );

    if (includeBranch.bound > maxProfit && includeBranch.weight <= capacity) {
      queue.push(includeBranch);
    } else {
      includeBranch.isPruned = true;
    }
    evaluatedNodes.push(includeBranch);

    const excludeBranch: BranchesNode = {
      stepId: ++stepCounter,
      level: nextLevel,
      profit: u.profit,
      weight: u.weight,
      bound: 0,
      itemsSelected: [...u.itemsSelected],
      action: "Пропускаємо",
      isPruned: false,
    };

    excludeBranch.bound = calculateBound(
      excludeBranch.profit,
      excludeBranch.weight,
      excludeBranch.level,
    );

    if (excludeBranch.bound > maxProfit) {
      queue.push(excludeBranch);
    } else {
      excludeBranch.isPruned = true;
    }
    evaluatedNodes.push(excludeBranch);
  }

  return {
    maxValue: maxProfit,
    bestItems,
    evaluatedNodes,
  };
};
