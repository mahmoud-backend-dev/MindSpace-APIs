/**
 * HELPERS
 */
var common = require("../common");
const { Sequelize } = require("../../schema/db");
/**
 * DATABASE
 */
const users = common.db.users;
const chat_master = common.db.chatMaster;

/**
 * Online & Offline
 * @param {Integer} user_id
 * @param {Boolean} is_online
 * @returns
 */
async function OnlineOffline(user_id, is_online) {
	try {
		var UserData = await users.findOne({ where: { id: user_id, isDeleted: 0 } });

		if (UserData) {
			var updateArr = {
				onlineStatus: is_online,
				activeAt: Sequelize.literal("CURRENT_TIMESTAMP"),
			};

			await users.update(updateArr, { where: { id: user_id } });

			var User = await users.findOne({
				attributes: ["onlineStatus", "activeAt"],
				where: {
					id: user_id,
				},
			});

			if (User) {
				var USER = await common.helpers.encryptData(user_id);

				var obj = {
					user_id: USER,
					is_online: User.dataValues.onlineStatus,
					activeAt: User.dataValues.activeAt,
				};
			}

			var Inchat = await chat_master.findOne({
				where: { loginUserId: user_id, inChat: 1 },
			});

			if (Inchat) {
				var object = {
					inChat: false,
				};
				await chat_master.update(object, {
					where: { loginUserId: user_id, inChat: 1 },
				});
			}
			if (is_online == 0) {
				var successOrError = await common.responseServices.successOrErrors("successMessage");
				return common.responseModel.successResponse(successOrError.OnlineStatus, obj);
			} else if (is_online == 2) {
				var successOrError = await common.responseServices.successOrErrors("successMessage");
				return common.responseModel.successResponse(successOrError.OfflineStatus, obj);
			}
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_136");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);

			return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
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
	OnlineOffline,
};
