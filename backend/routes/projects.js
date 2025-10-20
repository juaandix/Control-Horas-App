const express = require('express');
const db = require('../config/database');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener todos los proyectos
router.get('/', (req, res) => {
  db.query(`
    SELECT p.*, c.nombre as cliente_nombre 
    FROM proyectos p 
    LEFT JOIN clientes c ON p.cliente_id = c.id
    ORDER BY p.nombre
  `, (error, results) => {
    if (error) {
      console.error('Error obteniendo proyectos:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    res.json(results);
  });
});

// Obtener un proyecto específico
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.query(`
    SELECT p.*, c.nombre as cliente_nombre 
    FROM proyectos p 
    LEFT JOIN clientes c ON p.cliente_id = c.id
    WHERE p.id = ?
  `, [id], (error, results) => {
    if (error) {
      console.error('Error obteniendo proyecto:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    res.json(results[0]);
  });
});

// Crear un nuevo proyecto
router.post('/', (req, res) => {
  const { nombre, descripcion, cliente_id, fecha_inicio, fecha_fin_estimada, presupuesto } = req.body;
  
  // Validaciones básicas
  if (!nombre || !cliente_id) {
    return res.status(400).json({ message: 'Nombre y cliente son requeridos' });
  }
  
  db.query(
    'INSERT INTO proyectos (nombre, descripcion, cliente_id, fecha_inicio, fecha_fin_estimada, presupuesto) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, descripcion, cliente_id, fecha_inicio, fecha_fin_estimada, presupuesto],
    (error, results) => {
      if (error) {
        console.error('Error creando proyecto:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      
      res.status(201).json({ 
        message: 'Proyecto creado exitosamente', 
        id: results.insertId 
      });
    }
  );
});

// Actualizar un proyecto
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, cliente_id, fecha_inicio, fecha_fin_estimada, estado, presupuesto } = req.body;
  
  db.query(
    'UPDATE proyectos SET nombre = ?, descripcion = ?, cliente_id = ?, fecha_inicio = ?, fecha_fin_estimada = ?, estado = ?, presupuesto = ? WHERE id = ?',
    [nombre, descripcion, cliente_id, fecha_inicio, fecha_fin_estimada, estado, presupuesto, id],
    (error, results) => {
      if (error) {
        console.error('Error actualizando proyecto:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
      
      res.json({ message: 'Proyecto actualizado exitosamente' });
    }
  );
});

// Eliminar un proyecto (cambiar estado a cancelado)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.query(
    'UPDATE proyectos SET estado = "cancelado" WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error eliminando proyecto:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
      
      res.json({ message: 'Proyecto eliminado exitosamente' });
    }
  );
});

// Obtener tareas de un proyecto específico
router.get('/:id/tasks', (req, res) => {
  const { id } = req.params;
  
  db.query(
    'SELECT * FROM tareas WHERE proyecto_id = ? ORDER BY nombre',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error obteniendo tareas:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
      
      res.json(results);
    }
  );
});

module.exports = router;