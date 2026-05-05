import { useMemo, useState } from "react";
import styles from "./App.module.css";
import { BruteForceVisualization } from "@/bruteForce/BruteForceVisualization.tsx";
import type { Item } from "./interfaces.ts";
import bruteForce from "@/bruteForce/bruteForce.ts";
import RecursiveVisualization from "@/recursive/RecursiveVisualization.tsx";
import { recursive } from "@/recursive/recursive.ts";
import { GreedyVisualization } from "@/greedy/GreedyVisualization.tsx";
import { greedy } from "@/greedy/greedy.ts";
import { branches } from "@/branches/branches.ts";
import BranchesVisualization from "@/branches/BranchesVisualization.tsx";
import { dp } from "@/dp/dp.ts";
import DPVisualization from "@/dp/DPVisualization.tsx";

const App = () => {
  const [capacity, setCapacity] = useState<number>(10);

  const [items, setItems] = useState<Item[]>([
    { id: 1, weight: 1, value: 2 },
    { id: 2, weight: 2, value: 5 },
    { id: 3, weight: 4, value: 8 },
    { id: 4, weight: 6, value: 13 },
    { id: 5, weight: 5, value: 9 },
  ]);

  const [activeMethod, setActiveMethod] = useState<number>(1);

  const methods = [
    { id: 1, label: "Метод грубої сили" },
    { id: 2, label: "Рекурсивний метод" },
    { id: 3, label: "Динамічне програмування" },
    { id: 4, label: "Жадібний алгоритм" },
    { id: 5, label: "Метод гілок" },
  ];

  const handleItemChange = (
    index: number,
    field: "weight" | "value",
    value: string,
  ) => {
    const numericValue = Number(value) || 0;
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [field]: numericValue };
      return newItems;
    });
  };

  const bruteForceResults = useMemo(() => {
    if (activeMethod !== 1) return [];
    return bruteForce({ items, capacity });
  }, [activeMethod, items, capacity]);

  const recursiveResults = useMemo(() => {
    if (activeMethod !== 2) return null;
    return recursive({ items, capacity });
  }, [activeMethod, items, capacity]);

  const dpResults = useMemo(() => {
    if (activeMethod !== 3) return null;
    return dp({ items, capacity });
  }, [activeMethod, items, capacity]);

  const greedyResults = useMemo(() => {
    if (activeMethod !== 4) return null;
    return greedy({ items, capacity });
  }, [activeMethod, items, capacity]);

  const branchesResults = useMemo(() => {
    if (activeMethod !== 5) return null;
    return branches({ items, capacity });
  }, [activeMethod, items, capacity]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Задача “Рюкзак”</h1>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Вхідні дані</h2>
        <div className={styles.capacityWrapper}>
          <label className={styles.capacityLabel}>Вага рюкзака:</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className={styles.input}
            style={{ width: "60px" }}
          />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.inputTable}>
            <tbody>
              <tr>
                <th className={styles.inputTh}>Предмет</th>
                {items.map((item) => (
                  <th key={`header-${item.id}`} className={styles.inputTh}>
                    {item.id}
                  </th>
                ))}
              </tr>
              <tr>
                <td className={styles.inputTdHeader}>Вага</td>
                {items.map((item, index) => (
                  <td key={`weight-${item.id}`} className={styles.inputTd}>
                    <input
                      type="number"
                      value={item.weight}
                      onChange={(e) =>
                        handleItemChange(index, "weight", e.target.value)
                      }
                      className={styles.tableInput}
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td className={styles.inputTdHeader}>Цінність</td>
                {items.map((item, index) => (
                  <td key={`value-${item.id}`} className={styles.inputTd}>
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) =>
                        handleItemChange(index, "value", e.target.value)
                      }
                      className={styles.tableInput}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Вибір режиму</h2>
        <div className={styles.buttonRow}>
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method.id)}
              className={`${styles.button} ${activeMethod === method.id ? styles.buttonActive : ""}`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.results}>
        <div>
          <h3 className={styles.resultsTitle}>
            Результати для методу:{" "}
            {methods.find((m) => m.id === activeMethod)?.label}
          </h3>

          {activeMethod === 1 && (
            <BruteForceVisualization results={bruteForceResults} />
          )}

          {activeMethod === 2 && recursiveResults && (
            <RecursiveVisualization result={recursiveResults} />
          )}

          {activeMethod === 3 && dpResults && (
            <DPVisualization
              result={dpResults}
              capacity={capacity}
              key={dpResults.maxValue}
            />
          )}

          {activeMethod === 4 && greedyResults && (
            <GreedyVisualization result={greedyResults} />
          )}

          {activeMethod === 5 && branchesResults && (
            <BranchesVisualization result={branchesResults} />
          )}
        </div>
      </section>
    </div>
  );
};

export default App;
