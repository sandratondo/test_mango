
'use client';
import React, { useState, useEffect } from 'react';
import Range from '../../components/Range/Range';
import { getFixedValues } from '../../mocks/api';

const Exercise2Page: React.FC = () => {
  const [values, setValues] = useState<[number, number] | null>(null);
  const [fixedValues, setFixedValues] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFixedValues();
        setFixedValues(data);
        setValues([data[0], data[data.length - 1]]); // Set initial values to min and max
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleValuesChange = (newValues: [number, number]) => {
    setValues(newValues);
  };

  if (isLoading || !values) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ padding: "20px" }}>
      <div className="text-center p-5 border rounded shadow-lg bg-light w-100" style={{ maxWidth: "600px" }}>
        <h3 className="mb-5">Exercise 2: Fixed Values Range</h3>
        
        {/* Componente de rango con valores fijos */}
        <div className="d-flex justify-content-center">
          <Range
            fixedValues={fixedValues}
            values={values}
            onValuesChange={handleValuesChange}
          />
        </div>
        
        {/* Muestra los valores seleccionados */}
        <p className="mt-4">
          <strong>Selected Values:</strong> {values[0].toFixed(2)} - {values[1].toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Exercise2Page;