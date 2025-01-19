import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Exercise1Page from '@/app/exercise1/page'; 
import * as api from '@/mocks/api'; 

// Mock de la API
jest.mock('@/app/mocks/api');

describe('Exercise1Page', () => {
  it('should render and display loading state initially', () => {
    render(<Exercise1Page />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument(); // Comprobamos si muestra el texto de carga
  });

  it('should display range values after fetching data', async () => {
    // Simulamos que la función getNormalRange devuelve valores
    (api.getNormalRange as jest.Mock).mockResolvedValue({ min: 1.00, max: 500.00 });

    render(<Exercise1Page />);

    // Esperamos a que los datos se carguen y luego comprobamos los valores
    await waitFor(() => expect(screen.getByText('1.00€')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('500.00€')).toBeInTheDocument());
  });

  it('should update values when interacting with the range slider', async () => {
    // Simulamos que la función getNormalRange devuelve valores
    (api.getNormalRange as jest.Mock).mockResolvedValue({ min: 1.00, max: 500.00 });

    render(<Exercise1Page />);

    // Esperamos a que los datos se carguen
    await waitFor(() => expect(screen.getByText('1.00€')).toBeInTheDocument());

    // Simulamos el cambio de valores
    fireEvent.change(screen.getByRole('slider'), { target: { value: 100 } });

    // Verificamos que los valores han cambiado
    await waitFor(() => expect(screen.getByText('100.00€')).toBeInTheDocument());
  });
});
