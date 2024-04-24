const express = require("express");
const router = express();
const adminVerifyToken = require("../helpers/jwt").verifyTokenAdmin;

/**
 * IMPORT CONTROLLER
 */
const {
  create,
  update,
  list,
  deleteLanguage
} = require("../controller/languageController/index");

/** 
 * 
 * GET ALL LANGUAGES Routes
 */

router.get("/", adminVerifyToken,async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {
      var ctrlResponse = await list.LanguagesList(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});

/**
 * CREATE LANGUAGE
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
 * Admin update LANGUAGE BY ID
 */
router.put("/:id", adminVerifyToken, async (req, res) => {
  try {
    if (
      req.headers.mindscapetoken &&
      typeof req.headers.mindscapetoken != "undefined" &&
      req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
    ) {
      var ctrlResponse = await update.updateLanguage(req);
      res.send(ctrlResponse);
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.send(err);
  }
});


/**
 * DELETE LANGUAGE BY ID
 */
router.delete("/:id", async (req, res) => {
	try {
    
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await deleteLanguage.delete(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});


module.exports = router;
