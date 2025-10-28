import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import HoursList from './HoursList';
import { hoursService } from '../../services/hours';

jest.mock('../../services/hours');

describe('HoursList', () => {
  let confirmMock;
  const mockHours = [
    {
      id: 1,
      fecha: '2024-06-01',
      horas_normales: 8,
      horas_extras: 2,
      descripcion: 'Trabajo normal'
    },
    {
      id: 2,
      fecha: '2024-06-02',
      horas_normales: 7,
      horas_extras: 1,
      descripcion: ''
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    confirmMock = jest.spyOn(window, 'confirm');
  });

  afterEach(() => {
    confirmMock.mockRestore();
  });

  it('muestra estado de carga inicialmente', async () => {
    hoursService.getMyHours.mockResolvedValue([]);
    const { getByText } = render(<HoursList />);
    expect(getByText('Cargando registros...')).toBeInTheDocument();
  });

  it('muestra error si falla la carga', async () => {
    hoursService.getMyHours.mockRejectedValue(new Error('fail'));
    const { findByText } = render(<HoursList />);
    expect(await findByText('Error al cargar las horas')).toBeInTheDocument();
  });

  it('muestra estado vacío si no hay registros', async () => {
    hoursService.getMyHours.mockResolvedValue([]);
    const { findByText } = render(<HoursList />);
    expect(await findByText('No hay registros de horas')).toBeInTheDocument();
    expect(await findByText('Registrar Primera Hora')).toBeInTheDocument();
  });

  it('renderiza la tabla con datos', async () => {
    hoursService.getMyHours.mockResolvedValue(mockHours);
    const { findByText, findAllByText } = render(<HoursList />);
    expect(await findByText('Mis Horas Registradas')).toBeInTheDocument();
    expect(await findByText('Trabajo normal')).toBeInTheDocument();
    expect(await findByText('Sin descripción')).toBeInTheDocument();
    expect((await findAllByText('8h')).length).toBe(2);
    expect((await findAllByText('2h')).length).toBe(1);
    expect((await findAllByText('10h')).length).toBe(1);
  });

  it('no elimina si se cancela confirmación', async () => {
    hoursService.getMyHours.mockResolvedValue(mockHours);
    confirmMock.mockReturnValue(false);
    const { findAllByTitle } = render(<HoursList />);
    const deleteButtons = await findAllByTitle('Eliminar registro');
    fireEvent.click(deleteButtons[0]);
    expect(hoursService.deleteHours).not.toHaveBeenCalled();
  });

  it('elimina registro si se confirma', async () => {
    hoursService.getMyHours.mockResolvedValue(mockHours);
    hoursService.deleteHours.mockResolvedValue({});
    confirmMock.mockReturnValue(true);
    const { findAllByTitle, queryByText } = render(<HoursList />);
    const deleteButtons = await findAllByTitle('Eliminar registro');
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(hoursService.deleteHours).toHaveBeenCalledWith(1);
      expect(queryByText('Trabajo normal')).not.toBeInTheDocument();
    });
  });

  it('muestra error si falla la eliminación', async () => {
    hoursService.getMyHours.mockResolvedValue(mockHours);
    hoursService.deleteHours.mockRejectedValue(new Error('fail'));
    confirmMock.mockReturnValue(true);
    const { findAllByTitle, findByText } = render(<HoursList />);
    const deleteButtons = await findAllByTitle('Eliminar registro');
    fireEvent.click(deleteButtons[0]);
    expect(await findByText('Error al eliminar el registro')).toBeInTheDocument();
  });

  it('calcula correctamente el resumen total', async () => {
    hoursService.getMyHours.mockResolvedValue(mockHours);
    const { findByText } = render(<HoursList />);
    expect(await findByText('15h')).toBeInTheDocument(); // Total Horas Normales
    expect(await findByText('3h')).toBeInTheDocument();  // Total Horas Extras
    expect(await findByText('18h')).toBeInTheDocument(); // Total General
  });

  it('usa "Sin descripción" si no hay descripción', async () => {
    hoursService.getMyHours.mockResolvedValue([mockHours[1]]);
    const { findByText } = render(<HoursList />);
    expect(await findByText('Sin descripción')).toBeInTheDocument();
  });

  it('formatea la fecha correctamente', async () => {
    hoursService.getMyHours.mockResolvedValue([mockHours[0]]);
    const { findByText } = render(<HoursList />);
    expect(await findByText(/1 de junio de 2024/i)).toBeInTheDocument();
  });

  it('calcula el total por registro correctamente', async () => {
    hoursService.getMyHours.mockResolvedValue([mockHours[0]]);
    const { findAllByText } = render(<HoursList />);
    expect((await findAllByText('10h')).length).toBe(2);
  });
});