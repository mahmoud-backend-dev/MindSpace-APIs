const express = require("express");
const router = express();
const adminVerifyToken = require("../helpers/jwt").verifyTokenAdmin;

/**
 * IMPORT CONTROLLER
 */
const {
  create,
  list,
  sendEmail
} = require("../controller/contactUscontroller/index");

/** 
 * 
 * GET ALL Contact List By Admin Id
 */

router.get("/", adminVerifyToken, async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {

      var ctrlResponse = await list.contactUsList(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});

/**
 * CREATE Contact-Us
 */
router.post("/", async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {
      var ctrlResponse = await create.create(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});

/**
 * Send Contact-Us email
 */
router.post("/email", async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {
      var ctrlResponse = await sendEmail.create(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});



module.exports = router;
