const express = require("express");
const router = express();
const userVerifyToken = require("../helpers/jwt").verifyTokenUser;
const adminVerifyToken = require("../helpers/jwt").verifyTokenAdmin;
const verifyToken = require("../helpers/jwt").verifyToken;

/**
 * IMPORT CONTROLLER
 */
const {
	createUser,
	usersList,
	consultNow,
	getByUserid,
	updateUser,
	uploadDocument,
	deleteUser,
	loginUser,
	activate,
	forgotPassword,
	changePassword,
	blockUnblockUser,
	logoutUser,
	userExists,
	notification,
	deleteDocument,
	updatePatient,
	getAllTherapistCity,
	addWorkDays,
	doctorByPatientId,
	sendOtp,
	verifyOtp,
} = require("../controller/usersController/index");

/**
 * Get Therpaies By Patient ID
 */

router.get("/getAllDoctorsByPatientId/:id", async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await doctorByPatientId.findAllDoctorByPatientId(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * REGISTER USER
 */
router.post("/", async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await createUser.create(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * USER EXISTS CHECK BY EMAIL, GOOGLEID ,APPLEID
 */
router.get("/userExists", async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await userExists.userExists(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});
/**
 *GET ALL CITY THERAPIST
 */
router.get("/therapistCity", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getAllTherapistCity.getAllCity(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * Consult Now
 */
router.get("/consultNow", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await consultNow.consultNow(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});


/**
 * Consult Now
 */
router.get("/consultNowTime", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await consultNow.getConsultNowTime();
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});


/**
 * Consult Now enable
 */
router.get("/enableConsultNow", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await consultNow.enableConsultNow(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});


/**
 * Consult Now disable
 */
router.get("/disableConsultNow", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await consultNow.disableConsultNow(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * USER DETAIL
 */
router.get("/:id", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getByUserid.findById(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		throw err;
	}
});
/**
 * USERS LIST
 */
router.get("/", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await usersList.findAllUsers(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * LOGIN USER
 */
router.post("/login", async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await loginUser.login(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * UPDATE USER
 */
router.put("/:therapistId", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await updateUser.update(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * UPDATE USER
 */
router.put("/patient/:id", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await updatePatient.updatePatient(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * UPLOAD THERAPIST DOCUMENTS
 */
router.post("/uploadCertificates/:therapistId", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await uploadDocument.uploadDocumnet(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * DELETE USER
 */
router.delete("/:id", verifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await deleteUser.delete(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * USER CHANGE PASSWORD
 */
router.post("/changePassword/:id", userVerifyToken, async (req, res) => {
	try {
		var ctrlResponse = await changePassword.changePassword(req);
		res.send(ctrlResponse);
	} catch (err) {
		res.send(err);
	}
});

/**
 * USER FORGOT PASSWORD
 */
router.post("/forgotPassword", async (req, res) => {
	try {
		var ctrlResponse = await forgotPassword.forgotPassword(req);
		res.send(ctrlResponse);
	} catch (err) {
		res.send(err);
	}
});

/**
 * FORGOT PASSWORD : EMAIL EXIST AND EXPIRE TIMEOUT CHECK API
 * @param  {} '/check/mail/(
 */
router.get("/check/mail", async (req, res) => {
	try {
		const queryParam = req.query;
		var ctrlResponse = await forgotPassword.userForgotPasswordCheckMail(
			queryParam.id,
			queryParam.time,
			queryParam.randomString
		);

		if (ctrlResponse == true) {
			res.send({ code: 200 });
		} else {
			res.send({ code: 400 });
		}
	} catch (e) {
		res.send({ status: 400, error: e.message });
	}
});

/**
 * FORGOT PASSWORD : RESET PASSWORD
 */
router.post("/password/", async (req, res) => {
	try {
		const queryBody = req.body;

		var ctrlResponse = await forgotPassword.userForgotPasswordResetPassword(
			queryBody.id,
			queryBody.password,
			queryBody.confirmPassword
		);

		res.send(ctrlResponse);
	} catch (e) {
		res.send({ status: 400, error: e.message });
	}
});

/**
 * UPDATE PASSWORD : RESET PASSWORD
 */
router.post("/TherapistUpdatePassword/", async (req, res) => {
	try {
		const queryBody = req.body;

		var ctrlResponse = await forgotPassword.therapistUpdatePassword(
			queryBody.id,
			queryBody.password,
			queryBody.confirmPassword
		);

		res.send(ctrlResponse);
	} catch (e) {
		res.send({ status: 400, error: e.message });
	}
});

/**
 * USER NOTIFICATION
 */
router.put("/notification/:id", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await notification.notification(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * BLOCK UNBLOCK USER
 */
router.put("/block/:id", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await blockUnblockUser.blockUnblockUser(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * BLOCK UNBLOCK USER
 */
router.put("/activate/:id", async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await activate.activate(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * USER LOGOUT
 */
router.put("/logout/:id", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await logoutUser.logout(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * DELETE USER
 */
router.delete("/document/:id", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await deleteDocument.deleteDocument(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

router.post("/addWorkDays", userVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await addWorkDays.addWorkDays(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * Send OTP
 */
router.post("/otp/", async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await sendOtp.sendOtp(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
