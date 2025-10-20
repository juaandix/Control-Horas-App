const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const db = require('../config/database');

// Ruta de prueba simple (SIN autenticación)
router.get('/test', (req, res) => {
  res.json({ message: 'Hours API working!' });
});

// 📝 Registrar horas trabajadas (CON autenticación)
router.post('/log', verifyToken, (req, res) => {
  const { fecha, horas_trabajadas, descripcion, proyecto_id, tarea_id } = req.body;
  const empleado_id = req.user.id;

  // Validaciones
  if (!fecha || !horas_trabajadas) {
    return res.status(400).json({ 
      message: 'Fecha y horas trabajadas son requeridas' 
    });
  }

  // Intentar primero sin el campo estado (usar valor por defecto)
  const sql = `INSERT INTO registros_horas 
               (empleado_id, proyecto_id, tarea_id, fecha, horas, descripcion) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  
  const valores = [
    empleado_id,
    proyecto_id || 1,
    tarea_id || null,
    fecha,
    horas_trabajadas,
    descripcion || ''
  ];
  
  db.query(sql, valores, (error, results) => {
    if (error) {
      console.error('Error registrando horas:', error);
      
      // Si falla por el campo estado, intentar con un valor más corto
      if (error.message.includes('estado')) {
        const sqlWithEstado = `INSERT INTO registros_horas 
                              (empleado_id, proyecto_id, tarea_id, fecha, horas, descripcion, estado) 
                              VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        const valoresWithEstado = [
          empleado_id,
          proyecto_id || 1,
          tarea_id || null,
          fecha,
          horas_trabajadas,
          descripcion || '',
          'activo'  // Valor más corto para estado
        ];
        
        db.query(sqlWithEstado, valoresWithEstado, (error2, results2) => {
          if (error2) {
            console.error('Error registrando horas con estado:', error2);
            return res.status(500).json({ 
              message: 'Error registrando horas en la base de datos',
              error: error2.message 
            });
          }
          
          res.status(201).json({ 
            message: 'Horas registradas exitosamente', 
            registro_id: results2.insertId 
          });
        });
      } else {
        return res.status(500).json({ 
          message: 'Error registrando horas en la base de datos',
          error: error.message 
        });
      }
    } else {
      res.status(201).json({ 
        message: 'Horas registradas exitosamente', 
        registro_id: results.insertId 
      });
    }
  });
});

// 📊 Obtener registros del usuario autenticado
router.get('/my-hours', verifyToken, (req, res) => {
  const sql = `SELECT 
                id, 
                fecha, 
                horas as horas_trabajadas, 
                descripcion,
                proyecto_id,
                tarea_id,
                estado,
                created_at
               FROM registros_horas 
               WHERE empleado_id = ? 
               ORDER BY fecha DESC, created_at DESC`;
  
  db.query(sql, [req.user.id], (error, results) => {
    if (error) {
      console.error('Error obteniendo registros:', error);
      return res.status(500).json({ 
        message: 'Error obteniendo registros de horas' 
      });
    }
    res.json(results);
  });
});

// 📈 Obtener resumen de horas por mes
router.get('/summary', verifyToken, (req, res) => {
  const sql = `
    SELECT 
      DATE_FORMAT(fecha, '%Y-%m') as mes,
      SUM(horas) as total_horas,
      COUNT(*) as total_registros
    FROM registros_horas 
    WHERE empleado_id = ?
    GROUP BY DATE_FORMAT(fecha, '%Y-%m')
    ORDER BY mes DESC
  `;
  
  db.query(sql, [req.user.id], (error, results) => {
    if (error) {
      console.error('Error obteniendo resumen:', error);
      return res.status(500).json({ 
        message: 'Error obteniendo resumen de horas' 
      });
    }
    res.json(results);
  });
});

module.exports = router;