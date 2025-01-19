
'use client';
import React, { useState, useEffect } from 'react';
import Range from '../../components/Range/Range';
import { getFixedValues } from '../../mocks/api';
import Link from "next/link";

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
    <div>
      <div className="m-4 wrap">
        <Link href="/" className="custom-link">
          VOLVER
        </Link>
      </div>
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ padding: "20px" }}>
        <div className="text-center p-5 border rounded shadow-lg bg-light w-100" style={{ maxWidth: "600px" }}>
          <h3 className="mb-5">Ejercicio 2: Rango fijo</h3>
          
          {/* Componente de rango con valores fijos */}
          <div className="d-flex justify-content-center align-items-center">
            <p className="mb-0" style={{ width: "80px" }}><strong>{values[0].toFixed(2)}€</strong></p>
              <Range
                min={fixedValues[0]} // El mínimo valor de fixedValues
                max={fixedValues[fixedValues.length - 1]} // El máximo valor de fixedValues
                fixedValues={fixedValues}
                values={values}
                onValuesChange={handleValuesChange}
              />
            <p className="mb-0" style={{ width: "80px" }}><strong>{values[1].toFixed(2)}€</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise2Page;