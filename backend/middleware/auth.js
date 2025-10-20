

const jwt = require('jsonwebtoken');
const db = require('../config/database');
const verifyToken = (req, res, next) => {
  console.log('Headers recibidos:', req.headers);
  
  const authHeader = req.headers['authorization'];
  console.log('Header Authorization:', authHeader);
  
  if (!authHeader) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extraído:', token);
  
  if (!token) {
    return res.status(403).json({ message: 'Formato de token incorrecto' });
  }

  try {
    console.log('Clave secreta JWT:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = verifyToken;