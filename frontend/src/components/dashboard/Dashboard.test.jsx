
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useAuth } from '../../context/AuthContext';
import { hoursService } from '../../services/hours';

// Mock de servicios y contextos
jest.mock('../../context/AuthContext');
jest.mock('../../services/hours.js');

describe('Dashboard Component', () => {
  const mockUser = { nombre: 'Juan Test' };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
  });

  test('debe mostrar el estado de carga inicialmente', () => {
    hoursService.getSummary.mockReturnValue(new Promise(() => {})); // Promesa que nunca se resuelve
    render(<Dashboard />, { wrapper: MemoryRouter });
    expect(screen.getByText('Cargando dashboard...')).toBeInTheDocument();
  });

  test('debe mostrar el resumen de horas cuando la carga es exitosa', async () => {
    const mockSummary = {
      currentWeekHours: 10,
      currentMonthHours: 40,
      totalEntries: 5,
      averageDailyHours: 2,
    };
    hoursService.getSummary.mockResolvedValue(mockSummary);

    render(<Dashboard />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Horas Esta Semana')).toBeInTheDocument();
    expect(screen.getByText('10h')).toBeInTheDocument();
    expect(screen.getByText('Horas Este Mes')).toBeInTheDocument();
    expect(screen.getByText('40h')).toBeInTheDocument();
  });

  test('debe mostrar un mensaje de error si la carga del resumen falla', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    hoursService.getSummary.mockRejectedValue(new Error('Error de red'));

    render(<Dashboard />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.queryByText('Cargando dashboard...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Error al cargar el resumen')).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});
