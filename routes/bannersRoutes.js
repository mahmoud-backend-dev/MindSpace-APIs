const express = require("express");
const router = express();
const userVerifyToken = require("../helpers/jwt").verifyTokenUser;
const adminVerifyToken = require("../helpers/jwt").verifyTokenAdmin;
const verifyToken = require("../helpers/jwt").verifyToken;
const { addBanners, getAllBanners, deleteBanner } = require("../controller/bannerController/index");

/**
 * Add  Banners
 */
router.post("/", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await addBanners.addbanner(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});
/**
 * GET BANNERS
 */
router.get("/", verifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getAllBanners.getAllBanners(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});
/**
 * DELETE BANNER
 */
router.delete("/:id", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await deleteBanner.deleteBanner(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
