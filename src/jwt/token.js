import jwt from "jsonwebtoken";
import { User } from "../Model/user.model.js";

export const generateTokenAndSaveInCookies = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only true in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  await User.findByIdAndUpdate(userId, { token });
  return token;
};
