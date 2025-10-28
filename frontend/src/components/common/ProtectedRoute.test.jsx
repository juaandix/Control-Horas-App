
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

// Mock del contexto de autenticación
jest.mock('../../context/AuthContext');

describe('ProtectedRoute Component', () => {
  test('debe mostrar "Cargando..." mientras el estado de autenticación se verifica', () => {
    useAuth.mockReturnValue({ loading: true, user: null });

    render(<ProtectedRoute><div>Contenido Protegido</div></ProtectedRoute>);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  test('debe renderizar el contenido protegido si el usuario está autenticado', () => {
    useAuth.mockReturnValue({ loading: false, user: { nombre: 'Usuario de Prueba' } });

    render(
      <ProtectedRoute>
        <div>Contenido Protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Contenido Protegido')).toBeInTheDocument();
  });

  test('debe redirigir a /login si el usuario no está autenticado', () => {
    useAuth.mockReturnValue({ loading: false, user: null });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Página de Login</div>} />
          <Route path="/protected" element={<ProtectedRoute><div>Contenido Protegido</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Página de Login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument();
  });
});
