// import jwt from "jsonwebtoken";
// import {User} from "../Model/user.model.js";
// export const generateTokenAndSaveInCookies = async (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
//     expiresIn: "10d",
//     // expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)  // 10 days expiry time
//   });
//   res.cookie("jwt", token, {
//     httpOnly: true,
//     secure: false, // localhost ke liye false, production me true kar dena
//     sameSite: "lax",
//     path: "/",
//   });

//   await User.findByIdAndUpdate(userId, { token });
//   return token;
// };

import jwt from "jsonwebtoken";
import { User } from "../Model/user.model.js";

export const generateTokenAndSaveInCookies = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
  });

  // res.cookie("jwt", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production", // only true in prod
  //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  //   path: "/",
  // });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
  await User.findByIdAndUpdate(userId, { token });
  return token;
};
