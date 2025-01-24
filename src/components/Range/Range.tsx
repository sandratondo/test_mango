'use client';
import React, { useState, useEffect, useRef, MouseEvent as ReactMouseEvent } from 'react';
import styles from './styles.module.css';

//propiedades que recibe
interface RangeProps {
  min: number;
  max: number;
  fixedValues?: number[];
  values: [number, number];
  onValuesChange: (values: [number, number]) => void; //actualiza valores
}

const Range: React.FC<RangeProps> = ({
  min,
  max,
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

  //para manejar eventos
  useEffect(() => {
    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      if (isDragging && rangeRef.current) {
        const rangeRect = rangeRef.current.getBoundingClientRect();
        const rangeWidth = rangeRect.width;
        const handleWidth = handleMinRef.current?.offsetWidth || 0;
  
        // Detectar posición ratón o táctil
        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        let mousePosInTrack = clientX - rangeRect.left - handleWidth / 2;
  
        //valores fijos ej.2 ajusta a los más cercanos
        if (fixedValues) {
          const realMin = fixedValues[0];
          const realMax = fixedValues[fixedValues.length - 1];
          let newPosition = (mousePosInTrack / rangeWidth) * 100;
          const visualMin = getHandlePosition(realMin);
          const visualMax = getHandlePosition(realMax);
          newPosition = Math.max(visualMin, Math.min(newPosition, visualMax)); //para no sobre pasar rango visual
          setDragPosition(newPosition);
  
          //actualizar valores 
          const newValueInRange = realMin + (newPosition / 100) * (realMax - realMin);
          if (selectedHandle === 'min') {
            onValuesChange([newValueInRange, currentMax]);
          } else if (selectedHandle === 'max') {
            onValuesChange([currentMin, newValueInRange]);
          }

        } else {
          //rango normal ej.1
          let newPosition = (mousePosInTrack / rangeWidth) * 100;
          newPosition = Math.max(0, Math.min(newPosition, 100));
          setDragPosition(newPosition);

          const rangeDiff = max - min;
          let newValue = min + (newPosition / 100) * rangeDiff;

          if (selectedHandle === 'min') {
            newValue = Math.max(min, Math.min(newValue, currentMax)); // Ajusta al valor máximo permitido
            onValuesChange([newValue, currentMax]);
          } else if (selectedHandle === 'max') {
            newValue = Math.min(max, Math.max(newValue, currentMin)); // Ajusta al valor mínimo permitido
            onValuesChange([currentMin, newValue]);
          }
        }
      }
    };

    // Maneja el evento de soltar 
    const handlePointerUp = () => {
      setIsDragging(false);
      setSelectedHandle(null);
      document.body.style.cursor = 'default';
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      setDragPosition(null);

      // Ajusta al valor fijo más cercano
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

    // Agregar listeners si arrastrando
    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
    }

    // Limpiar listeners
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, fixedValues, currentMin, currentMax, onValuesChange, selectedHandle, dragPosition]);

  // Inicia el arrastre
  const handlePointerDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    handle: 'min' | 'max'
  ) => {
    setIsDragging(true);
    setSelectedHandle(handle);

    event.stopPropagation();
  };

  // Calcula la posición visual
  const getHandlePosition = (value: number) => {
    if (!fixedValues) return ((value - min) / (max - min)) * 100;
    const realMin = fixedValues[0];
    const realMax = fixedValues[fixedValues.length - 1];
    return ((value - realMin) / (realMax - realMin)) * 100;
  };

  // Obtiene el valor mostrado
  const getDisplayedValue = (handle: 'min' | 'max') => {
    if (isDragging && selectedHandle === handle && dragPosition !== null) {
      const rangeDiff = max - min;
      const newValue = min + (dragPosition / 100) * rangeDiff;

      if (handle === 'min') {
        return Math.min(newValue, currentMax);
      } else {
        return Math.max(newValue, currentMin);
      }
    }

    return handle === 'min' ? currentMin : currentMax;
  };

  //mostrar el pito de puntero
  const getHandleStyle = (handle: 'min' | 'max') => {
    const position =
      isDragging && selectedHandle === handle && dragPosition !== null
        ? dragPosition
        : getHandlePosition(handle === 'min' ? currentMin : currentMax);
    return { left: `${position}%` };
  };

  return (
    <div className={styles.rangeContainer} ref={rangeRef} data-testid="range-component">
      <div className={styles.rangeTrack} />
      <div
        ref={handleMinRef}
        className={`${styles.rangeHandle} ${selectedHandle === 'min' ? styles.activeHandle : ''}`}
        style={getHandleStyle('min')}
        onMouseDown={(e) => handlePointerDown(e, 'min')}
        onTouchStart={(e) => handlePointerDown(e, 'min')}
        role="slider"
        aria-label="min"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={getDisplayedValue('min')}
        data-testid="handle-min"
      >
        <span className={styles.handleLabel} style={{ marginLeft: '-12px' }}>
          {getDisplayedValue('min').toFixed(2)}€
        </span>
      </div>
      <div
        ref={handleMaxRef}
        className={`${styles.rangeHandle} ${selectedHandle === 'max' ? styles.activeHandle : ''}`}
        style={getHandleStyle('max')}
        onMouseDown={(e) => handlePointerDown(e, 'max')}
        onTouchStart={(e) => handlePointerDown(e, 'max')}
        role="slider"
        aria-label="max"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={getDisplayedValue('max')}
        data-testid="handle-max"
      >
        <span className={styles.handleLabel} style={{ marginLeft: '12px' }}>
          {getDisplayedValue('max').toFixed(2)}€
        </span>
      </div>
    </div>
  );
};

export default Range;
