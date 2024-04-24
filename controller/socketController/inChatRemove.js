/**
 * HELPERS
 */

var common = require("../common");
/**
 * DATABASE
 */
const users = common.db.users;
const chat_master = common.db.chatMaster;

/**
 * IN CHAT REMOVE
 * @param {Object} req
 * @returns Object
 */

async function inChatRemove(data, socket) {
	try {
		const logged_user_id = await common.helpers.decryptData(data.loginUserId);
		const chat_user_id = await common.helpers.decryptData(data.chatUserId);

		var LoggedUserData = await users.findOne({ where: { id: logged_user_id, isDeleted: 0 } });

		if (LoggedUserData) {
			var ChatUserData = await users.findOne({ where: { id: chat_user_id, isDeleted: 0 } });

			if (ChatUserData) {
				var chatData = await chat_master.findOne({
					where: { loginUserId: logged_user_id, chatUserId: chat_user_id },
				});

				if (chatData) {
					var updateArr = {
						"inChat": false,
					};

					await chat_master.update(updateArr, {
						where: { loginUserId: logged_user_id, chatUserId: chat_user_id },
					});

					var SuccessOrError = await common.responseServices.successOrErrors("successMessage");
					return common.responseModel.successResponse(SuccessOrError.success, "");
				}
			} else {
				var SuccessOrError = await common.responseServices.successOrErrors("err_136");
				var resobj = await common.responseModel.resObj(
					SuccessOrError.message,
					SuccessOrError.parameters.chatUserId,
					SuccessOrError.location
				);
				return common.responseModel.failResponse(SuccessOrError.fail_msg, [], resobj);
			}
		} else {
			var SuccessOrError = await common.responseServices.successOrErrors("err_136");
			var resobj = await common.responseModel.resObj(
				SuccessOrError.message,
				SuccessOrError.parameters.loginUserId,
				SuccessOrError.location
			);
			return common.responseModel.failResponse(SuccessOrError.fail_msg, [], resobj);
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
}

module.exports = {
	inChatRemove,
};
