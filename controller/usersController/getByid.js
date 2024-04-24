/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 * FIND BY USER ID FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.findById = async (req) => {
	try {
		var queryParams = req.params;

		var userId = await common.helpers.decryptData(queryParams.id);

		if (!userId) {
			var successOrError = await common.responseServices.successOrErrors("err_32");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userDetails = await common.query.findOne(usersCollection, {
			where: { id: userId, isDeleted: 0 },
		});
		if (!userDetails) {
			/**
			 * NOTE NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_76");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		if (userDetails.role == 0) {
			var response = await common.response.users.therapistObjResponse(userDetails.id);
			var msg = successOrError.getDoctor;
		} else if (userDetails.role == 1) {
			var response = await common.response.users.singleUserObjectRes(userDetails.id);
			var msg = successOrError.getPatient;
		}

		return await common.responseModel.successGetResponse(msg, response, {});
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
