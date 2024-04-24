/**
 * NPM PACKAGE
 */
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

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
 * ADMIN UPDATE DETAILS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.updateLanguage = async (req) => {
	try {
		/**
		 * LANGUAGE ID VALIDATION
		 */

		if (req.params.id) {
			var decryptId = await common.helpers.decryptData(req.params.id);

			var languageIdQuery = { where: { id: decryptId } };
			var languagesDetails = await common.query.findOne(languageCollection, languageIdQuery);

			var languagesObject = {};

			if (languagesDetails != null) {
				/**
				 * UPDATE FIRSTNAME THEN CALL THIS CONDITION
				 */
				if (req.body.languageName != "" && typeof req.body.languageName != "undefined") {
					var langagQuery = { where: { languageName: req.body.languageName } };
					var findLanguage = await common.query.find(languageCollection, langagQuery);
					if (findLanguage.length) {
						/**
						 * CHECK SAME NAME ALREDY EXIST VALIDATION
						 */
						var successOrError = await common.responseServices.successOrErrors("err_130");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.languageName,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					} else {
						languagesObject.languageName = req.body.languageName
							? req.body.languageName
							: languagesDetails.dataValues.languageName;
					}
				} else {
					languagesObject.languageName = languagesDetails.languageName;
				}

				var langId = { id: decryptId };
				var update = await common.query.update(languageCollection, langId, languagesObject);

				if (update == 0) {
					/**
					 * SOME THING WENT WRONG WHILE UPDATE LANGUAGE
					 */

					var successOrError = await common.responseServices.successOrErrors("err_30");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				} else {
					/**
					 * SUCCESS RESPONSE
					 */

					var languagesDetails = await common.query.findOne(
						languageCollection,
						languageIdQuery
					);

					var response = await common.response.languages.languageObject(languagesDetails);
					var successOrError = await common.responseServices.successOrErrors("successMessage");
					return await common.responseModel.successResponse(
						successOrError.languageUpdate,
						response,
						[]
					);
				}
			} else {
				var successOrError = await common.responseServices.successOrErrors("err_131");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.languageId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		} else {
			/**
			 * INVALID LANGUAGE ID
			 */

			var successOrError = await common.responseServices.successOrErrors("err_131");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.languageId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
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
