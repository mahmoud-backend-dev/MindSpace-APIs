/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const bannerCollections = common.db.banners;

/**
 *ADD USER REVIEWS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.addbanner = async (req) => {
	try {
		var bodyParams = req.body;
		var bodyFiles = req.files;
		if (
			!bodyFiles ||
			bodyFiles.bannerImage == "" ||
			typeof bodyFiles.bannerImage == "undefined"
		) {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.bannerImage,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (bodyParams.therapistId == "" || typeof bodyParams.therapistId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var decryptedId = await common.helpers.decryptData(bodyParams.therapistId);

		if (!decryptedId) {
			var successOrError = await common.responseServices.successOrErrors("err_23");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				"body"
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userData = await usersCollection.findOne({
			where: { id: decryptedId, role: 0, isDeleted: 0 },
		});

		if (!userData) {
			var successOrError = await common.responseServices.successOrErrors("err_76");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				"body"
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var bucketName = process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_BANNERS;

		var key = await common.helpers.randomString(20);
		var extention = bodyFiles.bannerImage.mimetype.split("/");

		await common.helpers.uploadFileToS3(
			bodyFiles.bannerImage,
			key + "." + extention[1],
			bucketName
		);
		var addBannerObj = {
			"therapistId": decryptedId,
			"bannerImage": key + "." + extention[1],
		};
		var addBannerData = await bannerCollections.create(addBannerObj);

		var response = await common.response.banners.bannerObjectRes(addBannerData.id);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successCreateResponse(
			successOrError.addbanner,
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
