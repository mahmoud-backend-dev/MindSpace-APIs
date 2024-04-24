/**
 * HELPERS
 */
var common = require("../common");
/**
 * DATABASE
 */
const appointments = common.db.appointments;
const usersCollection = common.db.users;

/**
 * DISCONNECT SOCKET
 * @param {Object} req
 * @returns {Object}
 */

async function disconnectSocket(data) {
	var userExist = await usersCollection.findOne({ where: { socketId: data, isDeleted: 0 } });
	if (userExist) {
		await usersCollection.update({ onlineStatus: "2" }, { where: { id: userExist.id } });
		if (userExist.role == 0) {
			var userId = { therapistId: userExist.id, serviceStatus: "4" };
		} else {
			var userId = { patientId: userExist.id, serviceStatus: "4" };
		}

		var user2 = await appointments.findOne({ where: userId });

		if (user2) {
			var SuccessOrError = await common.responseServices.successOrErrors("successMessage");

			if (userExist.role == 0) {
				var id = { id: user2.patientId };
			} else {
				var id = { id: user2.therapistId };
			}

			var socketData = await usersCollection.findOne({ where: id, isDeleted: 0 });
			var response = {
				response: "",
				socketId: socketData.socketId,
				isChat: 0,
			};
			if (user2.interactionType == "0") {
				var patientData = await usersCollection.findOne({ where: { id: user2.patientId } });
				var therapistData = await usersCollection.findOne({ where: { id: user2.therapistId } });

				response.response = await common.responseModel.successResponse(
					SuccessOrError.OnlineStatus,
					{
						"isPatientOnline": patientData.onlineStatus,
						"isTherapistOnline": therapistData.onlineStatus,
					},
					{}
				);
				response.isChat = 1;
			} else {
				if (socketData) {
					appointments.update(
						{ status: "0", serviceStatus: "0" },
						{ where: { id: user2.id } }
					);
					response.response = await common.responseModel.successResponse(
						SuccessOrError.serviceStatus,
						{
							"serviceStatus": "0",
							"status": "0",
							"sessionType": user2.interactionType,
						},
						{}
					);
				}
			}
			return response;
		}
	}
}

module.exports = {
	disconnectSocket,
};
