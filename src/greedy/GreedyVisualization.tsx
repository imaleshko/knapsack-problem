import type { GreedyResult } from "./greedy.ts"; // Перевірте шлях
import styles from "./GreedyVisualization.module.css";

interface GreedyTableProps {
  result: GreedyResult;
}

export const GreedyVisualization = ({ result }: GreedyTableProps) => {
  if (!result || !result.sortedItems) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.summary}>
        <p>
          <span>Загальна вага: </span>
          <span className={styles.summaryValue}>{result.totalWeight}</span>
        </p>
        <p>
          <span className={styles.summaryLabel}>Загальна цінність: </span>
          <span className={styles.summaryValue}>{result.totalValue}</span>
        </p>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Предмет</th>
            <th className={styles.th}>Вага</th>
            <th className={styles.th}>Цінність</th>
            <th className={styles.th}>v/w</th>
          </tr>
        </thead>
        <tbody>
          {result.sortedItems.map((item) => {
            const rowClass = item.isSelected
              ? styles.rowSelected
              : styles.rowSkipped;

            return (
              <tr key={item.item} className={rowClass}>
                <td className={styles.td}>Предмет {item.item}</td>
                <td className={styles.td}>{item.weight}</td>
                <td className={styles.td}>{item.value}</td>
                <td className={styles.td}>
                  {Number.isInteger(item.ratio)
                    ? item.ratio
                    : item.ratio.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
