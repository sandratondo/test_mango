'use client';
import React, { useState, useEffect } from "react";
import TestRange from "@/components/Range/Range";
import { getNormalRange } from '../../mocks/api';

const Exercise1Page = () => {
  // Estado inicial para los valores del rango
  const [rangeValues, setRangeValues] = useState<[number, number]>([0, 0]);
  const [displayedValues, setDisplayedValues] = useState(rangeValues);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { min, max } = await getNormalRange();
        setRangeValues([min, max]);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error, e.g., display an error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para manejar cambios en los valores del rango
  const handleValuesChange = (newValues: [number, number]) => {
    setRangeValues(newValues);
    setDisplayedValues(newValues);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Exercise 1: Custom Range Component</h1>
      <TestRange
        min={0} // Valor mínimo del rango
        max={100} // Valor máximo del rango
        values={rangeValues} // Valores actuales del rango
        onValuesChange={handleValuesChange} // Callback para cambios
      />
      <p>Selected Values: {displayedValues[0].toFixed(2)} - {displayedValues[1].toFixed(2)}</p>
    </div>
  );
};

export default Exercise1Page;
