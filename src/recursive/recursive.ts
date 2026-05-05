import type { Item, Input } from "../app/interfaces.ts";

export interface RecursionNode {
  stepId: number;
  itemIndex: number;
  capacityLeft: number;
  action: string;
  returnedValue: number;
  includeBranch?: RecursionNode;
  excludeBranch?: RecursionNode;
  isPartOfBestPath?: boolean;
}

export interface RecursiveResult {
  maxTotalValue: number;
  bestItems: Item[];
  executionTree: RecursionNode;
}

export const recursive = ({ items, capacity }: Input): RecursiveResult => {
  let stepCounter = 0;

  const knapsack = (
    index: number,
    currentCapacity: number,
    action: string,
  ): RecursionNode => {
    const currentStepId = ++stepCounter;

    if (index >= items.length) {
      return {
        stepId: currentStepId,
        itemIndex: index,
        capacityLeft: currentCapacity,
        action: "Кінець масиву",
        returnedValue: 0,
      };
    }

    if (currentCapacity === 0) {
      return {
        stepId: currentStepId,
        itemIndex: index,
        capacityLeft: currentCapacity,
        action: "Вичерпано місткість",
        returnedValue: 0,
      };
    }

    const currentItem = items[index];

    if (currentItem.weight > currentCapacity) {
      const excludeBranch = knapsack(
        index + 1,
        currentCapacity,
        "Не поміщається",
      );

      return {
        stepId: currentStepId,
        itemIndex: index,
        capacityLeft: currentCapacity,
        action,
        returnedValue: excludeBranch.returnedValue,
        excludeBranch,
      };
    }

    const excludeBranch = knapsack(index + 1, currentCapacity, "Пропускаємо");
    const includeBranch = knapsack(
      index + 1,
      currentCapacity - currentItem.weight,
      "Беремо",
    );

    const includeValue = currentItem.value + includeBranch.returnedValue;
    const excludeValue = excludeBranch.returnedValue;

    return {
      stepId: currentStepId,
      itemIndex: index,
      capacityLeft: currentCapacity,
      action,
      returnedValue: Math.max(excludeValue, includeValue),
      includeBranch,
      excludeBranch,
    };
  };

  const executionTree = knapsack(0, capacity, "Корінь");
  const bestItems: Item[] = [];

  const markOptimalPath = (node: RecursionNode) => {
    node.isPartOfBestPath = true;

    if (!node.includeBranch && !node.excludeBranch) return;

    if (!node.includeBranch) {
      if (node.excludeBranch) markOptimalPath(node.excludeBranch);
      return;
    }

    const currentItem = items[node.itemIndex];
    const includeValue =
      currentItem.value + (node.includeBranch.returnedValue || 0);
    const excludeValue = node.excludeBranch?.returnedValue || 0;
    if (includeValue > excludeValue) {
      bestItems.push(currentItem);
      markOptimalPath(node.includeBranch);
    } else {
      markOptimalPath(node.excludeBranch!);
    }
  };

  markOptimalPath(executionTree);

  return {
    maxTotalValue: executionTree.returnedValue,
    bestItems,
    executionTree,
  };
};
