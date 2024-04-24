const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const db = require("../schema/db");
const users = db.users;
const admins = db.admin;
const device = db.device;
const common = require("../controller/common");

/**
 * VERIFY USERAUTHENTICATION TOKEN FUNCTION
 */
const verifyTokenUser = async (req, res, next) => {
  const bearerToken =
    req.body.bearerToken ||
    req.query.bearerToken ||
    req.headers["authorization"];

  if (!bearerToken) {
    return res.status(401).send("Unauthorized");
  }
  try {
    if (bearerToken.startsWith("Bearer")) {
      var token = bearerToken.replace(/Bearer /g, "");
      jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
        if (err) {
          return res.status(401).send("Unauthorized");
        } else {
          var decoded = jwtDecode(token);
          var userExist = await users.findOne({
            where: { id: decoded.userId, deviceId: decoded.deviceId },
          });
          if (userExist == null) {
            return res.status(401).send("Unauthorized");
          } else {
            req["user"] = userExist;
            return next();
          }
        }
      });
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
};

/**
 * VERIFY ADMIN AUTHENTICATION TOKEN FUNCTION
 */
const verifyTokenAdmin = async (req, res, next) => {
  const bearerToken =
    req.body.bearerToken ||
    req.query.bearerToken ||
    req.headers["authorization"];

  if (!bearerToken) {
    return res.status(401).send("Unauthorized");
  }
  try {
    var token = bearerToken.replace(/Bearer /g, "");
    await jwt.verify(
      token,
      process.env.SECRET_KEY,
      async function (err, decoded) {
        if (err) {
          return res.status(401).send("Unauthorized");
        } else {
          var decoded = jwtDecode(token);
          var adminExist = await admins.findOne({
            where: { id: decoded.adminId },
          });
          if (adminExist == null) {
            return res.status(401).send("Unauthorized");
          } else {
            return next();
          }
        }
      }
    );
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
};

/**
 * VERIFY BOTH (USER, ADMIN) AUTHENTICTION TOKEN FUNCTION
 */

const verifyToken = async (req, res, next) => {
  const bearerToken =
    req.body.bearerToken ||
    req.query.bearerToken ||
    req.headers["authorization"];
  if (!bearerToken) {
    return res.status(401).send("Unauthorized");
  }
  try {
    var token = bearerToken.replace(/Bearer /g, "");
    jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
      if (err) {
        return res.status(401).send("Unauthorized");
      } else {
        var decoded = jwtDecode(token);
        if (decoded.userId != "" && typeof decoded.userId != "undefined")
          var userExist = await users.findOne({
            where: { id: decoded.userId, deviceId: decoded.deviceId },
          });
        if (decoded.adminId != "" && typeof decoded.adminId != "undefined")
          var adminExist = await admins.findOne({
            where: { id: decoded.adminId },
          });
        if (userExist != null || adminExist != null) {
          if (userExist) {
            if (userExist.isBlock == true) {
              var errorArray = [];
              var successOrError =
                common.responseServices.successOrErrors("err_109");
              var resobj = common.responseModel.resObj(
                successOrError.code,
                successOrError.message,
                successOrError.parameters.blockedByAdmin,
                successOrError.location
              );
              errorArray.push(resobj);
              var returnObject = common.responseModel.failResponse(
                "Errors",
                {},
                errorArray
              );
              return res.status(200).send(returnObject);
            }
          }
          return next();
        } else {
          return res.status(401).send("Unauthorized");
        }
      }
    });
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
};

async function socketAuthenticationVerification(token) {
  try {
    return new Promise((resolve) => {
      jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
        if (err) {
          return resolve(false);
        } else {
          var decoded = jwtDecode(token);
          if (decoded.userId != "" && typeof decoded.userId != "undefined")
            var userExist = await users.findOne({
              where: { id: decoded.userId },
            });
          if (decoded.adminId != "" && typeof decoded.adminId != "undefined")
            var adminExist = await admins.findOne({
              where: { id: decoded.adminId },
            });
          if (userExist != null || adminExist != null) {
            var obj = {
              decoded: decoded,
              flag: true,
            };
            return resolve(obj);
          } else {
            return resolve(false);
          }
        }
      });
    });
  } catch (err) {
    return false;
  }
}

async function getJWTtoken() {
  try {
    return new Promise((resolve) => {
      const API_KEY = process.env.callApiKey;
      const SECRET_KEY = process.env.callSecretKey;

      const options = { expiresIn: "24h", algorithm: "HS256" };

      const payload = {
        apikey: API_KEY,
        permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
      };

      const token = jwt.sign(
        payload,
        SECRET_KEY,
        options,
        async function (err, token) {
          if (token) {
            return resolve(token);
          }
          if (err) {
            return resolve(false);
          }
        }
      );
    });
  } catch (err) {
    return false;
  }
}

module.exports = {
  verifyTokenUser,
  verifyTokenAdmin,
  verifyToken,
  socketAuthenticationVerification,
  getJWTtoken,
};
