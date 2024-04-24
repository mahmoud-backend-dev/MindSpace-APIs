/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 * LOGOUT USER
 * @param {Object} req
 * @returns Object
 */
module.exports.logout = async (req) => {
	try {
		var decryptId = await common.helpers.decryptData(req.params.id);

		if (!decryptId) {
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

		var usersDetails = await common.query.findOne(usersCollection, {
			where: {
				id: decryptId,
			},
		});

		if (usersDetails == null) {
			var successOrError = await common.responseServices.successOrErrors("err_19");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var logOutDevice = await common.query.update(
			usersCollection,
			{ id: decryptId },
			{ deviceToken: "", deviceId: "", voIpToken: "" }
		);

		if (logOutDevice == 1) {
			/**
			 * SUCCESS RESPONSE
			 */
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successResponse(successOrError.logout, {}, {});
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_90");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
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
