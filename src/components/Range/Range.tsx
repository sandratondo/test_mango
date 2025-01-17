'use client';
import React, { useState, useEffect, useRef, MouseEvent as ReactMouseEvent } from 'react'; // Importar MouseEvent como ReactMouseEvent
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
        const handleMouseMove = (event: globalThis.MouseEvent) => { // Usar globalThis.MouseEvent
            if (isDragging && rangeRef.current) {
                const rangeRect = rangeRef.current.getBoundingClientRect();
                const rangeWidth = rangeRect.width;
                const handleWidth = handleMinRef.current?.offsetWidth || 0;
                const mousePosInTrack = event.clientX - rangeRect.left - handleWidth / 2;
                let newValue = (mousePosInTrack / rangeWidth) * (max - min) + min;

                if (fixedValues) {
                    newValue = fixedValues.reduce((prev, curr) =>
                        Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
                    );
                }

                if (selectedHandle === 'min') {
                    newValue = Math.max(min, Math.min(newValue, currentMax));
                    onValuesChange([newValue, currentMax]);
                } else if (selectedHandle === 'max') {
                    newValue = Math.min(max, Math.max(newValue, currentMin));
                    onValuesChange([currentMin, newValue]);
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

    const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>, handle: 'min' | 'max') => { // Usar ReactMouseEvent
        setIsDragging(true);
        setSelectedHandle(handle);
        event.stopPropagation();
    };

    const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => { // Usar ReactMouseEvent
        if (rangeRef.current) {
            const rangeRect = rangeRef.current.getBoundingClientRect();
            const clickPosition = event.clientX - rangeRect.left;
            let clickValue = (clickPosition / rangeRect.width) * (max - min) + min;

            if (fixedValues) {
                const closestValue = fixedValues.reduce((prev, curr) =>
                    Math.abs(curr - clickValue) < Math.abs(prev - clickValue) ? curr : prev
                );

                if (clickValue > (currentMin + currentMax) / 2) {
                    onValuesChange([currentMin, closestValue]);
                } else {
                    onValuesChange([closestValue, currentMax]);
                }
            } else {
                if (Math.abs(clickValue - currentMin) < Math.abs(clickValue - currentMax)) {
                    onValuesChange([Math.max(min, Math.min(max, clickValue)), currentMax]);
                } else {
                    onValuesChange([currentMin, Math.max(min, Math.min(max, clickValue))]);
                }
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