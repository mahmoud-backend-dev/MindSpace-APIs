/**
 * HELPERS
 */
var socketIndex = require("./index");
var common = require("../common");
const socketJwt = require("../../helpers/jwt");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");

/**
 * DATABASE
 */

const users = common.db.users;
const chat_master = common.db.chatMaster;
const appointments = common.db.appointments;

/**
 * CONNECT CALL
 * @param {Object} socket
 */
async function connectCall(socket) {
	socket.on("connectCall", async (data) => {
		var response = await socketIndex.connectCall.connect(data);

		socket.emit("connectCallResponse", response);
	});
}

/**
 * UPDATE SOCKET ID
 * @param {Object} socket
 */

async function updateSocketId(socket) {
	socket.on("updateUserSocketId", async (data) => {
		var response = await socketIndex.updateSocketId.updateSocketId(data, socket);
		socket.emit("updateSocketIdResponse", response);
	});
}

/**
 * ADD To CHATMASTER
 */

async function addToChat(socket) {
	socket.on("addToChat", async (data) => {
		var response = await socketIndex.addToChat.addToChatMaster(data, socket);
		socket.emit("addToChatResponse", response);
	});
}

/**
 * GET USER LIST FROM CHATMASTER
 */

async function userChatList(socket) {
	socket.on("chatUserList", async (data) => {
		var response = await socketIndex.userList.getUserList(data, socket);
		console.log("--------------------");
		console.log("chatUserList", response);
		console.log("--------------------");

		var UserId = await common.helpers.decryptData(data.loginUserId);

		var UserData = await users.findOne({ where: { id: UserId } });

		if (UserData) {
			socket.to(UserData.dataValues.socketId).emit("chatUserList", response);
			socket.emit("chatUserListResponse", response);
		} else {
			socket.emit("chatUserListResponse", response);
		}
	});
}

/** SOCKET CHAT */

async function chatMessage(socket) {
	socket.on("chat", async (data) => {
		var response = await socketIndex.chatMessage.Chat(data, socket);
		console.log(response);
		if (response) {
			var socketId = response.data.socket_id;
			socket.to(socketId).emit("chatResponse", response);
			console.log("-----------------------------------------------------");
			console.log("receiver_id", response.data.receiver_id);
			console.log("sender_id", response.data.sender_id);
			console.log("message", response.data.message);

			console.log("-----------------------------------------------------");
			socket.emit("chatResponse", response);
		} else {
			socket.emit("chatResponse", response);
		}
	});
}

/** Chat HOSTORY  */

async function history(socket) {
	socket.on("chatHistory", async (data) => {
		var response = await socketIndex.history.chatHistory(data);

		const chat_user_id = await common.helpers.decryptData(data.chatUserId);

		var dataUser = await users.findOne({ where: { id: chat_user_id } });

		if (dataUser) {
			// socket.to(dataUser.dataValues.socketId).emit("MsgSeenResponse", stats);
			socket.emit("chatHistoryResponse", response);
		} else {
			socket.emit("chatHistoryResponse", response);
		}
	});
}

/** ONLINE USER */
async function onlineUser(socket) {
	socket.on("online", async (data) => {
		const UserId = await common.helpers.decryptData(data.loginUserId);

		var response = await socketIndex.online.OnlineOffline(UserId, "0"); //0 :online , 1 : busy , 2:offline

		var chatData = await chat_master.findAndCountAll({
			attributes: ["loginUserId"],
			where: { chatUserId: UserId },
		});

		if (chatData.rows.length != 0) {
			for (let int = 0; int < chatData.rows.length; int++) {
				if (typeof chatData.rows[int] != "undefined") {
					if (
						typeof chatData.rows[int].dataValues.loginUserId != "undefined" &&
						chatData.rows[int].dataValues.loginUserId != ""
					) {
						const data = {
							loginUserId: chatData.rows[int].dataValues.loginUserId,
						};
						var userlist = await socketIndex.userList.getUserList(data, socket);
						var UserData = await users.findOne({
							where: { id: chatData.rows[int].dataValues.loginUserId },
						});

						if (UserData) {
							var socketId = UserData.dataValues.socketId;

							socket.to(socketId).emit("chatUserListResponse", userlist);
							// socket.to(socketId).emit("lastSeenResponse", response);
						}
					}
				}
			}
		}

		socket.emit("onlineResponse", response);
	});
}

