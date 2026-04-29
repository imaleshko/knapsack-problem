import { useMemo, useState } from "react";
import styles from "./Page.module.css";
import { BruteForceTable } from "@/bruteForce/BruteForceTable.tsx";
import type { Item } from "@/interfaces.ts";
import bruteForce from "@/methods/bruteForce.ts";
import { RecursiveTree } from "@/recursive/RecursiveTree.tsx";
import { recursive } from "@/methods/recursive.ts";
import { GreedyTable } from "@/greedy/GreedyTable.tsx";
import { greedy } from "@/methods/greedy.ts";

const Page = () => {
  const [capacity, setCapacity] = useState<number>(10);
  const [weights, setWeights] = useState<string>("1, 2, 4, 6, 5");
  const [values, setValues] = useState<string>("2, 5, 8, 13, 9");

  const [activeMethod, setActiveMethod] = useState<number | null>(null);

  const methods = [
    { id: 1, label: "Метод грубої сили" },
    { id: 2, label: "Рекурсивний метод" },
    { id: 3, label: "Динамічне програмування" },
    { id: 4, label: "Жадібний алгоритм" },
    { id: 5, label: "Метод гілок" },
  ];

  const items: Item[] = useMemo(() => {
    const weightsArray = weights.split(",").map((s) => Number(s.trim()) || 0);
    const valueArray = values.split(",").map((s) => Number(s.trim()) || 0);
    const length = Math.min(weightsArray.length, valueArray.length);

    const parsedItems: Item[] = [];
    for (let i = 0; i < length; i++) {
      parsedItems.push({
        item: i + 1,
        weight: weightsArray[i],
        value: valueArray[i],
      });
    }
    return parsedItems;
  }, [weights, values]);

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

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Задача “Рюкзак”</h1>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Вхідні дані</h2>
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label>Вага рюкзака</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className={styles.input}
              style={{ width: "60px" }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Вектор ваг</label>
            <input
              type="text"
              value={`${weights}`}
              onChange={(e) => setWeights(e.target.value)}
              className={styles.input}
              style={{ width: "120px" }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Вектор цінностей</label>
            <input
              type="text"
              value={`${values}`}
              onChange={(e) => setValues(e.target.value)}
              className={styles.input}
              style={{ width: "120px" }}
            />
          </div>
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
              <BruteForceTable results={bruteForceResults} />
            )}

            {activeMethod === 2 && recursiveResults && (
              <RecursiveTree result={recursiveResults} />
            )}

            {activeMethod === 4 && greedyResults && (
              <GreedyTable result={greedyResults} />
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
