const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  console.log("at auth");
  console.log(req);
  const authHeader = req.headers['authorization'];
  console.log("header: " authHeader);
  const token = authHeader?.split(' ')[1];
  console.log("token: " token);

  if (!token) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = authenticateToken;