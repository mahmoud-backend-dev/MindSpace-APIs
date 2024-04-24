/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const reportCollection = common.db.reports;

/**
 * UPDATE CMS PAGE
 * @param {Object} req ~
 * @returns Object
 */
module.exports.getReportById = async (req) => {
	try {
		if (req.params.id != "" && typeof req.params.id != "undefined") {
			var decryptId = await common.helpers.decryptData(req.params.id);

			var reportDetails = await common.query.findOne(reportCollection, {
				where: { id: decryptId },
			});

			if (reportDetails == null) {
				/**
				 * DETAILS NOT FOUND
				 */

				var successOrError = await common.responseServices.successOrErrors("err_95");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.reportId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			} else {
				/**
				 * SUCCESS RESPONSE
				 */

				const userTimeZone = req.user.timezone;

				var response = await common.response.reports.reportObjectRes(
					reportDetails.id,
					userTimeZone
				);

				var successOrError = await common.responseServices.successOrErrors("successMessage");
				return await common.responseModel.successResponse(
					successOrError.getReport,
					response,
					{}
				);
			}
		}
	} catch (error) {
		/**
		 * CATCH ERROR
		 */
		var successOrError = common.responseServices.successOrErrors("ex_00");
		var resobj = common.responseModel.resObj(
			successOrError.code,
			error.message,
			successOrError.parameters.noParams,
			successOrError.location
		);
		var array = [];
		array.push(resobj);
		return common.responseModel.failResponse(successOrError.failMsg, {}, array);
	}
};
