import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "mysecretkey", {
    expiresIn: "30d",
  });
};

export default generateToken;
