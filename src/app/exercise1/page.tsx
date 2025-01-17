'use client';
import React, { useState, useEffect } from 'react';
import Range from '../../components/Range/Range';
import { getNormalRange } from '../../mocks/api';

export default function Exercise1Page() {
    const [values, setValues] = useState<[number, number]>([0, 0]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { min, max } = await getNormalRange();
                setValues([min, max]);
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
}