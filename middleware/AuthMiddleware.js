const { verify } = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (accessToken == null)
    return res.json({ status: "FAILED", message: "User not logged in!" });

  verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.json({ status: "FAILED", message: "Access Denied " });
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
