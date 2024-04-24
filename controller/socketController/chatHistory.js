/**
 * HELPERS
 */
var common = require("../common");
const { Op } = require("sequelize");
const bucketName = process.env.AWS_BUCKETNAME;
const profileImage = process.env.AWS_UPLOAD_PATH_FOR_PROFILE;
/**
 * DATABASE
 */
const usersCollection = common.db.users;
const chat_master = common.db.chatMaster;
const chat = common.db.chat;
const chat_conversation = common.db.chatConversation;

/**
 * CHAT HISTORY
 * @param {Object} req
 * @returns Object
 */

async function chatHistory(data, socket) {
	try {
		var logged_user_id;
		var chat_user_id;

		var page = data.page;
		var limit = data.limit;

		if (page && page > 0) {
			page = parseInt(data.page);
		} else {
			page = 1; // DEFAULT 1
		}

		if (limit && limit > 0) {
			limit = parseInt(data.limit);
		} else {
			limit = 20; // DEFAULT 20
		}

		if (data.sort == 0) {
			sort_order = "ASC";
		} else {
			sort_order = "DESC";
		}

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
			logged_user_id = await common.helpers.decryptData(data.loginUserId);

			if (logged_user_id != false) {
				var LoggedUserData = await common.query.findOne(usersCollection, {
					where: { id: logged_user_id, isDeleted: 0 },
				});

				if (LoggedUserData == null) {
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
			var chat_user_id = await common.helpers.decryptData(data.chatUserId);

			if (chat_user_id != false) {
				var ChatUserData = await common.query.findOne(usersCollection, {
					where: { id: chat_user_id },
				});

				if (ChatUserData == null) {
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

		var skip = (page - 1) * limit;

		if (LoggedUserData && ChatUserData) {
			/** Based on isFromService Update inChat status and readStatus */
			if (data.isFromService == true) {
				var inchat = await chat_master.findOne({
					where: { loginUserId: logged_user_id, inChat: 1 },
				});
				if (inchat) {
					var updateArr = {
						inChat: 0,
					};
					await chat_master.update(updateArr, {
						where: { loginUserId: logged_user_id, inChat: 1 },
					});
				}
				var InChatarr = {
					inChat: 1,
				};
				await chat_master.update(InChatarr, {
					where: { loginUserId: logged_user_id, chatUserId: chat_user_id },
				});
				var upd = {
					readStatus: true,
				};
				// conversation chat
				if(data.chatType == 0){
					await chat_conversation.update(upd, {
						where: { receiverId: logged_user_id, senderId: chat_user_id },
					});
				}else{
					// session chat
					await chat.update(upd, {
						where: { receiverId: logged_user_id, senderId: chat_user_id },
					});
				}
			}

			var historyData;
			// conversation chat
			if(data.chatType == 0){
				historyData = await chat_conversation.findAndCountAll({
					where: {
						[Op.or]: [
							{
								receiverId: chat_user_id,
								senderId: logged_user_id,
							},
							{
								receiverId: logged_user_id,
								senderId: chat_user_id,
							},
						],
					},
					offset: skip,
					limit: limit,
					order: [["id", sort_order]],
				});
			}else{
				// session chat
				historyData = await chat.findAndCountAll({
					where: {
						[Op.or]: [
							{
								receiverId: chat_user_id,
								senderId: logged_user_id,
							},
							{
								receiverId: logged_user_id,
								senderId: chat_user_id,
							},
						],
					},
					offset: skip,
					limit: limit,
					order: [["id", sort_order]],
				});
			}

			/** START */

			if (historyData.count != 0) {
				var data = [];

				var bucket = bucketName + "/" + profileImage;

				for (i = 0; i < historyData.rows.length; i++) {
					var data_id = await common.helpers.encryptData(historyData.rows[i].dataValues.id);
					var senderId = await common.helpers.encryptData(
						historyData.rows[i].dataValues.senderId
					);
					var receiverId = await common.helpers.encryptData(
						historyData.rows[i].dataValues.receiverId
					);

					if (historyData.rows[i].dataValues.messageType == 1) {
						fetchMessage = await common.helpers.fetchFileFromS3(
							historyData.rows[i].dataValues.message,
							bucket
						);
					} else {
						fetchMessage = historyData.rows[i].dataValues.message;
					}

					var obj = {
						id: data_id,
						sender_id: senderId,
						receiver_id: receiverId,
						sendBy: historyData.rows[i].dataValues.sendBy,
						sendBy: historyData.rows[i].dataValues.sendBy,
						messageType: historyData.rows[i].dataValues.messageType,
						message: fetchMessage,
						// message: historyData.rows[i].dataValues.message,
						read_status: historyData.rows[i].dataValues.readStatus,
						createdAt: historyData.rows[i].dataValues.createdAt,
						updatedAt: historyData.rows[i].dataValues.updatedAt,
					};

					data.push(obj);
				}
				var pagination = await common.pagination(limit, page, historyData.count);
				/** SUCCESS RESPONSE  */
				var successOrError = await common.responseServices.successOrErrors("successMessage");

				return common.responseModel.successGetResponse(
					successOrError.chatHist,
					data,
					{},
					pagination
				);
			} else {
				var successOrError = await common.responseServices.successOrErrors("err_106");
				var resobj = await common.responseModel.resObj(
					successOrError.message,
					successOrError.parameters.history,
					successOrError.location
				);
				return await common.responseModel.successResponse(
					successOrError.successGetResponse,
					[],
					resobj
				);
			}
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
	chatHistory,
};
