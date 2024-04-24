/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */

const bannerCollections = common.db.banners;

/**
 * DELETE BANNER FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.deleteBanner = async (req) => {
	try {
		var queryParams = req.params;

		var bannerId = await common.helpers.decryptData(queryParams.id);

		if (!bannerId) {
			var successOrError = await common.responseServices.successOrErrors("err_87");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.bannerId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var bannerDetails = await common.query.findOne(bannerCollections, {
			where: { id: bannerId },
		});
		if (!bannerDetails) {
			/**
			 * NOTE NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_88");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.bannerId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		var bucketName = process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_BANNERS;
		await common.helpers.deleteFileFromS3(bannerDetails.bannerImage, bucketName);

		var deleteBanner = await bannerCollections.destroy({
			where: { id: bannerId },
		});
		if (deleteBanner == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.bannerId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successGetResponse(successOrError.deleteBanner, {}, {});
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
