import type { BruteForceResultLine } from "./bruteForce.ts";
import styles from "./BruteForceVisualization.module.css";

interface BruteForceTableProps {
  results: BruteForceResultLine[];
}

export const BruteForceVisualization = ({ results }: BruteForceTableProps) => {
  if (!results || results.length === 0) return null;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Підмножина</th>
          <th className={styles.th}>Загальна вага</th>
          <th className={styles.th}>Цінність</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => {
          let textClass = styles.textInvalid;
          if (result.isBest) {
            textClass = styles.textBest;
          } else if (result.isValid) {
            textClass = styles.textValid;
          }

          return (
            <tr key={index} className={textClass}>
              <td className={styles.td}>
                {`{${result.subset.map((item) => item.id).join(", ")}}`}
              </td>
              <td className={styles.td}>{result.totalWeight}</td>
              <td className={styles.td}>{result.totalValue}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
