import type { BruteForceResultLine } from "src/methods/bruteForce.ts";
import styles from "./BruteForceTable.module.css";

interface BruteForceTableProps {
  results: BruteForceResultLine[];
}

export const BruteForceTable = ({ results }: BruteForceTableProps) => {
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
        {results.map((res, index) => {
          let textClass = styles.textInvalid;
          if (res.isBest) textClass = styles.textBest;
          else if (res.isValid) textClass = styles.textValid;

          return (
            <tr key={index} className={textClass}>
              <td className={styles.td}>
                {`{${res.subset.map((i) => i.item).join(", ")}}`}
              </td>
              <td className={styles.td}>{res.totalWeight}</td>
              <td className={styles.td}>{res.totalValue}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
