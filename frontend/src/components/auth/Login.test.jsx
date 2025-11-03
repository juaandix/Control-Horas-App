
import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './Login';

// Mock de dependencias externas
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Importa y usa las implementaciones reales
  useNavigate: () => jest.fn(), // Mock de useNavigate para que no falle
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(), // Mock de la función login
  }),
}));

describe('Login Component', () => {
  test('debe renderizar el título y el formulario de inicio de sesión', () => {
    render(<Login />);
    
    // Verifica que el título principal se renderiza
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    
    // Verifica que los campos de entrada y el botón están presentes
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });
});
