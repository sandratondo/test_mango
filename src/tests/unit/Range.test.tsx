import { render, screen, fireEvent } from '@testing-library/react';
import Range from '@/components/Range/Range';

describe('Range Component', () => {
  const mockOnValuesChange = jest.fn();

  it('renders correctly with initial props', () => {
    render(
      <Range
        min={0}
        max={100}
        values={[20, 80]}
        onValuesChange={mockOnValuesChange}
      />
    );

    // Verificar que los valores iniciales se muestran correctamente
    expect(screen.getByText('20.00€')).toBeInTheDocument();
    expect(screen.getByText('80.00€')).toBeInTheDocument();
  });

  it('handles dragging the minimum handle', () => {
    render(
      <Range
        min={0}
        max={100}
        values={[20, 80]}
        onValuesChange={mockOnValuesChange}
      />
    );

    const minHandle = screen.getByText('20.00€');
    fireEvent.mouseDown(minHandle);

    // Simular movimiento del mouse
    fireEvent.mouseMove(document, { clientX: 50 });
    fireEvent.mouseUp(document);

    // Verificar que la función de actualización fue llamada
    expect(mockOnValuesChange).toHaveBeenCalled();
  });

  it('handles dragging the maximum handle', () => {
    render(
      <Range
        min={0}
        max={100}
        values={[20, 80]}
        onValuesChange={mockOnValuesChange}
      />
    );

    const maxHandle = screen.getByText('80.00€');
    fireEvent.mouseDown(maxHandle);

    // Simular movimiento del mouse
    fireEvent.mouseMove(document, { clientX: 150 });
    fireEvent.mouseUp(document);

    // Verificar que la función de actualización fue llamada
    expect(mockOnValuesChange).toHaveBeenCalled();
  });

  it('does not allow handles to cross each other', () => {
    render(
      <Range
        min={0}
        max={100}
        values={[20, 80]}
        onValuesChange={mockOnValuesChange}
      />
    );

    const minHandle = screen.getByText('20.00€');
    fireEvent.mouseDown(minHandle);

    // Intentar mover el mínimo más allá del máximo
    fireEvent.mouseMove(document, { clientX: 200 });
    fireEvent.mouseUp(document);

    // Verificar que no se cruzan
    expect(mockOnValuesChange).toHaveBeenLastCalledWith([20, 80]);
  });

  it('displays correct values when using fixedValues', () => {
    render(
      <Range
        min={0}
        max={100}
        fixedValues={[10, 20, 30, 40, 50]}
        values={[20, 40]}
        onValuesChange={mockOnValuesChange}
      />
    );

    // Verificar que se muestran los valores fijos
    expect(screen.getByText('20.00€')).toBeInTheDocument();
    expect(screen.getByText('40.00€')).toBeInTheDocument();
  });

  it('snaps to the closest fixed value', () => {
    render(
      <Range
        min={0}
        max={100}
        fixedValues={[10, 20, 30, 40, 50]}
        values={[20, 40]}
        onValuesChange={mockOnValuesChange}
      />
    );

    const minHandle = screen.getByText('20.00€');
    fireEvent.mouseDown(minHandle);

    // Simular arrastre a un valor intermedio
    fireEvent.mouseMove(document, { clientX: 35 }); // Aproximado entre 20 y 30
    fireEvent.mouseUp(document);

    // Verificar que se ajusta al valor más cercano
    expect(mockOnValuesChange).toHaveBeenLastCalledWith([30, 40]);
  });
});
