import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateToken = ({ _id, role }) => {
  const payload = {
    _id,
    role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};
