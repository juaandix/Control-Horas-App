import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          Control Horas
        </Link>
        
        <nav style={styles.nav}>
          {user ? (
            <>
              <span style={styles.welcome}>Bienvenido, {user.nombre}</span>
              <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
              <Link to="/log-hours" style={styles.navLink}>Registrar Horas</Link>
              <Link to="/my-hours" style={styles.navLink}>Mis Horas</Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.navLink}>Iniciar Sesión</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  welcome: {
    marginRight: '1rem'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Header;
