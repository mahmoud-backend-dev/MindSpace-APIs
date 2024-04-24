/**
 * HELPERS
 */
var common = require("../common");
var Op = common.db.Sequelize.Op;

/**
 * DATABASE
 */
const cmsCollection = common.db.cms;

/**
 * UPDATE CMS PAGE
 * @param {Object} req ~
 * @returns Object
 */
module.exports.update = async (req) => {
	try {
		if (req.params.id != "" && typeof req.params.id != "undefined") {
			var decryptId = await common.helpers.decryptData(req.params.id);

			if (decryptId != false) {
				var cmsDetails = await common.query.findOne(cmsCollection, {
					where: { id: decryptId },
				});

				if (cmsDetails == null) {
					/**
					 * INVALID CMS ID
					 */

					var successOrError = await common.responseServices.successOrErrors("err_95");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.cmsId,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				} else {
					var updateCMSObject = {};
					if (req.body.pageKey != "" && typeof req.body.pageKey != "undefined") {
						var pageKey = await common.query.findOne(cmsCollection, {
							where: {
								pageKey: req.body.pageKey,
								id: {
									[Op.ne]: decryptId,
								},
							},
						});
						if (pageKey != null) {
							/**
							 * NAME ALREADY EXIST
							 */

							var successOrError = await common.responseServices.successOrErrors("err_94");
							var resobj = await common.responseModel.resObj(
								successOrError.code,
								successOrError.message,
								successOrError.parameters.pageKey,
								successOrError.location
							);
							return await common.responseModel.failResponse(
								successOrError.failMsg,
								{},
								resobj
							);
						} else {
							updateCMSObject.pageKey = req.body.pageKey;
						}
					}
					if (req.body.pageTitle != "" && typeof req.body.pageTitle != "undefined") {
						var pageTitle = await common.query.findOne(cmsCollection, {
							where: {
								pageTitle: req.body.pageTitle,
								id: {
									[Op.ne]: decryptId,
								},
							},
						});
						if (pageTitle != null) {
							/**
							 * NAME ALREADY EXIST
							 */

							var successOrError = await common.responseServices.successOrErrors("err_94");
							var resobj = await common.responseModel.resObj(
								successOrError.code,
								successOrError.message,
								successOrError.parameters.pageTitle,
								successOrError.location
							);
							return await common.responseModel.failResponse(
								successOrError.failMsg,
								{},
								resobj
							);
						} else {
							updateCMSObject.pageTitle = req.body.pageTitle;
						}
					}
					if (req.body.content != "" && typeof req.body.content != "undefined") {
						updateCMSObject.content = req.body.content;
					}
				}
			} else {
				/**
				 * INVALID CMS ID
				 */

				var successOrError = await common.responseServices.successOrErrors("err_95");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.cmsId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		} else {
			/**
			 * INVALID USER ID
			 */

			var successOrError = await common.responseServices.successOrErrors("err_32");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		updateCMSObject.updatedAt = new Date();
		await common.query.update(cmsCollection, { id: decryptId }, updateCMSObject);

		var cmsDetails = await common.query.findOne(cmsCollection, { where: { id: decryptId } });
		/**
		 * SUCCESS RESPONSE
		 */
		var response = await common.response.cms.cmsObjectRes(cmsDetails);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(successOrError.updateCms, response, {});
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
