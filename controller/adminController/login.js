/**
 * NPM PACKAGE
 */
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

/**
 * HELPERES
 */
var common = require("../common");

/**
 * DATABASE
 */
const adminsCollection = common.db.admin;

/**
 * LOGIN ADMIN
 * @param {OBJECT} req
 * @returns OBJECT
 */
module.exports.login = async (req) => {
	try {
		var adminsId;
		if (
			req.body.email == "" ||
			typeof req.body.email == "undefined" ||
			typeof req.body.email != "string"
		) {
			/**
			 * REQUIRE FIELD EMAIL
			 */

			var successOrError =  await common.responseServices.successOrErrors("err_02");
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
			var resobj =  await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.email,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (
			req.body.password == "" ||
			typeof req.body.password == "undefined" ||
			typeof req.body.password != "string"
		) {
			/**
			 * REQUIRE FIELD PASSWORD
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.password,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		var validatePassword = await common.helpers.checkPassword(req.body.password);
		if (validatePassword == false) {
			var successOrError = await common.responseServices.successOrErrors("err_12");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.email,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (req.body.email && req.body.password) {
			var findEmailQuery = { where: { email: req.body.email } };
			var adminsDetails = await common.query.findOne(adminsCollection, findEmailQuery);

			if (adminsDetails != null) {
				var comparePassword = await bcrypt.compare(
					req.body.password,
					adminsDetails.dataValues.password
				);

				if (comparePassword == true) {
					adminsId = adminsDetails.dataValues.id;
				} else {
					/**
					 * WRONG PASSWORD ERROR
					 */

					var successOrError =await  common.responseServices.successOrErrors("err_49");
					var resobj =await  common.responseModel.resObj(
						successOrError.message,
						successOrError.parameters.password,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
			} else {
				/**
				 * EMAIL NOT FOUND
				 */

				var successOrError = await common.responseServices.successOrErrors("err_20");
				var resobj =  await common.responseModel.resObj(
					successOrError.message,
					successOrError.parameters.email,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}

		const token = jwt.sign({ adminId: adminsId }, process.env.SECRET_KEY);

		/**
		 * SUCCESS RESPONSE
		 */
		var response = await common.response.admins.adminObjectRes(adminsDetails, token);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(successOrError.login, response, {});
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
