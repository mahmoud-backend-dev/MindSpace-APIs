/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const contactUSCollection = common.db.contactUs;

/**
 *
 * CONTACT US CREATE FUNCTION
 * @param {OBJECT} req
 * @returns OBJECT
 */
async function create(req) {
	try {
		if (req.body.name == "" || typeof req.body.name == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.name,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			const validateName = await common.helpers.nameValidation(req.body.name);

			if (validateName == false) {
				/**
				 * FIRST NAME VALIDATION
				 */

				var successOrError = await common.responseServices.successOrErrors("err_43");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.name,
					successOrError.location
				);

				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}

		if (req.body.email == "" || typeof req.body.email == "undefined") {
			/**
			 * EMAIL VALIDATION
			 */
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.email,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			const validateEmail = await common.helpers.validateEmail(req.body.email);

			if (validateEmail == false) {
				/**
				 * INVALID EMAIL
				 */

				var successOrError = await common.responseServices.successOrErrors("err_03");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.email,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}

		if (req.body.message == "" || typeof req.body.message == "undefined") {
			/**
			 * REQUIRE FIELD MESSAGE
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.message,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var decryptUserId = await common.helpers.decryptData(req.body.userId);

		const createObj = {
			userId: decryptUserId,
			name: req.body.name,
			email: req.body.email,
			message: req.body.message,
		};

		var result = await common.query.create(contactUSCollection, createObj);

		if (result) {
			/**
			 * SUCCESS RESPONSE
			 */
			var response = await common.response.contactUs.constactUsObjectRes(result);
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return common.responseModel.successCreateResponse(successOrError.contactUs, response, {});
		} else {
			/**
			 * SOMETHING WENT WRONG	*/

			var successOrError = await common.responseServices.successOrErrors("err_56");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.message, {}, resobj);
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
}

module.exports = {
	create,
};
