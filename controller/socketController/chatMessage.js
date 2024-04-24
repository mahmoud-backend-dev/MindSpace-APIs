/**
 * HELPERS
 */

const { chatSession } = require("../../schema/db");
var common = require("../common");

const bucketName = process.env.AWS_BUCKETNAME;
const profileImage = process.env.AWS_UPLOAD_PATH_FOR_PROFILE;
/**
 * DATABASE
 */
const users = common.db.users;
const chat_master = common.db.chatMaster;
const chat = common.db.chat;
const chatConversation = common.db.chatConversation;

/**
 *CHAT MESSAGE SOCKET
 * @param {Object} req
 * @returns Object
 */

async function Chat(data, socket) {
	try {
		var receiverId;
		var senderId;

		/** SENDER ID VALIDATION */
		if (data.senderId == "" || typeof data.senderId == "undefined") {
			/**
			 * REQUIRED FIELD : LOGIN USER ID
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.senderId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			senderId = await common.helpers.decryptData(data.senderId);

			if (senderId != false) {
				var senderUsersDetails = await common.query.findOne(users, {
					where: { id: senderId, isDeleted: 0 },
				});

				if (senderUsersDetails == null) {
					/**
					 * USER NOT FOUND
					 */

					var successOrError = await common.responseServices.successOrErrors("err_19");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.senderId,
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

		/** RECEIVER ID VALIDATION */
		if (data.receiverId == "" || typeof data.receiverId == "undefined") {
			/**
			 * REQUIRED FIELD : LOGIN USER ID
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.receiverId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			receiverId = await common.helpers.decryptData(data.receiverId);

			if (receiverId != false) {
				var receiverUsersDetails = await common.query.findOne(users, {
					where: { id: receiverId, isDeleted: 0 },
				});

				if (receiverUsersDetails == null) {
					/**
					 * USER NOT FOUND
					 */

					var successOrError = await common.responseServices.successOrErrors("err_19");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.receiverId,
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

		if (typeof data.sendBy != "undefined") {
			if (data.sendBy != 0 && data.sendBy != 1) {
				/**
				 * INVALID VALUE FOR SEND BY
				 */

				var successOrError = await common.responseServices.successOrErrors("err_137");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.sendBy,
					successOrError.location
				);
				return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		} else {
			/**
			 * REQUIRED FIELD : SEND BY
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.sendBy,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var obj = {};
		if (data.messageType == "1") {
			/** SHARE IMAGE */

			const base64Data = data.message;
			var bucket = bucketName + "/" + profileImage;

			/** BASE64 To BUFFER && STORE IN AWS  */
			const image = await common.helpers.base64ToBufferAWS(base64Data, bucket);

			// Conversation chat
			if(data.chatType == 0){
				obj = {
					receiverId: receiverId,
					senderId: senderId,
					message: image,
					readStatus: false,
					sendBy: data.sendBy,
					messageType: data.messageType,
				};
			}else{
				// Session chat
				obj = {
					receiverId: receiverId,
					senderId: senderId,
					message: image,
					readStatus: false,
					sendBy: data.sendBy,
					messageType: data.messageType,
					appointmentId: await common.helpers.decryptData(data.appointmentId),
				};
			}
		} else {
			/** SIMPLE TEXT TO SEND  */
			// chatConversation chat
			if(data.chatType == 0){
				obj = {
					receiverId: receiverId,
					senderId: senderId,
					message: data.message,
					readStatus: false,
					sendBy: data.sendBy,
					messageType: data.messageType,
				};
			}else{
				// session chat
				obj = {
					receiverId: receiverId,
					senderId: senderId,
					message: data.message,
					readStatus: false,
					sendBy: data.sendBy,
					messageType: data.messageType,
					appointmentId: await common.helpers.decryptData(data.appointmentId),
				};
			}
			
		}

		var ReceiverData = await users.findOne({
			where: { id: receiverId, isDeleted: 0 },
		});

		/** RECEIVER DATA CONDITION */
		if (ReceiverData) {
			var SenderData = await users.findOne({
				where: { id: senderId, isDeleted: 0 },
			});

			/** SENDER DATA CONDITION */
			if (SenderData) {
				var inChat = await chat_master.findOne({
					where: { loginUserId: senderId, chatUserId: receiverId },
				});

				if (inChat) {
					/** UPDATE consultationFlag TO TRUE */

					const updateConsObj = {
						consultationFlag: true,
					};
					await chat_master.update(updateConsObj, {
						where: { loginUserId: senderId, chatUserId: receiverId },
					});
					await chat_master.update(updateConsObj, {
						where: { loginUserId: receiverId, chatUserId: senderId },
					});

					var createchat;
					var getdata;

					// Conversation chat
					if(data.chatType == 0){
						createchat = await chatConversation.create(obj);
						getdata = await chatConversation.findOne({
							where: { id: createchat.dataValues.id },
						});
					}else{
						createchat = await chat.create(obj);
						getdata = await chat.findOne({
							where: { id: createchat.dataValues.id },
						});
					}

					if (getdata) {
						var readStatus = await chat_master.findOne({
							where: {
								loginUserId: receiverId,
								chatUserId: senderId,
							},
						});

						var read = false;

						/** UPDATE READ STATUS */
						if (readStatus && readStatus.dataValues.inChat == 1) {
							read = true;

							var updateObj = {
								readStatus: read,
							};
							await chat.update(updateObj, {
								where: { receiverId: receiverId, senderId: senderId },
							});
						} else {
							var recieverUser = await users.findOne({
								where: { id: receiverId },
							});
							var senderUser = await users.findOne({ where: { id: senderId } });
							var bodySend = data.messageType == "1" ? "Photo" : obj.message;
							var titleSend = `${senderUser.firstName + " " + senderUser.lastName}`;
							var typeSend = "chat_service";

							var profileImg = senderUser.profileImage
								? await common.helpers.fetchFileFromS3(
										senderUser.profileImage,
										process.env.AWS_BUCKETNAME +
											"/" +
											process.env.AWS_UPLOAD_PATH_FOR_PROFILE
								  )
								: "";

							var extraObj;
							// dafault chat
							if(data.chatType == 0){
								extraObj = {
									appointmentId: data.appointmentId,
									userName: senderUser.firstName + " " + senderUser.lastName,
									profile: profileImg,
									chatUserId: await common.helpers.encryptData(senderUser.id),
								};
							}
							else{
								extraObj = {
									userName: senderUser.firstName + " " + senderUser.lastName,
									profile: profileImg,
									chatUserId: await common.helpers.encryptData(senderUser.id),
								};
							}
							const fcmToken = recieverUser.deviceToken;

							const result = await common.notification.sendSingleFirebaseNotification(
								fcmToken,
								bodySend,
								titleSend,
								typeSend,
								extraObj
							);
						}

						/** FOR IMAGE URL FETCH */
						var fetchMessage = "";

						if (createchat.dataValues.messageType == 1) {
							fetchMessage = await common.helpers.fetchFileFromS3(
								createchat.dataValues.message,
								bucket
							);
						} else {
							fetchMessage = createchat.dataValues.message;
						}

						var dataObj = {
							receiver_id: await common.helpers.encryptData(receiverId),
							sender_id: await common.helpers.encryptData(senderId),
							message: fetchMessage,
							read_status: read,
							sendBy: data.sendBy,
							messageType: data.messageType,
							socket_id: ReceiverData.dataValues.socketId,
							sender_socket_id: SenderData.dataValues.socketId,
							createdAt: getdata.dataValues.createdAt,
						};

						/** SUCCESS RESPONSE  */
						var successOrError = await common.responseServices.successOrErrors(
							"successMessage"
						);
						return await common.responseModel.successResponse(
							successOrError.msgSent,
							dataObj
						);
					}
				} else {
					var successOrError = await common.responseServices.successOrErrors("err_135");
					var resobj = await common.responseModel.resObj(
						successOrError.message,
						"",
						successOrError.location
					);
					return await common.responseModel.failResponse(
						successOrError.failMsg,
						[],
						resobj,
						"err_135"
					);
				}
			} else {
				/** SENDER DATA NOT EXIST */
				var successOrError = await common.responseServices.successOrErrors("err_136");
				var resobj = await common.responseModel.resObj(
					successOrError.message,
					successOrError.parameters.senderId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, [], resobj);
			}
		} else {
			/** RECEIVER DATA NOT EXIST */
			var successOrError = await common.responseServices.successOrErrors("err_136");
			var resobj = await common.responseModel.resObj(
				successOrError.message,
				successOrError.parameters.receiverId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, [], resobj);
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
	Chat,
};
