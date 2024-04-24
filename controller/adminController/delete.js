/**
 * HELPERS
 */
var common = require("../common");
/**
 * BUCKECT
 */

const bucketName = process.env.AWS_BUCKETNAME;
const profileImage = process.env.AWS_UPLOAD_PATH_FOR_PROFILE;
/**
 * DATABASE
 */
const adminsCollection = common.db.admin;
const assignRoleResources = common.db.assignRoleResources;

/**
 * DELETE USER FUNCTION
 * @param {Object} req
 * @returns Object
 */
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

		var adminsDetails = await common.query.findOne(adminsCollection, {
			where: { id: decryptId },
		});

		if (!adminsDetails) {
			/**
			 * ADMIN NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_19");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var deleteAdmin;

		deleteAdmin = await adminsCollection.destroy({
			where: { id: decryptId },
		});

		await assignRoleResources.destroy({
			where: { adminId: decryptId },
		});
		var bucket = bucketName + "/" + profileImage;
		await common.helpers.deleteFileFromS3(adminsDetails.profile, bucket);

		if (deleteAdmin == 1) {
			/**
			 * SUCCESS RESPONSE
			 */
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successResponse(successOrError.adminDelete, {}, {});
		} else {
			/**
			 * SOME THING WENT WRONG WHILE DELETING USER
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
