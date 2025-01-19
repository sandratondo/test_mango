import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Exercise2Page from '@/app/exercise2/page'; 
import * as api from '@/mocks/api'; 

// Mock de la API
jest.mock('@/app/mocks/api');

describe('Exercise2Page', () => {
  it('should render and display loading state initially', () => {
    render(<Exercise2Page />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument(); // Comprobamos si muestra el texto de carga
  });

  it('should display range values after fetching data', async () => {
    // Simulamos que la función getFixedValues devuelve valores
    (api.getFixedValues as jest.Mock).mockResolvedValue([1.99, 5.99, 10.99, 30.99, 50.99, 70.99]);

    render(<Exercise2Page />);

    // Esperamos a que los datos se carguen y luego comprobamos los valores
    await waitFor(() => expect(screen.getByText('1.99€')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('70.99€')).toBeInTheDocument());
  });

  it('should update values when interacting with the range slider', async () => {
    // Simulamos que la función getFixedValues devuelve valores
    (api.getFixedValues as jest.Mock).mockResolvedValue([1.99, 5.99, 10.99, 30.99, 50.99, 70.99]);

    render(<Exercise2Page />);

    // Esperamos a que los datos se carguen
    await waitFor(() => expect(screen.getByText('1.99€')).toBeInTheDocument());

    // Simulamos el cambio de valores
    fireEvent.change(screen.getByRole('slider'), { target: { value: 20 } });

    // Verificamos que los valores han cambiado
    await waitFor(() => expect(screen.getByText('20.00€')).toBeInTheDocument());
  });
});
