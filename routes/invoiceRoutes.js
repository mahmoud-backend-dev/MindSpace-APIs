const express = require("express");
const router = express();
const userVerifyToken = require("../helpers/jwt").verifyTokenUser;

const { getInvoice } = require("../controller/invoiceController/index");

/**
 * Get Invoice
 */
router.get("/:id", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getInvoice.getInvoice(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
