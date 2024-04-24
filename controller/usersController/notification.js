/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 * NOTIFICATION UPDATE FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.notification = async (req) => {
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
			where: { id: decryptId, isDeleted: 0 },
		});
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
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (typeof req.body.action == "undefined") {
			/**
			 * USER NOT FOUND
			 */
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.action,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (req.body.action != 0 && req.body.action != 1) {
			/**
			 * INVALID USER ID
			 */
			//error number
			var successOrError = await common.responseServices.successOrErrors("err_124");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.action,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		await common.query.update(
			usersCollection,
			{ id: decryptId },
			{ isNotification: req.body.action == 0 ? 1 : 0 }
		);

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		if (req.body.action == 0) {
			var responseMessage = successOrError.notificationEnable;
		} else if (req.body.action == 1) {
			var responseMessage = successOrError.notificationDisable;
		}
		/**
             * SUCCESS RESPONSE
            //  */

		return await common.responseModel.successResponse(responseMessage, {}, {});
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
