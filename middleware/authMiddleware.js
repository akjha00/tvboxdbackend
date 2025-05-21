const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  console.log("authenticate");
  console.log(req.headers['authorization']);
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  console.log(token);

  if (!token){
    console.log("culprit");
    return res.sendStatus(401);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = authenticateToken;