'use client';
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { getNormalRange } from "@/mocks/api";

const TestRange = () => {
  const [range, setRange] = useState({ min: 0, max: 100 });
  const [values, setValues] = useState({ min: 0, max: 100 });
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  useEffect(() => {
    const fetchRange = async () => {
      const { min, max } = await getNormalRange();
      setRange({ min, max });
      setValues({ min, max });
    };
    fetchRange();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget;

    if (!target || !(target instanceof HTMLElement)) {
      console.error("Target is not an HTML element");
      return;
    }

    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newValue = Math.round(
      range.min + (offsetX / rect.width) * (range.max - range.min)
    );

    if (dragging === "min" && newValue < values.max && newValue >= range.min) {
      setValues((prev) => ({ ...prev, min: newValue }));
    } else if (dragging === "max" && newValue > values.min && newValue <= range.max) {
      setValues((prev) => ({ ...prev, max: newValue }));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleLabelChange = (type: "min" | "max", newValue: number) => {
    if (type === "min" && newValue < values.max && newValue >= range.min) {
      setValues((prev) => ({ ...prev, min: newValue }));
    } else if (type === "max" && newValue > values.min && newValue <= range.max) {
      setValues((prev) => ({ ...prev, max: newValue }));
    }
  };

  return (
    <div>
      <div
        className={styles.rangeContainer}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className={styles.rangeTrack}></div>
        <div
          className={`${styles.rangeHandle} ${dragging === "min" ? styles.activeHandle : ""}`}
          style={{
            left: `${((values.min - range.min) / (range.max - range.min)) * 100}%`,
          }}
          onMouseDown={() => setDragging("min")}
        >
          <div className={styles.handleLabel}>{values.min}</div>
        </div>
        <div
          className={`${styles.rangeHandle} ${dragging === "max" ? styles.activeHandle : ""}`}
          style={{
            left: `${((values.max - range.min) / (range.max - range.min)) * 100}%`,
          }}
          onMouseDown={() => setDragging("max")}
        >
          <div className={styles.handleLabel}>{values.max}</div>
        </div>
      </div>
      {/* Mostrar los valores seleccionados dinámicamente */}
      <p style={{ marginTop: "10px", fontSize: "16px", fontWeight: "bold" }}>
        Selected Values: {values.min} - {values.max}
      </p>
    </div>
  );
};

export default TestRange;
