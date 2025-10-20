const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Debug middleware - para ver las peticiones
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Conexión a BD
const db = require('./config/database');

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));

// 🆕 NUEVA RUTA - IMPORTANTE: Verifica que el archivo existe
try {
  app.use('/api/hours', require('./routes/hours'));
  console.log('✅ Rutas de horas cargadas correctamente');
} catch (error) {
  console.error('❌ Error cargando rutas de horas:', error.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    routes: ['/api/auth', '/api/employees', '/api/hours']
  });
});

// Ruta de prueba para hours
app.get('/api/hours/test', (req, res) => {
  res.json({ message: 'Ruta de horas funcionando' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    availableRoutes: ['/api/auth', '/api/employees', '/api/hours', '/api/health']
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
  console.log('📋 Rutas disponibles:');
  console.log('   - /api/auth');
  console.log('   - /api/employees'); 
  console.log('   - /api/hours');
  console.log('   - /api/health');
});