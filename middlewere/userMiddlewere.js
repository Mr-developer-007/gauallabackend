import pool from "../config.js";
import { TokenVerify } from "../helper/Jwttoken.js";

export const userMiddleware = async (req, res, next) => {
  try {
    const { user } = req.cookies;

    // Check if cookie exists
    if (!user) {
      return res.status(401).json({ success: false, message: "No token found" });
    }

    // Verify token
    const id = TokenVerify(user);
    if (!id) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  req.user= rows[0];
next()
  } catch (error) {
    console.error("User middleware error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
