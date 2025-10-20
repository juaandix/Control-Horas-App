import React, { useState, useEffect } from 'react';
import { hoursService } from '../../services/hours';

const HoursList = () => {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const data = await hoursService.getMyHours();
        setHours(data);
      } catch (err) {
        setError('Error al cargar las horas');
        console.error('Error fetching hours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      return;
    }

    try {
      await hoursService.deleteHours(id);
      setHours(prev => prev.filter(hour => hour.id !== id));
    } catch (err) {
      setError('Error al eliminar el registro');
      console.error('Error deleting hours:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotal = (entry) => {
    return entry.horas_normales + entry.horas_extras;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Cargando registros...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mis Horas Registradas</h1>
        <p style={styles.subtitle}>Historial de horas trabajadas</p>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {hours.length === 0 ? (
        <div style={styles.emptyState}>
          <h3 style={styles.emptyTitle}>No hay registros de horas</h3>
          <p style={styles.emptyText}>
            Aún no has registrado ninguna hora trabajada.
          </p>
          <a href="/log-hours" style={styles.emptyButton}>
            Registrar Primera Hora
          </a>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Horas Normales</th>
                <th style={styles.th}>Horas Extras</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {hours.map((entry) => (
                <tr key={entry.id} style={styles.tr}>
                  <td style={styles.td}>{formatDate(entry.fecha)}</td>
                  <td style={styles.td}>{entry.horas_normales}h</td>
                  <td style={styles.td}>{entry.horas_extras}h</td>
                  <td style={styles.td}>
                    <strong>{calculateTotal(entry)}h</strong>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.description}>
                      {entry.descripcion || 'Sin descripción'}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      style={styles.deleteButton}
                      title="Eliminar registro"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={styles.summary}>
        <h3 style={styles.summaryTitle}>Resumen Total</h3>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <span>Total Horas Normales:</span>
            <strong>
              {hours.reduce((sum, entry) => sum + entry.horas_normales, 0)}h
            </strong>
          </div>
          <div style={styles.summaryItem}>
            <span>Total Horas Extras:</span>
            <strong>
              {hours.reduce((sum, entry) => sum + entry.horas_extras, 0)}h
            </strong>
          </div>
          <div style={styles.summaryItem}>
            <span>Total General:</span>
            <strong style={styles.totalGeneral}>
              {hours.reduce((sum, entry) => sum + calculateTotal(entry), 0)}h
            </strong>
          </div>
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
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.1rem',
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
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  emptyText: {
    color: '#7f8c8d',
    marginBottom: '2rem'
  },
  emptyButton: {
    display: 'inline-block',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: '2rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: 'bold'
  },
  tr: {
    borderBottom: '1px solid #ecf0f1'
  },
  td: {
    padding: '1rem',
    verticalAlign: 'top'
  },
  description: {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.5rem'
  },
  summary: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  summaryTitle: {
    fontSize: '1.2rem',
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #ecf0f1'
  },
  totalGeneral: {
    color: '#27ae60',
    fontSize: '1.1rem'
  }
};

export default HoursList;
