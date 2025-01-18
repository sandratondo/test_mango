'use client';
import React, { useState, useEffect } from "react";
import TestRange from "@/components/Range/Range";
import { getNormalRange } from '../../mocks/api';

const Exercise1Page = () => {
  // Estado inicial para los valores del rango
  const [rangeValues, setRangeValues] = useState<[number, number]>([0, 0]);
  const [displayedValues, setDisplayedValues] = useState<[number, number]>([0, 0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { min, max } = await getNormalRange();
        setRangeValues([min, max]);
        setDisplayedValues([min, max]);  // Establecer los valores de displayedValues también
      } catch (error) {
        console.error("Error fetching data:", error);
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
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ padding: "20px" }}>
      <div className="text-center p-5 border rounded shadow-lg bg-light w-100" style={{ maxWidth: "600px" }}>
        <h2 className="mb-2">Ejercicio 1</h2>
        <h5 className="mb-5 grey">Rango personalizado</h5>

        {/* Rango de valores en una sola línea */}
        <div className="d-flex justify-content-center align-items-center">
          <p className="mb-0" style={{ width: "70px" }}><strong>{displayedValues[0].toFixed(2)}</strong></p>
          <TestRange
            min={0} // Valor mínimo del rango
            max={100} // Valor máximo del rango
            values={rangeValues} // Valores actuales del rango
            onValuesChange={handleValuesChange} // Callback para cambios
          />
          <p className="mb-0" style={{ width: "70px" }}><strong>{displayedValues[1].toFixed(2)}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Exercise1Page;
