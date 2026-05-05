import type { Item, Input } from "../app/interfaces.ts";

export interface Node {
  stepId: number;
  level: number;
  currentItemId: number | null;
  value: number;
  weight: number;
  bound: number;
  itemsSelected: Item[];
  action: "Корінь" | "Беремо" | "Пропускаємо";
  isPruned: boolean;
  path: number[];
  isPartOfBestPath?: boolean;
  includeBranch?: Node;
  excludeBranch?: Node;
}

export interface BranchesResult {
  maxValue: number;
  bestItems: Item[];
  rootNode: Node;
}

export const branches = ({ items, capacity }: Input): BranchesResult => {
  const n = items.length;
  let stepCounter = 0;

  const sortedItems = [...items].sort(
    (a, b) => b.value / b.weight - a.value / a.weight,
  );

  const calculateBound = (
    value: number,
    weight: number,
    level: number,
  ): number => {
    if (weight > capacity) return 0;

    let valueBound = value;
    let i = level + 1;
    let totalWeight = weight;

    while (i < n && totalWeight + sortedItems[i].weight <= capacity) {
      totalWeight += sortedItems[i].weight;
      valueBound += sortedItems[i].value;
      i++;
    }

    if (i < n) {
      valueBound +=
        (capacity - totalWeight) *
        (sortedItems[i].value / sortedItems[i].weight);
    }

    return valueBound;
  };

  let maxValue = 0;
  let bestItems: Item[] = [];
  let bestPathIds: number[];
  const evaluatedNodes: Node[] = [];

  const checkAndUpdateBest = (node: Node) => {
    if (node.weight <= capacity) {
      if (node.value > maxValue) {
        maxValue = node.value;
        bestItems = [...node.itemsSelected];
        bestPathIds = [...node.path];
      }
    }
  };

  const queue: Node[] = [];

  const stepRoot = ++stepCounter;
  const root: Node = {
    stepId: stepRoot,
    level: -1,
    currentItemId: null,
    value: 0,
    weight: 0,
    bound: 0,
    itemsSelected: [],
    action: "Корінь",
    isPruned: false,
    path: [stepRoot],
  };
  root.bound = calculateBound(0, 0, -1);
  queue.push(root);
  evaluatedNodes.push(root);
  bestPathIds = [stepRoot];

  while (queue.length > 0) {
    const node = queue.shift()!;

    if (node.level === n - 1) continue;

    const nextLevel = node.level + 1;
    const currentItem = sortedItems[nextLevel];

    const stepInclude = ++stepCounter;
    const includeBranch: Node = {
      stepId: stepInclude,
      level: nextLevel,
      currentItemId: currentItem.id,
      value: node.value + currentItem.value,
      weight: node.weight + currentItem.weight,
      bound: 0,
      itemsSelected: [...node.itemsSelected, currentItem],
      action: "Беремо",
      isPruned: false,
      path: [...node.path, stepInclude],
    };
    node.includeBranch = includeBranch;

    checkAndUpdateBest(includeBranch);

    includeBranch.bound = calculateBound(
      includeBranch.value,
      includeBranch.weight,
      includeBranch.level,
    );

    if (includeBranch.bound > maxValue && includeBranch.weight <= capacity) {
      queue.push(includeBranch);
    } else {
      includeBranch.isPruned = true;
    }
    evaluatedNodes.push(includeBranch);

    const stepExclude = ++stepCounter;
    const excludeBranch: Node = {
      stepId: stepExclude,
      level: nextLevel,
      currentItemId: currentItem.id,
      value: node.value,
      weight: node.weight,
      bound: 0,
      itemsSelected: [...node.itemsSelected],
      action: "Пропускаємо",
      isPruned: false,
      path: [...node.path, stepExclude],
    };
    node.excludeBranch = excludeBranch;

    checkAndUpdateBest(excludeBranch);

    excludeBranch.bound = calculateBound(
      excludeBranch.value,
      excludeBranch.weight,
      excludeBranch.level,
    );

    if (excludeBranch.bound > maxValue) {
      queue.push(excludeBranch);
    } else {
      excludeBranch.isPruned = true;
    }
    evaluatedNodes.push(excludeBranch);
  }

  for (const node of evaluatedNodes) {
    if (bestPathIds.includes(node.stepId)) {
      node.isPartOfBestPath = true;
    }
  }

  return {
    maxValue,
    bestItems,
    rootNode: root,
  };
};
