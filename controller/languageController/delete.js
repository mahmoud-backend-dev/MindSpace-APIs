/**
 * HELPERS
 */
var common = require("../common");
/**
 * BUCKECT
 */

/**
 * DATABASE
 */
const languageCollection = common.db.language;

/**
 * DELETE LANGUAGE FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.delete = async (req) => {
	try {
		var decryptId = await common.helpers.decryptData(req.params.id);

		if (!decryptId) {
			var successOrError = await common.responseServices.successOrErrors("err_131");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.languageId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var languagesDetails = await common.query.findOne(languageCollection, {
			where: { id: decryptId },
		});

		if (!languagesDetails) {
			/**
			 * LANGAUGE NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_19");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.languageId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var deletelanguage = await languageCollection.destroy({
			where: { id: decryptId },
		});

		if (deletelanguage == 1) {
			/**
			 * SUCCESS RESPONSE
			 */
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successResponse(successOrError.languageDelete, {}, {});
		} else {
			/**
			 * SOMETHING WENT WRONG WHILE DELETING LANGUAGE
			 */

			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
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
