'use client';

import React, { useState, useEffect, useRef, MouseEvent as ReactMouseEvent } from 'react';
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
  const [dragPosition, setDragPosition] = useState<number | null>(null);
  const rangeRef = useRef<HTMLDivElement>(null);
  const handleMinRef = useRef<HTMLDivElement>(null);
  const handleMaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: globalThis.MouseEvent) => {
      if (isDragging && rangeRef.current) {
        const rangeRect = rangeRef.current.getBoundingClientRect();
        const rangeWidth = rangeRect.width;
        const handleWidth = handleMinRef.current?.offsetWidth || 0;
        let mousePosInTrack = event.clientX - rangeRect.left - handleWidth / 2;

        if (fixedValues) {
          const realMin = fixedValues[0];
          const realMax = fixedValues[fixedValues.length - 1];
          let newPosition = (mousePosInTrack / rangeWidth) * 100;
          const visualMin = getHandlePosition(realMin);
          const visualMax = getHandlePosition(realMax);
          newPosition = Math.max(visualMin, Math.min(newPosition, visualMax));

          setDragPosition(newPosition);

          const newValueInRange = realMin + (newPosition / 100) * (realMax - realMin);
          if (selectedHandle === 'min') {
            onValuesChange([newValueInRange, currentMax]);
          } else if (selectedHandle === 'max') {
            onValuesChange([currentMin, newValueInRange]);
          }
        } else {
          let newPosition = (mousePosInTrack / rangeWidth) * 100;
          newPosition = Math.max(0, Math.min(newPosition, 100));

          setDragPosition(newPosition);

          const rangeDiff = max - min;
          let newValue = min + (newPosition / 100) * rangeDiff;
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
      document.body.style.cursor = 'default';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (dragPosition !== null && fixedValues) {
        const realMin = fixedValues[0];
        const realMax = fixedValues[fixedValues.length - 1];
        let newValueInRange = realMin + (dragPosition / 100) * (realMax - realMin);

        let newValue = fixedValues.reduce((prev, curr) =>
          Math.abs(curr - newValueInRange) < Math.abs(prev - newValueInRange) ? curr : prev
        );

        if (selectedHandle === 'min') {
          newValue = Math.min(newValue, currentMax);
          onValuesChange([newValue, currentMax]);
        } else if (selectedHandle === 'max') {
          newValue = Math.max(newValue, currentMin);
          onValuesChange([currentMin, newValue]);
        }
        setDragPosition(null);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, fixedValues, currentMin, currentMax, onValuesChange, selectedHandle, dragPosition]);

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>, handle: 'min' | 'max') => {
    setIsDragging(true);
    setSelectedHandle(handle);
    event.preventDefault();
    event.stopPropagation();
  };

  const getHandlePosition = (value: number) => {
    if (!fixedValues) return ((value - min) / (max - min)) * 100;
    const realMin = fixedValues[0];
    const realMax = fixedValues[fixedValues.length - 1];
    return ((value - realMin) / (realMax - realMin)) * 100;
  };

  const getDisplayedValue = (handle: 'min' | 'max') => {
    if (isDragging && selectedHandle === handle && dragPosition !== null && fixedValues) {
      const realMin = fixedValues[0];
      const realMax = fixedValues[fixedValues.length - 1];
      return realMin + (dragPosition / 100) * (realMax - realMin);
    }
    return handle === 'min' ? currentMin : currentMax;
  };

  const getHandleStyle = (handle: 'min' | 'max') => {
    const position = isDragging && selectedHandle === handle && dragPosition !== null ? dragPosition : getHandlePosition(handle === 'min' ? currentMin : currentMax);
    return { left: `${position}%` };
  };

  return (
    <div className={styles.rangeContainer} ref={rangeRef}>
      <div className={styles.rangeTrack} />
      <div
        ref={handleMinRef}
        className={`${styles.rangeHandle} ${selectedHandle === 'min' ? styles.activeHandle : ''}`}
        style={getHandleStyle('min')}
        onMouseDown={(e) => handleMouseDown(e, 'min')}
      >
        <span className={styles.handleLabel}>{getDisplayedValue('min').toFixed(2)}</span>
      </div>
      <div
        ref={handleMaxRef}
        className={`${styles.rangeHandle} ${selectedHandle === 'max' ? styles.activeHandle : ''}`}
        style={getHandleStyle('max')}
        onMouseDown={(e) => handleMouseDown(e, 'max')}
      >
        <span className={styles.handleLabel}>{getDisplayedValue('max').toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Range;
