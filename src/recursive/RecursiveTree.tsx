import type { RecursionNode, RecursiveResult } from "@/methods/recursive.ts";
import styles from "./RecursiveTree.module.css";

const TreeNode = ({ node }: { node: RecursionNode }) => {
  const isEnd = !node.includeBranch && !node.excludeBranch;

  const title = `[Гілка ${node.stepId}] ${node.action}: Предмет ${
    node.itemIndex + 1
  } | Залишок: ${node.capacityLeft} | Повертає: ${node.returnedValue}`;

  if (isEnd) {
    return <div className={styles.treeEnd}>{title}</div>;
  }

  return (
    <details className={styles.treeNode} open={node.stepId === 1}>
      <summary className={styles.treeSummary}>{title}</summary>
      <div className={styles.treeChildren}>
        {node.includeBranch && <TreeNode node={node.includeBranch} />}
        {node.excludeBranch && <TreeNode node={node.excludeBranch} />}
      </div>
    </details>
  );
};

export const RecursiveTree = ({ result }: { result: RecursiveResult }) => {
  if (!result || !result.executionTree) return null;

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.totalValue}>
        Максимальна знайдена цінність: {result.maxTotalValue}
      </h4>
      <div className={styles.treeWrapper}>
        <TreeNode node={result.executionTree} />
      </div>
    </div>
  );
};
