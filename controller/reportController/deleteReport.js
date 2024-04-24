/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */

const reportCollection = common.db.reports;

/**
 * DELETE BANNER FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.deleteReport = async (req) => {
	try {
		var queryParams = req.params;

		var reportId = await common.helpers.decryptData(queryParams.id);

		if (!reportId) {
			var successOrError = await common.responseServices.successOrErrors("err_150");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.reportId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var reportDetails = await common.query.findOne(reportCollection, {
			where: { id: reportId },
		});
		if (!reportDetails) {
			/**
			 * NOTE NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_151");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.reportId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var deleteReport = await reportCollection.destroy({
			where: { id: reportId },
		});
		if (deleteReport == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.reportId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return common.responseModel.successGetResponse(successOrError.deleteReport, {}, {});
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
