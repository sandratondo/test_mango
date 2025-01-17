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
      if (isDragging) {
        const rangeRect = rangeRef.current?.getBoundingClientRect();
        const handleWidth = handleMinRef.current?.offsetWidth || 0;
        if (!rangeRect) return;

        const offset = event.clientX - rangeRect.left - handleWidth / 2;
        const rangeWidth = rangeRect.width;

        let newValue: number;
        if (selectedHandle === 'min') {
          newValue = Math.max(min, Math.min(currentMax, (offset / rangeWidth) * (max - min) + min));
          onValuesChange([newValue, currentMax]);
        } else if (selectedHandle === 'max') {
          newValue = Math.min(max, Math.max(currentMin, (offset / rangeWidth) * (max - min) + min));
          onValuesChange([currentMin, newValue]);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setSelectedHandle(null);
      window.removeEventListener('mousemove', handleMouseMove); // Use window
      window.removeEventListener('mouseup', handleMouseUp); // Use window
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove); // Use window
      window.addEventListener('mouseup', handleMouseUp); // Use window
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove); // Clean up
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, currentMin, currentMax, onValuesChange, selectedHandle]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, handle: 'min' | 'max') => {
    setIsDragging(true);
    setSelectedHandle(handle);
    event.preventDefault(); // Prevent text selection during drag
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => { // Corrected this line
    const rangeRect = rangeRef.current?.getBoundingClientRect();
    if (!rangeRect) return;

    const clickPosition = event.clientX - rangeRect.left;
    const clickValue = (clickPosition / rangeRect.width) * (max - min) + min;

    if (Math.abs(clickValue - currentMin) < Math.abs(clickValue - currentMax)) {
      onValuesChange([Math.max(min, Math.min(max, clickValue)), currentMax]);
    } else {
      onValuesChange([currentMin, Math.max(min, Math.min(max, clickValue))]);
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