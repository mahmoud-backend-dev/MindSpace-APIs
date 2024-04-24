const express = require("express");
const router = express();
const adminVerifyToken = require("../helpers/jwt").verifyTokenAdmin;
const verifyToken = require("../helpers/jwt").verifyToken;

/**
 * IMPORT CONTROLLER
 */
const {
  addCMS,
  updateCMS,
  getByIdCMS,
} = require("../controller/cmsController/index");

/**
 * ADD CMS
 */
router.post("/", adminVerifyToken, async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {
      var ctrlResponse = await addCMS.add(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});

/**
 * UPDATE CMS
 */
router.put("/:id", adminVerifyToken, async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {
      var ctrlResponse = await updateCMS.update(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});

/**
 * get cms
 */

router.get("/", adminVerifyToken, async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {
      var ctrlResponse = await getByIdCMS.getById(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
