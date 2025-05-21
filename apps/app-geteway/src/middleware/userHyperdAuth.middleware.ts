import jwt from 'jsonwebtoken';

export const userHyperdAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
console.log(authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1]; // احصل على التوكن بعد Bearer

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_USER);
    req.userId = decoded.id; // أو أي شيء آخر تحتاجه من التوكن
    next(); // تابع التنفيذ
  } catch (err) {
    return res.status(403).send({ message: 'Invalid or expired token' });
  }
};
