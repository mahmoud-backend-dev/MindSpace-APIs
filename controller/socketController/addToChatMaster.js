/**
 * HELPERS
 */
var common = require("../common");
var moment = require("moment");
/**
 * DATABASE
 */
const usersCollection = common.db.users;
const chatMaster = common.db.chatMaster;

/**
 *ADD TO CHAT MASTER SOCKET
 * @param {Object} req
 * @returns Object
 */

async function addToChatMaster(data, socket) {
	try {
		if (data.loginUserId == "" || typeof data.loginUserId == "undefined") {
			/**
			 * REQUIRED FIELD : LOGIN USER ID
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.loginUserId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			var loginDecryptId = await common.helpers.decryptData(data.loginUserId);

			if (loginDecryptId != false) {
				var loginUsersDetails = await common.query.findOne(usersCollection, {
					where: { id: loginDecryptId, isDeleted: 0 },
				});

				if (loginUsersDetails == null) {
					/**
					 * USER NOT FOUND
					 */

					var successOrError = await common.responseServices.successOrErrors("err_19");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.loginUserId,
						successOrError.location
					);
					return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
			} else {
				/**
				 * USER NOT FOUND
				 */

				var successOrError = common.responseServices.successOrErrors("err_19");
				var resobj = common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.userId,
					successOrError.location
				);
				errorArray.push(resobj);
			}
		}

		/** VALIDATION FOR CHAT USER ID */
		if (data.chatUserId == "" || typeof data.chatUserId == "undefined") {
			/**
			 * REQUIRED FIELD : CHAT USER ID
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.chatUserId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			var chatUserDecryptId = await common.helpers.decryptData(data.chatUserId);

			if (chatUserDecryptId != false) {
				var chatUserId = await common.query.findOne(usersCollection, {
					where: { id: chatUserDecryptId, isDeleted: 0 },
				});

				if (chatUserId == null) {
					/**
					 * USER NOT FOUND
					 */

					var successOrError = await common.responseServices.successOrErrors("err_19");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.chatUserId,
						successOrError.location
					);
					return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
			} else {
				/**
				 * USER NOT FOUND
				 */

				var successOrError = common.responseServices.successOrErrors("err_19");
				var resobj = common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.userId,
					successOrError.location
				);
				errorArray.push(resobj);
			}
		}

		var chatExist = await chatMaster.findOne({
			where: { loginUserId: loginDecryptId, chatUserId: chatUserDecryptId },
		});

		console.log({ loginDecryptId, chatUserDecryptId });

		const createObj = {
			loginUserId: loginDecryptId,
			chatUserId: chatUserDecryptId,
			inChat: 0,
			consultationFlag: 0,
			scheduleDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
		};

		const createObj1 = {
			loginUserId: chatUserDecryptId,
			chatUserId: loginDecryptId,
			inChat: 0,
			consultationFlag: 0,
			scheduleDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
		};

		if (!chatExist) {
			await chatMaster.create(createObj);
			await chatMaster.create(createObj1);

			console.log("New Chat Master  Created", createObj, createObj1);
		}
		/**
		 * SUCCESS
		 */

		var response = true;
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return common.responseModel.successResponse(successOrError.AddChat, response, []);
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
}

module.exports = {
	addToChatMaster,
};
