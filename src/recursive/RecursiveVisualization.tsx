import type { RecursionNode, RecursiveResult } from "./recursive.ts";
import styles from "./RecursiveVisualization.module.css";

type TreeNodeProps = {
  node: RecursionNode;
};

interface RecursiveVisualizationProps {
  result: RecursiveResult;
}

const TreeNode = ({ node }: TreeNodeProps) => {
  const isEnd = !node.includeBranch && !node.excludeBranch;

  const itemInfo =
    node.action !== "Кінець масиву" && node.action !== "Вичерпано місткість"
      ? `Предмет: ${node.itemIndex + 1} | `
      : "";

  const title = `${node.action} | ${itemInfo}Залишок місткості: ${node.capacityLeft} | Повертає: ${node.returnedValue} | `;

  let summaryClass = styles.treeSummary;
  let statusText = "";

  if (node.isPartOfBestPath) {
    summaryClass = `${styles.treeSummary} ${styles.treeOptimal}`;
    statusText = "Оптимальний шлях";
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

export const RecursiveVisualization = ({
  result,
}: RecursiveVisualizationProps) => {
  if (!result) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.summaryBox}>
        <p>
          <span>Максимальна знайдена цінність:</span>
          <span className={styles.summaryValue}> {result.maxTotalValue}</span>
        </p>
        <p>
          <span>Оптимальний набір: </span>
          <span className={styles.summaryValue}>
            {result.bestItems.length > 0
              ? `{${result.bestItems.map((item) => item.id).join(", ")}}`
              : "Порожньо"}
          </span>
        </p>
      </div>

      <div className={styles.treeContainer}>
        <TreeNode node={result.executionTree} />
      </div>
    </div>
  );
};

export default RecursiveVisualization;
