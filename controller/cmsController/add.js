/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const cmsCollection = common.db.cms;

/**
 * ADD CMS PAGES
 * @param {Object} req
 * @returns Object
 */
module.exports.add = async (req) => {
	try {
		if (req.body.pageKey == "" || typeof req.body.pageKey == "undefined") {
			/**
			 * REQUIRE FIELD PAGE KEY
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.pageKey,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			var pageKeyData = await common.query.findOne(cmsCollection, {
				where: { pageKey: req.body.pageKey },
			});

			if (pageKeyData != null) {
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

				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}

		if (req.body.pageTitle == "" || typeof req.body.pageTitle == "undefined") {
			/**
			 * REQUIRE FIELD PAGE TITLE
			 */
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.pageTitle,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			var pageTitle = await common.query.findOne(cmsCollection, {
				where: { pageTitle: req.body.pageTitle },
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
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}
		if (req.body.content == "" || typeof req.body.content == "undefined") {
			/**
			 * REQUIRE FIELD CONTENT
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.content,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var cmsObject = {
			pageKey: req.body.pageKey,
			pageTitle: req.body.pageTitle,
			content: req.body.content,
		};
		var cms = await common.query.create(cmsCollection, cmsObject);

		/**
		 * SUCCESS RESPONSE
		 */
		var response = await common.response.cms.cmsObjectRes(cms);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return common.responseModel.successCreateResponse(successOrError.addCms, response, {});
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
