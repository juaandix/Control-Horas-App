import React, { useState, useEffect } from 'react';
import { hoursService } from '../../services/hours';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await hoursService.getSummary();
        setSummary(data);
      } catch (err) {
        setError('Error al cargar el resumen');
        console.error('Error fetching summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Bienvenido de vuelta, {user?.nombre}</p>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Horas Esta Semana</h3>
          <p style={styles.statNumber}>
            {summary?.currentWeekHours || 0}h
          </p>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Horas Este Mes</h3>
          <p style={styles.statNumber}>
            {summary?.currentMonthHours || 0}h
          </p>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Registros</h3>
          <p style={styles.statNumber}>
            {summary?.totalEntries || 0}
          </p>
        </div>

        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Promedio Diario</h3>
          <p style={styles.statNumber}>
            {summary?.averageDailyHours || 0}h
          </p>
        </div>
      </div>

      <div style={styles.actions}>
        <div style={styles.actionCard}>
          <h3 style={styles.actionTitle}>Registrar Horas</h3>
          <p style={styles.actionDescription}>
            Registra las horas trabajadas hoy
          </p>
          <Link to="/log-hours" style={styles.actionButton}>
            Registrar Horas
          </Link>
        </div>

        <div style={styles.actionCard}>
          <h3 style={styles.actionTitle}>Ver Mis Horas</h3>
          <p style={styles.actionDescription}>
            Revisa tu historial de horas registradas
          </p>
          <Link to="/my-hours" style={styles.actionButton}>
            Ver Historial
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#7f8c8d'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#7f8c8d',
    padding: '2rem'
  },
  error: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    borderTop: '4px solid #3498db'
  },
  statTitle: {
    fontSize: '1rem',
    color: '#7f8c8d',
    marginBottom: '1rem'
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: 0
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  actionCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  actionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  actionDescription: {
    color: '#7f8c8d',
    marginBottom: '2rem'
  },
  actionButton: {
    display: 'inline-block',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s'
  }
};

export default Dashboard;
