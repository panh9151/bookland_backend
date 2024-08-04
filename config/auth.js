const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const connection = require("./connection");
const Fields = require("../classes/Fields");
dotenv.config(); // To load environment variables from a .env file

const authMiddleware = async (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    // return res.status(401).json({ message: "Token not found" });
    req.user = null;
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM NguoiDung WHERE id_nguoidung = ?",
        [decoded.id],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          if (results.length === 0) {
            return reject(new Error("User not found"));
          }
          resolve(results[0]);
        }
      );
    });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Get token failed" });
  }
};

module.exports = authMiddleware;
