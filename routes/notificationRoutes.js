const express = require("express");
const router = express();
const userVerifyToken = require("../helpers/jwt").verifyTokenUser;

const { getNotifications } = require("../controller/notificationController/index");

/**
 * Get Notifications
 */
router.get("/:id", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getNotifications.getAllNotifications(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
