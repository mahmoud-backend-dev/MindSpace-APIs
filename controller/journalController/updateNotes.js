/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const journalsCollections = common.db.journals;

/**
 * UPDATE NOTES FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.updateNotes = async (req) => {
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
			 * NOTES NOT FOUND
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

		var updateObj = {
			heading: req.body.heading,
			description: req.body.description,
		};

		await journalsCollections.update(updateObj, { where: { id: notesId } });

		var response = await common.response.journals.journalsObjectRes(notesId);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successGetResponse(
			successOrError.updateNotes,
			response,
			{}
		);
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
