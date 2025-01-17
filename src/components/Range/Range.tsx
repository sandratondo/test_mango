'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

interface RangeProps {
  min?: number;
  max?: number;
  fixedValues?: number[];
  values: [number, number];
  onValuesChange: (values: [number, number]) => void;
}

const Range: React.FC<RangeProps> = ({
  min = 0,
  max = 100,
  fixedValues,
  values: [currentMin, currentMax],
  onValuesChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedHandle, setSelectedHandle] = useState<'min' | 'max' | null>(null);
  const rangeRef = useRef<HTMLDivElement>(null);
  const handleMinRef = useRef<HTMLDivElement>(null);
  const handleMaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging && rangeRef.current) {
        const rangeRect = rangeRef.current.getBoundingClientRect();
        const rangeWidth = rangeRect.width;
        const handleWidth = handleMinRef.current?.offsetWidth || 0;
        const mousePosInTrack = event.clientX - rangeRect.left - handleWidth / 2;

        let newValue = (mousePosInTrack / rangeWidth) * (max - min) + min;

        if (fixedValues) { // Check if fixedValues exists
          if (selectedHandle === 'min') {
            newValue = fixedValues.reduce((prev, curr) => Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev);
            newValue = Math.max(min, Math.min(newValue, currentMax));
            onValuesChange([newValue, currentMax]);
          } else if (selectedHandle === 'max') {
            newValue = fixedValues.reduce((prev, curr) => Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev);
            newValue = Math.min(max, Math.max(newValue, currentMin));
            onValuesChange([currentMin, newValue]);
          }
        } else {
          if (selectedHandle === 'min') {
            newValue = Math.max(min, Math.min(newValue, currentMax));
            onValuesChange([newValue, currentMax]);
          } else if (selectedHandle === 'max') {
            newValue = Math.min(max, Math.max(newValue, currentMin));
            onValuesChange([currentMin, newValue]);
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setSelectedHandle(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, currentMin, currentMax, onValuesChange, selectedHandle, fixedValues]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, handle: 'min' | 'max') => {
    setIsDragging(true);
    setSelectedHandle(handle);
    event.stopPropagation();
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (rangeRef.current) {
      const rangeRect = rangeRef.current.getBoundingClientRect();
      const clickPosition = event.clientX - rangeRect.left;
      let clickValue = (clickPosition / rangeRect.width) * (max - min) + min;

      if (fixedValues) {
        clickValue = fixedValues.reduce((prev, curr) => Math.abs(curr - clickValue) < Math.abs(prev - clickValue) ? curr : prev);
      }

      if (Math.abs(clickValue - currentMin) < Math.abs(clickValue - currentMax)) {
        onValuesChange([clickValue, currentMax]);
      } else {
        onValuesChange([currentMin, clickValue]);
      }
    }
  };

  const getHandlePosition = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className={styles.rangeContainer} ref={rangeRef} onClick={handleClick}>
      <div className={styles.rangeTrack} />
      <div
        ref={handleMinRef}
        className={`${styles.rangeHandle} ${selectedHandle === 'min' ? styles.activeHandle : ''}`}
        style={{ left: `${getHandlePosition(currentMin)}%` }}
        onMouseDown={(e) => handleMouseDown(e, 'min')}
      >
        <span className={styles.handleLabel}>{currentMin.toFixed(2)}</span>
      </div>
      <div
        ref={handleMaxRef}
        className={`${styles.rangeHandle} ${selectedHandle === 'max' ? styles.activeHandle : ''}`}
        style={{ left: `${getHandlePosition(currentMax)}%` }}
        onMouseDown={(e) => handleMouseDown(e, 'max')}
      >
        <span className={styles.handleLabel}>{currentMax.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Range;