const token = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const tokenValue = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = token.verify(tokenValue, JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
  }

  req.user = payload;

  return next();
};
module.exports = auth;
