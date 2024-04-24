const express = require("express");
const router = express();
const userVerifyToken = require("../helpers/jwt").verifyTokenUser;
const {
  addReports,
  deleteReports,
  getReportsById,
  getAll,
} = require("../controller/reportController/index");

/**
 * Add REPORTS
 */
router.post("/", userVerifyToken, async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {
      var ctrlResponse = await addReports.addReport(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});

/**
 * GET REPORTS
 */
router.get("/", userVerifyToken, async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {
      var ctrlResponse = await getAll.getAllReports(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});

/**
 * Get REPORT BY ID
 */
router.get("/:id", userVerifyToken, async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {
      var ctrlResponse = await getReportsById.getReportById(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});

/**
 * DELETE REPORT
 */
router.delete("/:id", userVerifyToken, async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {
      var ctrlResponse = await deleteReports.deleteReport(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
