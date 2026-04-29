import type { KnapsackInput } from "../interfaces.ts";

export interface RecursionNode {
  stepId: number;
  itemIndex: number;
  capacityLeft: number;
  action:
    | "Початок"
    | "Беремо"
    | "Пропускаємо"
    | "Досягнуто кінця масиву"
    | "Вичерпано місткість"
    | "Не поміщається";
  returnedValue: number;
  includeBranch?: RecursionNode;
  excludeBranch?: RecursionNode;
}

export interface RecursiveResult {
  maxTotalValue: number;
  executionTree: RecursionNode;
}

export const recursive = ({
  items,
  capacity,
}: KnapsackInput): RecursiveResult => {
  let stepCounter = 0;

  const knapsack = (
    index: number,
    currentCapacity: number,
    action: RecursionNode["action"],
  ): RecursionNode => {
    const currentStepId = ++stepCounter;

    if (index >= items.length) {
      return {
        stepId: currentStepId,
        itemIndex: index,
        capacityLeft: currentCapacity,
        action: "Досягнуто кінця масиву",
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

    const excludeValue = excludeBranch.returnedValue;
    const includeValue = currentItem.value + includeBranch.returnedValue;

    const bestValue = Math.max(excludeValue, includeValue);

    return {
      stepId: currentStepId,
      itemIndex: index,
      capacityLeft: currentCapacity,
      action,
      returnedValue: bestValue,
      includeBranch,
      excludeBranch,
    };
  };

  const executionTree = knapsack(0, capacity, "Початок");

  return {
    maxTotalValue: executionTree.returnedValue,
    executionTree,
  };
};
