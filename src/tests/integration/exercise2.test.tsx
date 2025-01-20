import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Exercise2Page from '../../app/exercise2/page';
import { getFixedValues } from '../../mocks/api';

jest.mock('../../mocks/api', () => ({
  getFixedValues: jest.fn(),
}));

describe('Exercise2Page', () => {
  it('obtener valores fijos y mostrar el rango correctamente', async () => {
    const mockFixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
    (getFixedValues as jest.Mock).mockResolvedValue(mockFixedValues);

    render(<Exercise2Page />);

    // Verificar loading
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Esperamos la API
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).toBeNull());

    // Verificar que los valores mínimos y máximos se muestran correctamente
    expect(screen.getByLabelText('min-value')).toHaveTextContent('1.99€');
    expect(screen.getByLabelText('max-value')).toHaveTextContent('70.99€');
  });


});
