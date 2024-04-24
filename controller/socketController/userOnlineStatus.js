/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const users = common.db.users;
const appointmentCollection = common.db.appointments;

/**
 * Last seen
 * @param {Integer} loginUserId
 * @returns
 */
async function userLoginStatus(data) {
	try {
		const appointmentId = await common.helpers.decryptData(data.appointmentId);

		var appointmentData = await appointmentCollection.findOne({ where: { id: appointmentId } });
		if (!appointmentData) {
			var successOrError = await common.responseServices.successOrErrors("err_67");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
		}

		var patientData = await users.findOne({
			where: { id: appointmentData.patientId, isDeleted: 0 },
		});
		var therapistData = await users.findOne({
			where: { id: appointmentData.therapistId, isDeleted: 0 },
		});

		if (!patientData || !therapistData) {
			var successOrError = await common.responseServices.successOrErrors("err_136");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
		}

		var successOrError = await common.responseServices.successOrErrors("successMessage");

		const response = {
			response: await common.responseModel.successResponse(
				successOrError.OnlineStatus,
				{
					"isPatientOnline": patientData.onlineStatus,
					"isTherapistOnline": therapistData.onlineStatus,
				},
				{}
			),
			socketId: {
				patient: patientData.socketId,
				therapist: therapistData.socketId,
			},
		};
		return response;
	} catch (error) {
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
	userLoginStatus,
};
