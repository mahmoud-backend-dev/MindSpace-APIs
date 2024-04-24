const express = require("express");
const router = express();
const adminVerifyToken = require("../helpers/jwt").verifyTokenAdmin;

/**
 * IMPORT CONTROLLER
 */
const {
	getDefaultValues,
	updateDefaultValues,
} = require("../controller/defaultValuesContoller/index");

/**
 * ADD FEEDBACK
 */
router.put("/:id", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await updateDefaultValues.update(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

router.get("/:key", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getDefaultValues.get(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
