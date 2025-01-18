'use client';
import React, { useState, useEffect } from 'react';
import Range from '../../components/Range/Range';
import { getNormalRange } from '../../mocks/api';

const Exercise1Page: React.FC = () => {
  const [values, setValues] = useState<[number, number]>([0, 0]); // Initialize with proper values
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { min, max } = await getNormalRange();
        setValues([min, max]);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error, e.g., display an error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleValuesChange = (newValues: [number, number]) => {
    if (newValues[0] > newValues[1]) {
      return; // Prevent invalid crossed values
    }
    setValues(newValues);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Exercise 1: Normal Range</h1>
      <Range min={values[0]} max={values[1]} values={values} onValuesChange={handleValuesChange} />
      <p>Selected Values: {values[0].toFixed(2)} - {values[1].toFixed(2)}</p>
    </div>
  );
};

export default Exercise1Page;