/**
 * HELPERS
 */
const { getSignedUrl } = require("../../helpers/helpers");
var common = require("../common");

/**
 * DATABASE
 */
const therapyCollection = common.db.therapies;
const userTherapyCollection = common.db.userTherapies;

module.exports.delete = async (req) => {
	try {
		var decryptId = await common.helpers.decryptData(req.params.id);

		if (!decryptId) {
			var successOrError = await common.responseServices.successOrErrors("err_32");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var therapiDetails = await therapyCollection.findOne({
			where: { id: decryptId },
		});

		if (!therapiDetails) {
			/**
			 * THERAPI NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_16");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapiId,
				successOrError.location
			);
			return common.responseModel.successGetResponse(successOrError.failMsg, {}, resobj);
		}

		await userTherapyCollection.destroy({ where: { therapiId: decryptId } });
		var deleteTherapi = await therapyCollection.destroy({ where: { id: decryptId } });

		if (deleteTherapi == 1) {
			/**
			 * SUCCESS RESPONSE
			 */
			var bucketName =
				process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_THERAPY;
			await common.helpers.deleteFileFromS3(therapiDetails.image, bucketName);

			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successResponse(successOrError.deleteTherapy, {}, {});
		} else {
			/**
			 * SOMETHING WENT WRONG WHILE DELETING USER
			 */

			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.message,
				successOrError.parameters.user,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
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
