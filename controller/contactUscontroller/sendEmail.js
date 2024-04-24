/**
 * HELPERS
 */
var common = require("../common");
const helpers = require("../../helpers/helpers");
const commonEmail = require("../../services/mailService.js/contactSupport");
/**
 *
 * CREATE ADMIN CONTACT COLLECTION
 * @param {OBJECT} req
 * @returns OBJECT
 */
async function create(req) {
	try {
		var errorFlag = 0;
		var errorArray = [];

		if (
			req.body.email == "" ||
			typeof req.body.email == "undefined" ||
			typeof req.body.email != "string"
		) {
			/**
			 * REQUIRE FIELD EMAIL
			 */
			errorFlag = 1;

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.email,
				successOrError.location
			);
			errorArray.push(resobj);
		} else {
			var emailValidation = await common.helpers.validateEmail(req.body.email);

			if (emailValidation == false) {
				/**
				 * INVALID EMAIL
				 */
				errorFlag = 1;
				var successOrError = await common.responseServices.successOrErrors("err_03");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.email,
					successOrError.location
				);
				errorArray.push(resobj);
			}
		}

		if (typeof req.body.userType == "undefined" && typeof req.body.userType != "number") {
			/**
			 * REQUIRE FIELD userType
			 */
			errorFlag = 1;
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userType,
				successOrError.location
			);
			errorArray.push(resobj);
		} else {
			if (parseInt(req.body.userType) < 0 || parseInt(req.body.userType) > 2) {
				/**
				 * INVALID VALUE
				 */
				errorFlag = 1;
				var successOrError = await common.responseServices.successOrErrors("err_86");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.userType,
					successOrError.location
				);
				errorArray.push(resobj);
			}
		}

		if (
			typeof req.body.questionAbout == "undefined" &&
			typeof req.body.questionAbout != "number"
		) {
			/**
			 * REQUIRE FIELD questionAbout
			 */
			errorFlag = 1;
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.questionAbout,
				successOrError.location
			);
			errorArray.push(resobj);
		} else {
			if (parseInt(req.body.questionAbout) < 0 || parseInt(req.body.questionAbout) > 6) {
				/**
				 * INVALID VALUE
				 */
				errorFlag = 1;
				var successOrError = await common.responseServices.successOrErrors("err_86");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.questionAbout,
					successOrError.location
				);
				errorArray.push(resobj);
			}
		}

		if (typeof req.body.description == "undefined") {
			/**
			 * REQUIRE FIELD description
			 */
			errorFlag = 1;
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.description,
				successOrError.location
			);
			errorArray.push(resobj);
		}

		if (errorArray.length > 0 && errorFlag == 1) {
			return await common.responseModel.failResponse("Errors", {}, errorArray);
		} else {
			var questionAbout = "";
			var userType;

			if (parseInt(req.body.questionAbout) == 0) {
				questionAbout = "Account management";
			} else if (parseInt(req.body.questionAbout) == 1) {
				questionAbout = "Technical issues";
			} else if (parseInt(req.body.questionAbout) == 2) {
				questionAbout = "Using a feature";
			} else if (parseInt(req.body.questionAbout) == 3) {
				questionAbout = "Billing inquiries";
			} else if (parseInt(req.body.questionAbout) == 4) {
				questionAbout = "Therapist";
			} else if (parseInt(req.body.questionAbout) == 5) {
				questionAbout = "Policy Issues";
			} else if (parseInt(req.body.questionAbout) == 6) {
				questionAbout = "Other";
			}

			if (parseInt(req.body.userType) == 0) {
				userType = "A patient";
			} else if (parseInt(req.body.userType) == 1) {
				userType = "A therapist";
			} else if (parseInt(req.body.userType) == 2) {
				userType = "Not yet a user";
			}

			const dataObj = {
				email: req.body.email,
				userType: userType,
				questionAbout: questionAbout,
				description: req.body.description,
			};
			//send email
			var html = await commonEmail.sendEmail(dataObj);

			var sendEmail = await helpers.sendMail(
				html,
				"Contact support",
				process.env.MAIL_AUTH_USER
			);
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return common.responseModel.successResponse("Success", {}, {});
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
		var array = [];
		array.push(resobj);
		return await common.responseModel.failResponse(successOrError.failMsg, {}, array);
	}
}

module.exports = {
	create,
};
