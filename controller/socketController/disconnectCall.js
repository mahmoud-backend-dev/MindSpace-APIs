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
 * DISCONNECT CALL
 * @param {Object} req
 * @returns Object
 */

async function disconnectCall(data, socket) {
	try {
		var decryptedAppointmentId = await common.helpers.decryptData(data.appointmentId);

		if (!decryptedAppointmentId) {
			var successOrError = await common.responseServices.successOrErrors("err_66");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);

			return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
		}

		var appointmentExists = await appointments.findOne({ where: { id: decryptedAppointmentId } });

		if (!appointmentExists) {
			var successOrError = await common.responseServices.successOrErrors("err_67");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);

			return common.responseModel.successResponse(successOrError.message, {}, {});
		}

		var patientSocketId = await usersCollection.findOne({
			where: { id: appointmentExists.dataValues.patientId, isDeleted: 0 },
		});

		var therapistSocketId = await usersCollection.findOne({
			where: { id: appointmentExists.dataValues.therapistId, isDeleted: 0 },
		});

		var socketIdData = [
			patientSocketId.dataValues.socketId,
			therapistSocketId.dataValues.socketId,
		];

		if (socketIdData.length == 0) {
			var successOrError = common.responseServices.successOrErrors("err_66");
			var resobj = common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);
		}

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		var response = await common.responseModel.successResponse(
			successOrError.disconnectSuccess,
			[],
			{}
		);
		return { response, socketIdData };
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
	disconnectCall,
};
