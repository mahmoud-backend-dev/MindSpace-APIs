/**
 * NPM PACKAGE
 */
require("dotenv").config();

/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const languageCollection = common.db.language;

/**
 *
 * LANGUAGE CREATE
 * @param {OBJECT} req
 * @returns OBJECT
 */
async function create(req) {
	try {
		if (
			req.body.languageName == "" ||
			typeof req.body.languageName == "undefined" ||
			typeof req.body.languageName != "string"
		) {
			/**
			 * REQUIRE FIELD  LANGUAGE Name
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.languageName,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/**
		 * CHECK LANGAUGE ALREADY EXISTS.
		 */

		var langagQuery = { where: { languageName: req.body.languageName } };
		var findLanguage = await common.query.findOne(languageCollection, langagQuery);

		if (findLanguage != null) {
			/**
			 * LANGUAGE ALREADY EXISTS
			 */

			var successOrError = await common.responseServices.successOrErrors("err_130");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.languageName,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		// CREATE LANGUAGE
		var obj = {
			languageName: req.body.languageName ? req.body.languageName : "",
		};

		var result = await common.query.create(languageCollection, obj);
		if (Object.keys(result.dataValues).length > 0) {
			/**
			 * SUCCESS RESPONSE
			 */
			var response = await common.response.languages.languageObject(result);
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return common.responseModel.successCreateResponse(
				successOrError.languageCreate,
				response,
				{}
			);
		} else {
			/**
			 * SOMETHING WENT WRONG
			 */

			var successOrError = await common.responseServices.successOrErrors("err_30");
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
