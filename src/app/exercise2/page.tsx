
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
        setValues([data[0], data[data.length - 1]]);
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

    if (!values || isLoading) {
      return <div>Loading...</div>;
    }

  return (
    <div>
      <h1>Exercise 2: Fixed Values Range</h1>
      <Range fixedValues={fixedValues} values={values} onValuesChange={handleValuesChange} />
      <p>Selected Values: {values[0].toFixed(2)} - {values[1].toFixed(2)}</p>
    </div>
  );
};

export default Exercise2Page;