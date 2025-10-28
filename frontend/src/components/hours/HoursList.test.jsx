import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HoursList from './HoursList';
import { hoursService } from '../../services/hours';

// Mock de servicios y window.confirm
jest.mock('../../services/hours.js');

describe('HoursList Component', () => {
  beforeEach(() => {
    // Mock para console.error para mantener la salida de la prueba limpia
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('debe mostrar el estado de carga inicialmente', () => {
    hoursService.getMyHours.mockReturnValue(new Promise(() => {}));
    render(<HoursList />, { wrapper: MemoryRouter });
    expect(screen.getByText('Cargando registros...')).toBeInTheDocument();
  });

  test('debe mostrar un mensaje de error si la carga falla', async () => {
    hoursService.getMyHours.mockRejectedValue(new Error('Error de red'));
    render(<HoursList />, { wrapper: MemoryRouter });
    expect(await screen.findByText('Error al cargar las horas')).toBeInTheDocument();
  });

  test('debe mostrar un estado vacío si no hay horas registradas', async () => {
    hoursService.getMyHours.mockResolvedValue([]);
    render(<HoursList />, { wrapper: MemoryRouter });
    expect(await screen.findByText('No hay registros de horas')).toBeInTheDocument();
  });

  test('debe mostrar la lista de horas registradas', async () => {
    const mockHours = [
      { id: 1, fecha: '2025-10-27', horas_normales: 8, horas_extras: 1, descripcion: 'Tarea 1' },
      { id: 2, fecha: '2025-10-28', horas_normales: 7, horas_extras: 0, descripcion: 'Tarea 2' },
    ];
    hoursService.getMyHours.mockResolvedValue(mockHours);
    render(<HoursList />, { wrapper: MemoryRouter });

    await waitFor(() => {
        expect(screen.getByText('Tarea 1')).toBeInTheDocument();
        expect(screen.getByText('Tarea 2')).toBeInTheDocument();
    });
  });

  test('debe permitir eliminar un registro de horas', async () => {
    const mockHours = [
      { id: 1, fecha: '2025-10-27', horas_normales: 8, horas_extras: 1, descripcion: 'Tarea 1' },
    ];
    hoursService.getMyHours.mockResolvedValue(mockHours);
    hoursService.deleteHours.mockResolvedValue({});
    window.confirm = jest.fn(() => true); // Mock de window.confirm

    render(<HoursList />, { wrapper: MemoryRouter });

    await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());

    const deleteButton = screen.getByTitle('Eliminar registro');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que quieres eliminar este registro?');
    
    await waitFor(() => {
      expect(hoursService.deleteHours).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByText('Tarea 1')).not.toBeInTheDocument();
    });
  });

  test('muestra correctamente el resumen total', async () => {
    const mockHours = [
      { id: 1, fecha: '2025-10-27', horas_normales: 8, horas_extras: 1, descripcion: 'Tarea 1' },
      { id: 2, fecha: '2025-10-28', horas_normales: 7, horas_extras: 2, descripcion: 'Tarea 2' },
    ];
    hoursService.getMyHours.mockResolvedValue(mockHours);
    render(<HoursList />, { wrapper: MemoryRouter });

    expect(await screen.findByText('15h')).toBeInTheDocument(); // Total Horas Normales
    expect(screen.getByText('3h')).toBeInTheDocument(); // Total Horas Extras
    expect(screen.getByText('18h')).toBeInTheDocument(); // Total General
  });

  test('formatea la fecha correctamente', async () => {
    const mockHours = [
      { id: 1, fecha: '2025-10-27', horas_normales: 8, horas_extras: 1, descripcion: 'Tarea 1' },
    ];
    hoursService.getMyHours.mockResolvedValue(mockHours);
    render(<HoursList />, { wrapper: MemoryRouter });

    expect(await screen.findByText(/27 de octubre de 2025/i)).toBeInTheDocument();
  });

  test('muestra "Sin descripción" si la descripción está vacía', async () => {
    const mockHours = [
      { id: 1, fecha: '2025-10-27', horas_normales: 8, horas_extras: 1, descripcion: '' },
    ];
    hoursService.getMyHours.mockResolvedValue(mockHours);
    render(<HoursList />, { wrapper: MemoryRouter });

    expect(await screen.findByText('Sin descripción')).toBeInTheDocument();
  });

  test('no elimina el registro si se cancela la confirmación', async () => {
    const mockHours = [
      { id: 1, fecha: '2025-10-27', horas_normales: 8, horas_extras: 1, descripcion: 'Tarea 1' },
    ];
    hoursService.getMyHours.mockResolvedValue(mockHours);
    window.confirm = jest.fn(() => false);

    render(<HoursList />, { wrapper: MemoryRouter });

    await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());

    const deleteButton = screen.getByTitle('Eliminar registro');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(hoursService.deleteHours).not.toHaveBeenCalled();
    expect(screen.getByText('Tarea 1')).toBeInTheDocument();
  });

  test('muestra error si falla la eliminación', async () => {
    const mockHours = [
      { id: 1, fecha: '2025-10-27', horas_normales: 8, horas_extras: 1, descripcion: 'Tarea 1' },
    ];
    hoursService.getMyHours.mockResolvedValue(mockHours);
    hoursService.deleteHours.mockRejectedValue(new Error('Error al eliminar'));
    window.confirm = jest.fn(() => true);

    render(<HoursList />, { wrapper: MemoryRouter });

    await waitFor(() => expect(screen.getByText('Tarea 1')).toBeInTheDocument());

    const deleteButton = screen.getByTitle('Eliminar registro');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('Error al eliminar el registro')).toBeInTheDocument();
      expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    });
  });

  test('verifica encabezados y botón de registro', async () => {
    hoursService.getMyHours.mockResolvedValue([]);
    render(<HoursList />, { wrapper: MemoryRouter });

    expect(await screen.findByText('Registrar Primera Hora')).toBeInTheDocument();
    expect(screen.getByText('No hay registros de horas')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Mis Horas Registradas/i })).toBeInTheDocument();
  });
});
