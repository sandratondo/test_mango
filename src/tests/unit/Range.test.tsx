import React from 'react';
import Range from '../../components/Range/Range';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('Range Component', () => {
  it('renderiza rango normal props', () => {
    const props = {
      min: 1.0,
      max: 500.0,
      values: [25.0, 75.0] as [number, number],
      onValuesChange: jest.fn(),
    };

    render(<Range {...props} />);

    expect(screen.getByRole('slider', { name: 'min' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'max' })).toBeInTheDocument();
    expect(screen.getByText('25.00€')).toBeInTheDocument();
    expect(screen.getByText('75.00€')).toBeInTheDocument();
  });

  it('actualiza los valores al arrastrar los controles', () => {
    const onValuesChangeMock = jest.fn();
    const props = {
      min: 1,
      max: 500,
      values: [25, 75] as [number, number],
      onValuesChange: onValuesChangeMock,
    };

    render(<Range {...props} />);

    const handleMin = screen.getByTestId('handle-min');
    const handleMax = screen.getByTestId('handle-max');

    fireEvent.mouseDown(handleMin);

    const rangeRect = handleMin.parentElement!.getBoundingClientRect();
    const clientX = rangeRect.left + 100;
    fireEvent.mouseMove(document.body, { clientX });
    fireEvent.mouseUp(document.body);

    expect(onValuesChangeMock).toHaveBeenCalled();
  });

  it('valores fijos', () => {
    const fixedValues = [10, 50, 100, 200, 500];
    const props = {
      min: 10,
      max: 500,
      fixedValues,
      values: [50, 200] as [number, number],
      onValuesChange: jest.fn(),
    };

    render(<Range {...props} />);

    expect(screen.getByRole('slider', { name: 'min' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'max' })).toBeInTheDocument();
    expect(screen.getByText('50.00€')).toBeInTheDocument();
    expect(screen.getByText('200.00€')).toBeInTheDocument();
  });

  it('ajustar al valor fijo más cercano al arrastrar', async () => {
    const onValuesChangeMock = jest.fn();
    const props = {
        min: 10,
        max: 500,
        fixedValues: [10, 100, 200, 300, 400, 500], // Define valores fijos
        values: [50, 200] as [number, number], 
        onValuesChange: onValuesChangeMock,
      };
      
    render(<Range {...props} />);
  
    const handleMin = screen.getByTestId('handle-min');
    fireEvent.mouseDown(handleMin);
  
    // Simula un arrastre hacia un valor fijo cercano (100)
    fireEvent.mouseMove(document.body, { clientX: 150 });
    fireEvent.mouseUp(document.body);
  
    // Verifica si ajusta al valor fijo más cercano
    await waitFor(() => expect(onValuesChangeMock).toHaveBeenCalledWith([500, 200]));
  });
  

  it('no permite que el identificador mínimo exceda el identificador máximo', () => {
    const onValuesChangeMock = jest.fn();
    const props = {
        min: 10,
        max: 500,
        values: [200, 200] as [number, number], 
        onValuesChange: onValuesChangeMock,
      };
      
    render(<Range {...props} />);
  
    const handleMin = screen.getByTestId('handle-min');
    fireEvent.mouseDown(handleMin);
  
    // Simula un intento de mover el mínimo más allá del máximo
    fireEvent.mouseMove(document.body, { clientX: 300 });
    fireEvent.mouseUp(document.body);
  
    expect(onValuesChangeMock).toHaveBeenCalledWith([200, 200]); // El mínimo no debe exceder el máximo
  });
  
  
  it('garantiza que los atributos de accesibilidad estén configurados correctamente', () => {
    const props = {
      min: 1,
      max: 500,
      values: [25, 75] as [number, number],
      onValuesChange: jest.fn(),
    };

    render(<Range {...props} />);

    const handleMin = screen.getByRole('slider', { name: 'min' });
    const handleMax = screen.getByRole('slider', { name: 'max' });

    expect(handleMin).toHaveAttribute('aria-valuemin', '1');
    expect(handleMin).toHaveAttribute('aria-valuemax', '500');
    expect(handleMin).toHaveAttribute('aria-valuenow', '25');
    expect(handleMax).toHaveAttribute('aria-valuemin', '1');
    expect(handleMax).toHaveAttribute('aria-valuemax', '500');
    expect(handleMax).toHaveAttribute('aria-valuenow', '75');
  });
});
