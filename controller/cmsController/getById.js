/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const cmsCollection = common.db.cms;

/**
 * CMS GET BY ID
 * @param {Object} req
 * @returns Object
 */
module.exports.getById = async (req) => {
	try {
		if (req.query.pageKey != "" && typeof req.query.pageKey != "undefined") {
			var cmsDetails = await common.query.findOne(cmsCollection, {
				where: { pageKey: req.query.pageKey },
			});

			if (cmsDetails == null) {
				/**
				 * DETAILS NOT FOUND
				 */

				var successOrError = await common.responseServices.successOrErrors("err_95");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.pageKey,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		} else {
			/**
			 * REQUIRED FIELD PAGE KEY
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.pageKey,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/**
		 * SUCCESS RESPONSE
		 */
		var response = await common.response.cms.cmsObjectRes(cmsDetails);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(successOrError.getCms, response, {});
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
		return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
	}
};
