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
 * UPDATE SOCKET ID
 * @param {Object} req
 * @returns {Object}
 */

async function getConnectStatus(data, socket) {
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

		if (data.sendBy == "1") {
			var socketId = await usersCollection.findOne({
				where: { id: appointmentExists.dataValues.therapistId, isDeleted: 0 },
			});
		} else {
			var socketId = await usersCollection.findOne({
				where: { id: appointmentExists.dataValues.patientId, isDeleted: 0 },
			});
		}

		if (!socketId) {
			var successOrError = common.responseServices.successOrErrors("err_136");
			var resobj = common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);
		}
		let responseObj = {
			appointmentId: data.appointmentId,
			sendBy: data.sendBy,
			connectStatus: data.connectStatus,
		};
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		var response = await common.responseModel.successResponse(
			successOrError.getConnectStatus,
			responseObj,
			{}
		);
		return { response, socketId: socketId.socketId };
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
	getConnectStatus,
};
