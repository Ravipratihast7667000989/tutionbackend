// // utils/jwt.js
// import jwt from "jsonwebtoken";

// export const generateToken = (userId) =>
//   jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: "7d"
//   });
// //

import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};