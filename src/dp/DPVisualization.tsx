import { useEffect, useState } from "react";
import type { DPResult } from "./dp.ts";
import styles from "./DPVisualization.module.css";

interface DPVisualizationProps {
  result: DPResult;
  capacity: number;
}

export const DPVisualization = ({ result, capacity }: DPVisualizationProps) => {
  const [filledUntil, setFilledUntil] = useState(0);
  const [lightedCount, setLightedCount] = useState(0);

  useEffect(() => {
    const totalCells = result.table.length * (capacity + 1);
    let currentCell = 0;
    let currentLight = 0;

    const timer = setInterval(() => {
      if (currentCell < totalCells) {
        currentCell++;
        setFilledUntil(currentCell);
      } else if (currentLight <= result.selectedCells.length) {
        setLightedCount(currentLight);
        currentLight++;
      } else {
        clearInterval(timer);
      }
    }, 90);

    return () => clearInterval(timer);
  }, [result, capacity]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.summaryBox}>
        <p>
          <span>Максимальна цінність:</span>
          <span className={styles.summaryValue}> {result.maxValue}</span>
        </p>
      </div>

      <table className={styles.dpTable}>
        <thead>
          <tr>
            <th className={styles.header}>i \ w</th>
            {Array.from({ length: capacity + 1 }).map((_, w) => (
              <th className={styles.header} key={w}>
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.table.map((row, i) => (
            <tr key={i}>
              <td
                className={`${styles.header} ${
                  result.selectedCells.some(
                    (cell, index) => cell.row === i && index < lightedCount,
                  )
                    ? styles.selectedHeader
                    : ""
                }`}
              >
                {i}
              </td>

              {row.map((cell, w) => {
                const isVisible = i * (capacity + 1) + w < filledUntil;
                const isSelected = result.selectedCells.some(
                  (c, index) =>
                    c.row === i && c.col === w && index < lightedCount,
                );
                return (
                  <td key={w} className={isSelected ? styles.selectedCell : ""}>
                    <span
                      className={`${styles.cellValue} ${isVisible ? styles.visible : ""}`}
                    >
                      {cell}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DPVisualization;
