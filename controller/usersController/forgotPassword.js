/**
 * HELPERS
 */
var common = require("../common");
const { update } = require("./update");

/**
 * USER FORGOT PASSWORD
 * @param {Object} req
 * @returns Object
 */

/**
 * NPM MODULES
 */
const CryptoJS = require("crypto-js");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

/**
 * HELPERS
 */
var common = require("../common");
const commonEmail = require("../../services/mailService.js/forgotPassword");
const e = require("express");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 * USER FORGOT PASSWORD
 * @param {Object} req
 * @returns Object
 */
module.exports.forgotPassword = async (req) => {
	try {
		if (typeof req.body.email == "undefined" || req.body.email == "") {
			/**
			 * EMAIL IS REQUIRED
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.email,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var validateEmail = await common.helpers.validateEmail(req.body.email);

		if (validateEmail == false) {
			var successOrError = await common.responseServices.successOrErrors("err_03");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.email,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userData = await common.query.findOne(usersCollection, {
			where: { email: req.body.email },
		});

		if (userData.isDeleted == 1) {
			var successOrError = await common.responseServices.successOrErrors("err_85");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.email,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (userData) {
			if (userData.loginType == 1 || userData.loginType == 2 || userData.loginType == 3) {
				var successOrError = await common.responseServices.successOrErrors("err_132");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.email,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			} else {
				var date = new Date();
				var milliseconds = date.getTime();

				const randomString = await common.helpers.randomString(30);

				var encryptedId = await common.helpers.encryptData(userData.id);
				var type = 1;
				var html = await commonEmail.sendEmail(encryptedId, milliseconds, randomString, type);

				var subject = "Your reset password link.";
				await common.helpers.sendMail(html, subject, req.body.email);

				var updateObj = {
					randomString: randomString,
				};

				await common.query.update(usersCollection, { email: req.body.email }, updateObj);
			}
		}

		/**
		 * SUCCESS MESSAGE
		 */

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(successOrError.forgotPassword, {}, {});
	} catch (error) {
		/**
		 * CATCH ERROR
		 */
		var successOrError = await common.responseServices.successOrErrors("ex_00");
		var resobj = await common.responseModel.resObj(
			successOrError.code,
			error.message,
			successOrError.parameters.noParams,
			successOrError.location
		);
		return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
	}
};

/**
 * USER FORGOT PASSWORD : CHECK EMAIL AND RANDOM STRING
 */
module.exports.userForgotPasswordCheckMail = async (id, time, randomstring) => {
	try {
		var decryptedId = await common.helpers.decryptData(id);

		var checkUserMail = await usersCollection.findOne({
			where: { id: decryptedId, randomString: randomstring },
		});

		if (!checkUserMail) {
			return false;
		}

		let date = new Date(parseInt(time));

		var now = new Date();

		var ms = common
			.moment(now, "YYYY-MM-DD HH:mm:ss")
			.diff(common.moment(date, "YYYY-MM-DD HH:mm:ss"));

		var data = common.moment.duration(ms);

		if (data._data.minutes < 240) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		/**
		 * CATCH ERROR
		 */
		var successOrError = await common.responseServices.successOrErrors("ex_00");
		var resobj = await common.responseModel.resObj(
			successOrError.code,
			error.message,
			successOrError.parameters.noParams,
			successOrError.location
		);
		return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
	}
};

/**
 *USER FORGOT PASSWORD : RESET PASSWORD
 */
module.exports.userForgotPasswordResetPassword = async (id, decreptedPass, decConfirmPassword) => {
	try {
		var decryptId = await common.helpers.decryptData(id);

		var password = await common.helpers.decryptData(decreptedPass);
		var confirmPassword = await common.helpers.decryptData(decConfirmPassword);
		var userDetails = await usersCollection.findOne({ where: { id: decryptId } });
		if (password == "" || typeof password == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.password,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		//	const validatePass = await common.helpers.checkPassword(password);
		// if (validatePass == false) {
		// 	var successOrError = await common.responseServices.successOrErrors("err_46");

		// 	var resobj = await common.responseModel.resObj(
		// 		successOrError.code,
		// 		successOrError.message,
		// 		successOrError.parameters.password,
		// 		successOrError.location
		// 	);

		// 	return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		// }

		if (confirmPassword == "" || typeof confirmPassword == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.confirmPass,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		//const validateConfirmPass = await common.helpers.checkPassword(confirmPassword);

		// if (validateConfirmPass == false) {
		// 	var successOrError = await common.responseServices.successOrErrors("err_46");

		// 	var resobj = await common.responseModel.resObj(
		// 		successOrError.code,
		// 		successOrError.message,
		// 		successOrError.parameters.confirmPass,
		// 		successOrError.location
		// 	);

		// 	return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		// }
		var newPassword = await bcrypt.compare(password, userDetails.password);

		if (newPassword == true) {
			var successOrError = await common.responseServices.successOrErrors("err_89");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.newPassword,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (password != confirmPassword) {
			var successOrError = await common.responseServices.successOrErrors("err_13");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.confirmPassword,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		await usersCollection.update(
			{
				password: bcrypt.hashSync(password, salt),
				randomString: "",
			},
			{
				where: { id: decryptId },
			}
		);

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(successOrError.updatePassword, {}, {});
	} catch (error) {
		/**
		 * CATCH ERROR
		 */

		var successOrError = await common.responseServices.successOrErrors("ex_00");
		var resobj = await common.responseModel.resObj(
			successOrError.code,
			error.message,
			successOrError.parameters.noParams,
			successOrError.location
		);
		return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
	}
};

/**
 *Therapist   UPDATE PASSWORD : RESET PASSWORD
 */
module.exports.therapistUpdatePassword = async (id, decreptedPass, decConfirmPassword) => {
	try {
		var decryptId = await common.helpers.decryptData(id);

		var password = await common.helpers.decryptData(decreptedPass);
		var confirmPassword = await common.helpers.decryptData(decConfirmPassword);
		var userDetails = await usersCollection.findOne({ where: { id: decryptId } });
		if (password == "" || typeof password == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.password,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		const validatePass = await common.helpers.checkPassword(password);
		if (validatePass == false) {
			var successOrError = await common.responseServices.successOrErrors("err_46");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.password,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (confirmPassword == "" || typeof confirmPassword == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.confirmPass,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		const validateConfirmPass = await common.helpers.checkPassword(confirmPassword);

		if (validateConfirmPass == false) {
			var successOrError = await common.responseServices.successOrErrors("err_46");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.confirmPass,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		var newPassword = await bcrypt.compare(password, userDetails.password);

		if (newPassword == true) {
			var successOrError = await common.responseServices.successOrErrors("err_89");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.newPassword,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (password != confirmPassword) {
			var successOrError = await common.responseServices.successOrErrors("err_13");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.confirmPassword,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		await usersCollection.update(
			{
				password: bcrypt.hashSync(password, salt),
				randomString: "",
				isEmailVerified: 1,
			},
			{
				where: { id: decryptId },
			}
		);

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(successOrError.updatePassword, {}, {});
	} catch (error) {
		/**
		 * CATCH ERROR
		 */

		var successOrError = await common.responseServices.successOrErrors("ex_00");
		var resobj = await common.responseModel.resObj(
			successOrError.code,
			error.message,
			successOrError.parameters.noParams,
			successOrError.location
		);
		return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
	}
};
