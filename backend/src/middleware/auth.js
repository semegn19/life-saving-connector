const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId).select('-password');
    if (!user || user.isBlocked || !user.isActive) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Always trust DB roles (not token roles)
    req.user = {
      id: user._id.toString(),
      roles: user.userRoles || [],
      doc: user,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRoles = (roles = []) => (req, res, next) => {
  const userRoles = req.user?.roles || [];
  const allowed = roles.some((role) => userRoles.includes(role));
  if (!allowed) return res.status(403).json({ message: 'Forbidden' });
  return next();
};

module.exports = { auth, requireRoles };

