/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 * UPDATE SOCKET ID
 * @param {Object} req
 * @returns Object
 */

async function updateSocketId(data, socket) {
	try {
		if (data.userId == "" || typeof data.userId == "undefined") {
			/**
			 * REQUIRED FIELD : USER ID
			 */
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			var decryptId = await common.helpers.decryptData(data.userId);

			if (decryptId != false) {
				var usersDetails = await common.query.findOne(usersCollection, {
					where: { id: decryptId, isDeleted: 0 },
				});

				if (usersDetails == null) {
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
					return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				} else {
					var update = await common.query.update(
						usersCollection,
						{ id: decryptId },
						{ socketId: socket.id }
					);
				}
			} else {
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
				return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}

		if (update == 1) {
			/**
			 * SUCCESS
			 */
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return common.responseModel.successResponse(successOrError.updateSocket, "true", []);
		} else {
			/**
			 * SOMETHING WENT WRONG WHILE UPDATING A
			 */
			var successOrError = await common.responseServices.successOrErrors("err_29");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.socketId,
				successOrError.location
			);
			return common.responseModel.failResponse("Errors", {}, resobj);
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
		return common.responseModel.failResponse(successOrError.failMsg, {}, array);
	}
}

module.exports = {
	updateSocketId,
};
