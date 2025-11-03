import React, { useState } from 'react';
import { hoursService } from '../../services/hours';
import { useNavigate } from 'react-router-dom';

const HoursLog = () => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    horas_normales: 8,
    horas_extras: 0,
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'horas_normales' || name === 'horas_extras' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await hoursService.logHours(formData);
      setSuccess('Horas registradas exitosamente');
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        horas_normales: 8,
        horas_extras: 0,
        descripcion: ''
      });
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/my-hours');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar horas');
    } finally {
      setLoading(false);
    }
  };

  const totalHoras = formData.horas_normales + formData.horas_extras;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Registrar Horas</h1>
        <p style={styles.subtitle}>Registra tus horas trabajadas</p>
      </div>

      <div style={styles.formContainer}>
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="fecha" style={styles.label}>Fecha:</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label htmlFor="horas_normales" style={styles.label}>Horas Normales:</label>
              <input
                type="number"
                id="horas_normales"
                name="horas_normales"
                value={formData.horas_normales}
                onChange={handleChange}
                min="0"
                max="24"
                step="0.5"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="horas_extras" style={styles.label}>Horas Extras:</label>
              <input
                type="number"
                id="horas_extras"
                name="horas_extras"
                value={formData.horas_extras}
                onChange={handleChange}
                min="0"
                max="24"
                step="0.5"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.totalHours}>
            <strong>Total de horas: {totalHoras}h</strong>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="descripcion" style={styles.label}>Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe las actividades realizadas..."
              rows="4"
              style={styles.textarea}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading && styles.submitButtonDisabled)
              }}
            >
              {loading ? 'Registrando...' : 'Registrar Horas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
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
  formContainer: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: 'bold',
    color: '#34495e',
    fontSize: '0.9rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
    width: '100%'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
    width: '100%',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  totalHours: {
    padding: '1rem',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#2c3e50'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem'
  },
  cancelButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  submitButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
    cursor: 'not-allowed'
  },
  error: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  success: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center'
  }
};

export default HoursLog;
