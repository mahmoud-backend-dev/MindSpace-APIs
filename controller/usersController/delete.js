/**
 * HELPERS
 */

var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

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

		var usersDetails = await common.query.findOne(usersCollection, {
			where: { id: decryptId },
		});
		var token = usersDetails.deviceToken;

		if (!usersDetails) {
			/**
			 * USER NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_19");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.successGetResponse(successOrError.failMsg, {}, resobj);
		}

		var deleteUser;

		var deleteUser = await usersCollection.update(
			{ isDeleted: 1, deviceToken: "", deviceId: "", voIpToken: "" },
			{ where: { id: decryptId } }
		);

		if (deleteUser == 1) {
			/**
			 * SUCCESS RESPONSE
			 */
			if (token != "") {
				let key = "autoLogout";
				await common.notification.sendSingleFirebaseNotification(token, "", "", key);
			}
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successResponse(successOrError.delete, {}, {});
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
