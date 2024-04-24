const express = require("express");
const { list } = require("../controller/adminController/getList");
const router = express();
const adminVerifyToken = require("../helpers/jwt").verifyTokenAdmin;

/**
 * IMPORT CONTROLLER
 */
const {
	create,
	update,
	login,
	forgotPassword,
	dashBoard,
	getByAdminId,
	List,
	Delete,
	getRoles,
	getPateients,
	getDoctors,
	getDoctorsById,
	updateDoctor,
	updateSuspendAccount,
	ActivateDeactive,
	doctorCreate,
	transactions,
} = require("../controller/adminController/index");

/**
 *
 * GET ALL Roles Routes
 */

router.get("/rolesResources", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getRoles.RoleResourcesList(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * REGISTER ADMIN
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
 * LOGIN ADMIN
 */
router.post("/login", async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await login.login(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * UPDATE ADMIN
 */
router.put("/:id", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await update.update(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * ADMIN CREATE DOCTOR
 */
router.post("/doctor", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await doctorCreate.create(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * Get All patients List
 */

router.get("/patients", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getPateients.patientsList(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * Get All Doctors List
 */

router.get("/doctors", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getDoctors.doctorsList(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * Admin update doctor account
 */
router.put("/doctors/:id", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await updateDoctor.updateDoctorProfile(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * Admin suspend doctor account
 */
router.put("/suspend/:id", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await updateSuspendAccount.suspendAccount(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * Admin active  doctor account
 */
router.put("/active/:id", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await ActivateDeactive.activateAccount(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * Get  Doctors List By Id
 */

router.get("/doctors/:id", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getDoctorsById.doctorById(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * GET  ADMIN By Id
 */
router.get("/:id", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await getByAdminId.get(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * GET ALL ADMINS
 */
router.get("/", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await List.list(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * GET ADMIN DASHBOARD
 */
router.get("/users/dashboard", adminVerifyToken, async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await dashBoard.dashboard(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

router.get("/users/transactionsList", async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await transactions.getAllTransations(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * DELETE ADMIN BY ID
 */
router.delete("/:id", async (req, res) => {
	try {
		if (
			req.headers.mindscapetoken &&
			typeof req.headers.mindscapetoken != "undefined" &&
			req.headers.mindscapetoken == process.env.MINDSCAPETOKEN
		) {
			var ctrlResponse = await Delete.delete(req);
			res.send(ctrlResponse);
		} else {
			res.status(401).send("Unauthorized");
		}
	} catch (err) {
		res.send(err);
	}
});

/**
 * ADMIM USER UPDATE PASSWORD : EMAIL EXIST AND EXPIRE TIMEOUT CHECK API
 * @param  {} '/check/mail/(
 */
router.get("/check/mail", async (req, res) => {
	try {
		const queryParam = req.query;
		var ctrlResponse = await forgotPassword.adminUserPasswordCheckMail(
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
 * ADMIM USER UPDATE PASSWORD
 */
router.post("/password", async (req, res) => {
	try {
		const queryBody = req.body;

		var ctrlResponse = await forgotPassword.adminUserUpdatePassword(
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

module.exports = router;
