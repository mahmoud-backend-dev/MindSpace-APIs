const express = require("express");
const router = express();
const userVerifyToken = require("../helpers/jwt").verifyTokenUser;
const adminVerifyToken = require("../helpers/jwt").verifyTokenAdmin;
const { addReviews, getAllReviews } = require("../controller/reviewsController/index");

/**
 * Add  Reviews
 */
router.post("/", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await addReviews.addReviews(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});
/**
 * GET REVIEWS
 */
router.get("/", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getAllReviews.getReviews(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