/**
 * Offline User
 * @param {Object} socket
 */
async function offlineUser(socket) {
	socket.on("offline", async (data) => {
		const UserId = await common.helpers.decryptData(data.loginUserId);
		var response = await socketIndex.offline.OnlineOffline(UserId, "2"); //0 :online , 1 : busy , 2:offline
		var chatData = await chat_master.findAndCountAll({
			attributes: ["loginUserId"],
			where: { chatUserId: UserId },
		});

		if (chatData.count != 0) {
			for (int = 0; int < chatData.count; int++) {
				if (
					typeof chatData.rows[int].dataValues.loginUserId != "undefined" &&
					chatData.rows[int].dataValues.loginUserId != ""
				) {
					var socketId;
					var UserData = await users.findOne({
						where: { id: chatData.rows[int].dataValues.loginUserId },
					});

					if (UserData) {
						socketId = UserData.dataValues.socketId;
					}

					const data = {
						loginUserId: chatData.rows[int].dataValues.loginUserId,
					};
					var userlist = await socketIndex.userList.getUserList(data, socket);
					socket.to(socketId).emit("chatUserListResponse", userlist);
				}
			}
		}

		socket.emit("offlineResponse", response);
	});
}

/**
 * LAST SEEN
 */
// async function lastSeen(socket) {
//     socket.on("lastSeen", async(data) => {
//       var response  = await socketIndex.lastSeen.lastSeen(data)
//       socket.emit("lastSeenResponse", response)
//   })
// };

/**
 * USER ONLINE STATUS
 */
async function userOnLineStatus(socket) {
	socket.on("userLoginStatus", async (data) => {
		var response = await socketIndex.userLogin.userLoginStatus(data);
		//socket.emit("userLoginStatusResponse", response.response);
		socket.to(response.socketId.patient).emit("userLoginStatusResponse", response.response);
		socket.to(response.socketId.therapist).emit("userLoginStatusResponse", response.response);
	});
}

/**
 * Remove In Chat
 * @param {Object} socket
 */
async function RemoveInchat(socket) {
	socket.on("removeInChat", async (data) => {
		var response = await socketIndex.inChat.inChatRemove(data);
		socket.emit("removeInChatResponse", response);
	});
}

/**
 * Update Appointment Service Status
 * @param {Object} socket
 */
async function updateAppointment(socket) {
	socket.on("serviceStatusUpdate", async (data) => {
		const appointment_Id = await common.helpers.decryptData(data.appointmentId);

		const loginid = await common.helpers.decryptData(data.loginId);

		const service_status = data.serviceStatus;
		const time = data.time;
		const type = data.sessionType; // O for Text ,1 for audio, 2 video

		var response = await socketIndex.appointmentStatus.appointmentReadingStatus(
			appointment_Id,
			service_status,
			time,
			type,
			loginid,
			socket
		);

		/** accepted or started */
		if (service_status != "4" && service_status != "1") {
			var appointmentData = await appointments.findOne({
				where: { id: appointment_Id },
			});
			var therapiestUserData = await users.findOne({
				where: { id: appointmentData.therapistId },
			});

			var patientUserData = await users.findOne({
				where: { id: appointmentData.patientId },
			});

			if ((therapiestUserData, patientUserData)) {
				const therpiestSocketId = therapiestUserData.dataValues.socketId;
				const patientSocketId = patientUserData.dataValues.socketId;

				socket.emit("serviceStatusUpdateResponse", response);
				socket.to(therpiestSocketId).emit("serviceStatusUpdateResponse", response);
				socket.to(patientSocketId).emit("serviceStatusUpdateResponse", response);
			}
		} else {
			socket.emit("serviceStatusUpdateResponse", response);
		}
	});
}

