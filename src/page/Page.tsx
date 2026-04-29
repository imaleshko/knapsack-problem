import { useMemo, useState } from "react";
import styles from "./Page.module.css";
import { BruteForceVisualization } from "../bruteForce/BruteForceVisualization.tsx";
import type { Item } from "@/interfaces.ts";
import bruteForce from "../bruteForce/bruteForce.ts";
import RecursiveVisualization from "../recursive/RecursiveVisualization.tsx";
import { recursive } from "../recursive/recursive.ts";
import { GreedyVisualization } from "../greedy/GreedyVisualization.tsx";
import { greedy } from "../greedy/greedy.ts";
import { branches } from "@/branches/branches.ts";
import BranchesVisualization from "@/branches/BranchesVisualization.tsx";

const Page = () => {
  const [capacity, setCapacity] = useState<number>(10);

  const [items, setItems] = useState<Item[]>([
    { item: 1, weight: 1, value: 2 },
    { item: 2, weight: 2, value: 5 },
    { item: 3, weight: 4, value: 8 },
    { item: 4, weight: 6, value: 13 },
    { item: 5, weight: 5, value: 9 },
  ]);

  const [activeMethod, setActiveMethod] = useState<number | null>(null);

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
                {items.map((it) => (
                  <th key={`header-${it.item}`} className={styles.inputTh}>
                    {it.item}
                  </th>
                ))}
              </tr>
              <tr>
                <td className={styles.inputTdHeader}>Вага</td>
                {items.map((item, index) => (
                  <td key={`weight-${item.item}`} className={styles.inputTd}>
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
                  <td key={`value-${item.item}`} className={styles.inputTd}>
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
        {activeMethod === null ? (
          <h2 className={styles.resultsPlaceholder}>Вивід результатів</h2>
        ) : (
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

            {activeMethod === 4 && greedyResults && (
              <GreedyVisualization result={greedyResults} />
            )}

            {activeMethod === 5 && branchesResults && (
              <BranchesVisualization result={branchesResults} />
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
