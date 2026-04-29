import type { Node, BranchesResult } from "./branches.ts";
import styles from "./BranchesVisualization.module.css";

type TreeNodeProps = {
  node: Node;
};

interface BranchesTableProps {
  result: BranchesResult;
}

const TreeNode = ({ node }: TreeNodeProps) => {
  const isEnd = !node.includeBranch && !node.excludeBranch;
  const boundValue = Number.isInteger(node.bound)
    ? node.bound
    : node.bound.toFixed(2);

  const title = `${node.action} ${
    node.currentItemId ? `предмет ${node.currentItemId}` : ""
  } | Вага зараз: ${node.weight} | Цінність зараз: ${node.value} | Теоретична межа цієї гілки: ${boundValue} |`;

  let summaryClass = styles.treeSummary;
  let statusText = "";

  if (node.isPartOfBestPath) {
    summaryClass = `${styles.treeSummary} ${styles.treeOptimal}`;
    statusText = "Оптимальний шлях";
  } else if (node.isPruned) {
    summaryClass = `${styles.treeSummary} ${styles.treePruned}`;
    statusText = "Відсічено";
  }

  if (isEnd) {
    return (
      <div className={styles.treeNode}>
        <div className={summaryClass}>
          {title} <strong>{statusText}</strong>
        </div>
      </div>
    );
  }

  return (
    <details className={styles.treeNode} open={node.isPartOfBestPath}>
      <summary className={summaryClass}>
        {title} <strong>{statusText}</strong>
      </summary>
      <div className={styles.treeChildren}>
        {node.includeBranch && <TreeNode node={node.includeBranch} />}
        {node.excludeBranch && <TreeNode node={node.excludeBranch} />}
      </div>
    </details>
  );
};

export const BranchesVisualization = ({ result }: BranchesTableProps) => {
  if (!result || !result.rootNode) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.summaryBox}>
        <p>
          <span>Максимальна знайдена цінність:</span>
          <span className={styles.summaryValue}> {result.maxValue}</span>
        </p>
        <p>
          <span className={styles.summaryLabel}>Оптимальний набір: </span>
          <span className={styles.summaryValue}>
            {result.bestItems.length > 0
              ? `{${result.bestItems.map((i) => i.item).join(", ")}}`
              : "Порожньо"}
          </span>
        </p>
      </div>

      <div className={styles.treeContainer}>
        <TreeNode node={result.rootNode} />
      </div>
    </div>
  );
};

export default BranchesVisualization;
