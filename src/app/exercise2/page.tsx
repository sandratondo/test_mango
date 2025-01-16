import React from 'react';
import Range from '@/components/Range/Range';

const Exercise2 = () => {
  const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
  return <Range min={values[0]} max={values[values.length - 1]} />;
};

export default Exercise2;
