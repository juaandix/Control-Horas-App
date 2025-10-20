const express = require('express');
const db = require('../config/database');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken);

// Obtener todos los empleados
router.get('/', (req, res) => {
  db.query('SELECT id, nombre, email, puesto, fecha_contratacion, activo FROM empleados', (error, results) => {
    if (error) {
      console.error('Error obteniendo empleados:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    res.json(results);
  });
});

// Obtener un empleado específico
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.query(
    'SELECT id, nombre, email, puesto, fecha_contratacion, activo FROM empleados WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error obteniendo empleado:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
      
      res.json(results[0]);
    }
  );
});

// Crear un nuevo empleado
router.post('/', (req, res) => {
  const { nombre, email, puesto, fecha_contratacion } = req.body;
  
  db.query(
    'INSERT INTO empleados (nombre, email, puesto, fecha_contratacion) VALUES (?, ?, ?, ?)',
    [nombre, email, puesto, fecha_contratacion],
    (error, results) => {
      if (error) {
        console.error('Error creando empleado:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      
      res.status(201).json({ 
        message: 'Empleado creado exitosamente', 
        id: results.insertId 
      });
    }
  );
});

// Actualizar un empleado
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, puesto, fecha_contratacion, activo } = req.body;
  
  db.query(
    'UPDATE empleados SET nombre = ?, email = ?, puesto = ?, fecha_contratacion = ?, activo = ? WHERE id = ?',
    [nombre, email, puesto, fecha_contratacion, activo, id],
    (error, results) => {
      if (error) {
        console.error('Error actualizando empleado:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
      
      res.json({ message: 'Empleado actualizado exitosamente' });
    }
  );
});

// Eliminar (desactivar) un empleado
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.query(
    'UPDATE empleados SET activo = FALSE WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error desactivando empleado:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
      
      res.json({ message: 'Empleado desactivado exitosamente' });
    }
  );
});

module.exports = router;
