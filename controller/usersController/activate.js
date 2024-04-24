/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 *ACITVE DEACTIVE USER FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.activate = async (req) => {
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
		var condition = {};
		if (req.body.action == 0) {
			if (req.body.reason == "" || typeof req.body.reason == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.reason,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			condition = { isActive: "0", reason: req.body.reason, isDeleted: 1 };
		} else if (req.body.action == 1) {
			condition = { isActive: "1", reason: "", isDeleted: 0 };
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_124");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.action,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		await usersCollection.update(condition, { where: { id: decryptId } });

		/**
             * SUCCESS RESPONSE
            //  */
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		if (req.body.action == 0) {
			var responseMessage = successOrError.block;
		} else if (req.body.action == 1) {
			var responseMessage = successOrError.unblock;
		}

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
