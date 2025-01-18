'use client';
import React, { useState } from "react";
import TestRange from "@/components/Range/Range";

const Exercise1Page = () => {
  // Estado inicial para los valores del rango
  const [rangeValues, setRangeValues] = useState<[number, number]>([20, 80]);

  // Función para manejar cambios en los valores del rango
  const handleValuesChange = (newValues: [number, number]) => {
    setRangeValues(newValues);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Exercise 1: Custom Range Component</h1>
      <TestRange
        min={0} // Valor mínimo del rango
        max={100} // Valor máximo del rango
        values={rangeValues} // Valores actuales del rango
        onValuesChange={handleValuesChange} // Callback para cambios
      />
    </div>
  );
};

export default Exercise1Page;
