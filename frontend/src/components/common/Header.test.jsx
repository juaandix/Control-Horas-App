
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

// Mock del contexto de autenticación
jest.mock('../../context/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Header Component', () => {
  test('debe mostrar el enlace "Iniciar Sesión" cuando el usuario no está autenticado', () => {
    useAuth.mockReturnValue({ user: null });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  test('debe mostrar el saludo y el botón de "Cerrar Sesión" cuando el usuario está autenticado', () => {
    const mockUser = { nombre: 'Juan Test' };
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(`Bienvenido, ${mockUser.nombre}`)).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  test('debe llamar a logout y navegar al hacer clic en "Cerrar Sesión"', () => {
    const mockUser = { nombre: 'Juan Test' };
    const mockLogout = jest.fn();
    const mockNavigate = jest.fn();

    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
