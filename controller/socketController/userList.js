/**
 * HELPERS
 */

const { Op } = require("sequelize");
var common = require("../common");
/**
 * DATABASE
 */
const users = common.db.users;
const chat_master = common.db.chatMaster;
const chat = common.db.chat;
const chat_conversation = common.db.chatConversation;

/**
 * GET USER LIST SOCKET
 * @param {Object} req
 * @returns Object
 */

async function getUserList(data, socket) {
	try {
		var page = typeof data.page != "undefined" ? data.page : 1;
		var limit = typeof data.limit != "undefined" ? data.limit : 10;
		var sort_order = "DESC";
		var skip = (page - 1) * limit;

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
				var loginUsersDetails = await common.query.findOne(users, {
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
				var successOrError = await common.responseServices.successOrErrors("err_19");

				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.userId,
					successOrError.location
				);

				return await common.responseModel.failResponse(successOrError.failMsg, [], resobj);
			}
		}

		var UserData = await users.findOne({ where: { id: loginDecryptId } });

		var userReturnData = [];
		var findFrdUserList = await chat_master.findAndCountAll({
			where: {
				loginUserId: loginDecryptId,
				consultationFlag: true,
			},
			skip: skip,
			limit: limit,
			order: [["updatedAt", sort_order]],
		});

		for (let i = 0; i < findFrdUserList.rows.length; i++) {
			var findUser = await users.findOne({
				where: { id: findFrdUserList.rows[i].dataValues.chatUserId },
			});

			var findLastMsg = await chat_conversation.findOne({
				where: {
					[Op.or]: [
						{
							senderId: findFrdUserList.rows[i].dataValues.loginUserId,
							receiverId: findFrdUserList.rows[i].dataValues.chatUserId,
						},
						{
							senderId: findFrdUserList.rows[i].dataValues.chatUserId,
							receiverId: findFrdUserList.rows[i].dataValues.loginUserId,
						},
					],
				},

				order: [["createdAt", "DESC"]],
			});

			var hist = {};

			if (findLastMsg != null) {
				var hist_id = await common.helpers.encryptData(findLastMsg.dataValues.id);
				var senderId = await common.helpers.encryptData(findLastMsg.dataValues.sender_id);
				var receiverId = await common.helpers.encryptData(findLastMsg.dataValues.receiver_id);

				hist = {
					id: hist_id,
					receiver_id: receiverId,
					sender_id: senderId,
					sender_name: findLastMsg.dataValues.sender_name,
					message: findLastMsg.dataValues.message,
					messageType: findLastMsg.dataValues.messageType,
					read_status: findLastMsg.dataValues.read_status,
					createdAt: findLastMsg.dataValues.createdAt,
					updatedAt: findLastMsg.dataValues.updatedAt,
				};
			} else {
				NoHistoryId = findFrdUserList.rows[i].dataValues.chatUserId;
			}

			var encryptUserId = await common.helpers.encryptData(
				findFrdUserList.rows[i].dataValues.id
			);
			var logged_user = await common.helpers.encryptData(
				findFrdUserList.rows[i].dataValues.loginUserId
			);
			var chatUserId = await common.helpers.encryptData(
				findFrdUserList.rows[i].dataValues.chatUserId
			);
			var profile = "";

			if (
				typeof findUser.dataValues.profileImage != "undefined" &&
				findUser.dataValues.profileImage != ""
			) {
				profile = await common.helpers.fetchFileFromS3(
					findUser.dataValues.profileImage,
					process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
				);
			} else {
				profile = "";
			}
			var obj = {
				id: encryptUserId,
				logged_user_id: logged_user,
				chat_user_id: chatUserId,
				chat_user_name: findUser.dataValues.firstName + " " + findUser.dataValues.lastName,
				onlineStatus: findUser.dataValues.onlineStatus,
				chat_user_profile: profile,
				historyData: hist,
				socket_id: UserData.dataValues.userSocketId,
				createdAt: findFrdUserList.rows[i].dataValues.createdAt,
				updatedAt: findFrdUserList.rows[i].dataValues.updatedAt,
			};
			userReturnData.push(obj);
		}

		/**
		 * SUCCESS
		 */
		var pagination = await common.pagination(limit, page, findFrdUserList.count);
		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return common.responseModel.successGetResponse(
			successOrError.chatusers,
			userReturnData,
			{},
			pagination
		);
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
	getUserList,
};
