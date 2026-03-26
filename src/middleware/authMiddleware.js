// opdracht 9 JWT Authenticatie middleware beschermd, POST, PUT and DELETE door de JWT verif
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  //feedb 6
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let token;

  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = authHeader;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    //401
    return res.status(401).json({ error: "Invalid token" });
  }
}