/**
 * Update Appointment Service Status
 * @param {Object} socket
 */
async function timer(socket) {
	socket.on("appointmentTimer", async (data) => {
		const appointment_Id = await common.helpers.decryptData(data.appointmentId);
		var response = await socketIndex.appointmentTimer.timerSocket(data, socket);

		if (response && response?.data?.timer == false) {
			var socketId;
			var appointmentData = await appointments.findOne({
				where: { id: appointment_Id },
			});

			var id = await common.helpers.encryptData(appointmentData.id);

			var SuccessOrError = await common.responseServices.successOrErrors("successMessage");
			var Obj = {
				appointmentId: id,
				serviceStatus: appointmentData.serviceStatus,
				time: "",
				sessionType: appointmentData.interactionType,
				loginId: "",
			};
			var resObj = await common.responseModel.successResponse(
				SuccessOrError.serviceStatus,
				Obj,
				""
			);

			socket.emit("serviceStatusUpdateResponse", resObj);
			var UserData = await users.findOne({
				where: { id: appointmentData.therapistId },
			});

			await appointments.findOne({
				where: { id: appointment_Id },
			});
			if (UserData) {
				socketId = UserData.dataValues.socketId;
				socket.to(socketId).emit("appointmentTimerResponse", response);
				socket.emit("appointmentTimerResponse", response);
			}
		} else {
			socket.emit("appointmentTimerResponse", response);
		}
	});
}

/**
 * get connect status
 * @param {Object} socket
 */
async function getConnectStatus(socket) {
	socket.on("getConnectStatus", async (data) => {
		var response = await socketIndex.getConnectStatus.getConnectStatus(data, socket);
		if (response.code != 400) {
			socket.to(response.socketId).emit("getConnectStatusResponse", response.response);
			socket.emit("getConnectStatusResponse", response.response);
		} else {
			socket.emit("getConnectStatusResponse", response.response);
		}
	});
}

/**
 * get connect status
 * @param {Object} socket
 */
async function disconnectCall(socket) {
	socket.on("disconnectCall", async (data) => {
		var response = await socketIndex.disconnectCall.disconnectCall(data, socket);

		if (response.code != 400) {
			socket.to(response.socketIdData[0]).emit("disconnectCallResponse", response.response);
			socket.to(response.socketIdData[1]).emit("disconnectCallResponse", response.response);
			socket.emit("disconnectCallResponse", response.response);
		} else {
			socket.emit("disconnectCallResponse", response.response);
		}
	});
}

async function disConnectSocket(socket) {
	var response = await socketIndex.disConnectSocket.disconnectSocket(socket.id);

	if (response && response.socketId) {
		if (response.isChat == 1) {
			socket.to(response.socketId).emit("userLoginStatusResponse", response.response);
		} else {
			socket.to(response.socketId).emit("serviceStatusUpdateResponse", response.response);
			socket.to(socket.id).emit("serviceStatusUpdateResponse", response.response);
		}
	} else {
		if (response.isChat == 1) {
			socket.to(socket.id).emit("userLoginStatusResponse", response.response);
		} else {
			socket.to(socket.id).emit("serviceStatusUpdateResponse", response);
		}
	}
}

module.exports = {
	connectCall,
	updateSocketId,
	addToChat,
	userChatList,
	chatMessage,
	history,
	onlineUser,
	offlineUser,
	// lastSeen,
	userOnLineStatus,
	RemoveInchat,
	updateAppointment,
	timer,
	getConnectStatus,
	disconnectCall,
	disConnectSocket,
};
