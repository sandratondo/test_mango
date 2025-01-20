import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Exercise1Page from '../../app/exercise1/page';
import { getNormalRange } from '../../mocks/api';

jest.mock('../../mocks/api', () => ({
  getNormalRange: jest.fn(),
}));

describe('Exercise1Page', () => {
  it('debe obtener los valores de rango y mostrarlos correctamente', async () => {
    // Mock para devolver un rango de valores
    (getNormalRange as jest.Mock).mockResolvedValue({ min: 1.00, max: 500.00 });

    render(<Exercise1Page />);

    // Verificar que el texto Loading
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Esperar a que se resuelvan los valores
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).toBeNull());

    // Verificar que los valores de min y max son correctos
    expect(screen.getByTestId('min-value')).toHaveTextContent('1.00€');
    expect(screen.getByTestId('max-value')).toHaveTextContent('500.00€');
  });


});
