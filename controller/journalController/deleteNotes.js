/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */

const journalsCollections = common.db.journals;

/**
 * DELETE NOTES FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.deleteNotes = async (req) => {
	try {
		var queryParams = req.params;

		var notesId = await common.helpers.decryptData(queryParams.id);

		if (!notesId) {
			var successOrError = await common.responseServices.successOrErrors("err_48");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.notesId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var notesDetails = await common.query.findOne(journalsCollections, {
			where: { id: notesId },
		});
		if (!notesDetails) {
			/**
			 * NOTE NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_39");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.notesId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var deleteNotes = await journalsCollections.destroy({
			where: { id: notesId },
		});
		if (deleteNotes == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.notesId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successGetResponse(successOrError.deleteNotes, {}, {});
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
