const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const router = express.Router();

// Ruta de registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, puesto } = req.body;
    
    // Verificar si el usuario ya existe
    db.query(
      'SELECT * FROM empleados WHERE email = ?',
      [email],
      async (error, results) => {
        if (error) {
          console.error('Error en consulta:', error);
          return res.status(500).json({ message: 'Error en el servidor' });
        }
        
        if (results.length > 0) {
          return res.status(400).json({ message: 'El usuario ya existe' });
        }
        
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insertar nuevo usuario
        db.query(
          'INSERT INTO empleados (nombre, email, password, puesto) VALUES (?, ?, ?, ?)',
          [nombre, email, hashedPassword, puesto],
          (error, results) => {
            if (error) {
              console.error('Error creando usuario:', error);
              return res.status(500).json({ message: 'Error en el servidor' });
            }
            
            // Generar token JWT
            const token = jwt.sign(
              { id: results.insertId, email },
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRE }
            );
            
            res.status(201).json({
              message: 'Usuario creado exitosamente',
              token,
              user: { id: results.insertId, nombre, email, puesto }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verificar si el usuario existe
    db.query(
      'SELECT * FROM empleados WHERE email = ?',
      [email],
      async (error, results) => {
        if (error) {
          console.error('Error en consulta:', error);
          return res.status(500).json({ message: 'Error en el servidor' });
        }
        
        if (results.length === 0) {
          return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        
        const user = results[0];
        
        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        
        // Generar token JWT
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
        );
        
        res.json({
          message: 'Login exitoso',
          token,
          user: { id: user.id, nombre: user.nombre, email: user.email, puesto: user.puesto }
        });
      }
    );
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
