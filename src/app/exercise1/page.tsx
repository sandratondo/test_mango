'use client';
import React, { useState, useEffect } from "react";
import TestRange from "@/components/Range/Range";
import { getNormalRange } from '../../mocks/api';
import Link from "next/link";

const Exercise1Page = () => {
  const [rangeValues, setRangeValues] = useState<[number, number]>([0, 0]);
  const [displayedValues, setDisplayedValues] = useState<[number, number]>([0, 0]);
  const [limits, setLimits] = useState<{ min: number; max: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { min, max } = await getNormalRange();
        setLimits({ min, max });
        setRangeValues([min, max]);
        setDisplayedValues([min, max]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleValuesChange = (newValues: [number, number]) => {
    setRangeValues(newValues);
    setDisplayedValues(newValues);
  };

  if (isLoading) {
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
          <h2 className="mb-2">Ejercicio 1</h2>
          <h5 className="mb-5 grey">Rango personalizado</h5>

          <div className="d-flex justify-content-center align-items-center">
            <p className="mb-0" style={{ width: "80px" }}  data-testid="min-value"><strong>{displayedValues[0].toFixed(2)}€</strong></p>
            {limits && (
              <TestRange
                min={limits.min}
                max={limits.max}
                values={rangeValues}
                onValuesChange={handleValuesChange}
              />
            )}
            <p className="mb-0" style={{ width: "80px" }}  data-testid="max-value"><strong>{displayedValues[1].toFixed(2)}€</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise1Page;
