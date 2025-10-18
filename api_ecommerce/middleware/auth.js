import tokenService from '../services/token.js';

/**
 * Obtiene el token desde:
 *  - Authorization: Bearer xxx
 *  - x-token / x-access-token
 */
function getTokenFromHeaders(req) {
  let t =
    req.headers['authorization'] ||
    req.headers['Authorization'] ||
    req.headers['x-token'] ||
    req.headers['x-access-token'];

  if (!t) return null;

  // Soporta formato "Bearer <token>"
  if (typeof t === 'string' && /^Bearer\s+/i.test(t)) {
    t = t.replace(/^Bearer\s+/i, '').trim();
  }
  return t;
}

/**
 * Verificación base del token. Adjunta `req.user`.
 */
async function verifyToken(req, res, next) {
  try {
    const rawToken = getTokenFromHeaders(req);
    if (!rawToken) {
      return res.status(401).send({ message: 'Token no proporcionado' });
    }

    const decoded = await tokenService.decode(rawToken);
    if (!decoded) {
      return res.status(401).send({ message: 'Token inválido o expirado' });
    }

    const role = (decoded.role || decoded.rol || '').toLowerCase();

    req.user = {
      id: decoded._id || decoded.id,
      email: decoded.email,
      role,
      raw: decoded,
    };

    return next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).send({ message: 'Token inválido o expirado' });
  }
}

/**
 * Helper para validar roles permitidos.
 */
function requireRoles(allowedRoles = []) {
  // normalizamos posibles variantes 'client' / 'cliente'
  const normalized = allowedRoles.map(r => r.toLowerCase());
  return (req, res, next) => {
    const r = (req.user?.role || '').toLowerCase();
    const matches =
      normalized.includes(r) ||
      (r === 'cliente' && normalized.includes('client')) ||
      (r === 'client' && normalized.includes('cliente'));

    if (!matches) {
      return res
        .status(403)
        .send({ message: 'No tienes permisos para acceder a esta ruta' });
    }
    next();
  };
}

/**
 * Middlewares exportados:
 *  - verifyEcommerce: requiere usuario autenticado y rol admin o client/cliente
 *  - verifyAdmin: requiere usuario autenticado con rol admin
 *  - verifyToken: solo verifica y adjunta req.user (por si lo necesitas suelto)
 */
const verifyEcommerce = (req, res, next) =>
  verifyToken(req, res, () => requireRoles(['admin', 'client', 'cliente'])(req, res, next));

const verifyAdmin = (req, res, next) =>
  verifyToken(req, res, () => requireRoles(['admin'])(req, res, next));

export default {
  verifyToken,
  verifyEcommerce,
  verifyAdmin,
};