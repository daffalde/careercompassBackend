import jwt from "jsonwebtoken";
import "dotenv/config";

export function authToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak" });
  }

  jwt.verify(token, process.env.JWT_TOKEN, (err, req, res) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid" });
    }

    next();
  });
}
