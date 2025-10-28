
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import HoursLog from './HoursLog';
import { hoursService } from '../../services/hours';

// Mock de servicios y hooks
jest.mock('../../services/hours.js');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('HoursLog Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.useFakeTimers(); // Habilitar timers falsos
  });

  afterEach(() => {
    jest.useRealTimers(); // Restaurar timers reales
  });

  test('debe renderizar el formulario de registro de horas', () => {
    render(<HoursLog />, { wrapper: MemoryRouter });

    expect(screen.getByRole('heading', { name: /registrar horas/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/horas normales/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/horas extras/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar horas/i })).toBeInTheDocument();
  });

  test('debe registrar horas exitosamente y redirigir', async () => {
    hoursService.logHours.mockResolvedValue({ message: 'Éxito' });

    render(<HoursLog />, { wrapper: MemoryRouter });

    // Simular entrada de usuario
    fireEvent.change(screen.getByLabelText(/descripción/i), { target: { value: 'Trabajo en el proyecto X' } });
    fireEvent.click(screen.getByRole('button', { name: /registrar horas/i }));

    await waitFor(() => {
      expect(hoursService.logHours).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText('Horas registradas exitosamente')).toBeInTheDocument();

    // Avanzar el temporizador
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/my-hours');
    });
  });

  test('debe mostrar un mensaje de error si falla el registro', async () => {
    hoursService.logHours.mockRejectedValue({ response: { data: { message: 'Error de prueba' } } });

    render(<HoursLog />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole('button', { name: /registrar horas/i }));

    await waitFor(() => {
      expect(screen.getByText('Error de prueba')).toBeInTheDocument();
    });
  });
});
