/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const therapyCollection = common.db.therapies;

module.exports.getbyid = async (req) => {
	try {
		var decryptId = await common.helpers.decryptData(req.params.id);

		if (!decryptId) {
			var successOrError = await common.responseServices.successOrErrors("err_148");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapiId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var therapiDetails = await common.query.findOne(therapyCollection, {
			where: { id: decryptId },
		});

		if (!therapiDetails) {
			/**
			 * USER NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_147");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapyId,
				successOrError.location
			);
			return common.responseModel.successGetResponse(successOrError.failMsg, {}, resobj);
		}

		/**
		 * SUCCESS RESPONSE
		 */
		var response = await common.response.therapies.therapiesObjectRes(therapiDetails);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(successOrError.getbyid, response, {});
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
