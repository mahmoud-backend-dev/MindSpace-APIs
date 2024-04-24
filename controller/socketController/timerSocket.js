/**
 * HELPERS
 */
var common = require("../common");
const moment = require("moment");
const chat = common.db.chat;
/**
 * DATABASE
 */
const appointments = common.db.appointments;

/**
 * TIMER SOCKET
 * @param {Object} req
 * @returns Object
 */

async function timerSocket(data, socket) {
	try {
		const appointment_Id = await common.helpers.decryptData(data.appointmentId);

		const time = data.time;

		var appointmentData = await appointments.findOne({
			where: { id: appointment_Id },
		});

		const endTime = moment(appointmentData.slotEndTime).utc().add(30, 'minutes'); //DB
		const givenTime = moment(time).utc(); //GIVEN

		var flag = {};
		if (endTime >= givenTime) {
			flag = {
				timer: true,
			};
			var SuccessOrError = await common.responseServices.successOrErrors("successMessage");
			return common.responseModel.successResponse(SuccessOrError.timer, flag, "");
		} else {
			/** Update both to completed  */
			const updateService = { serviceStatus: "3", status: "1", };
			await appointments.update(updateService, { where: { id: appointment_Id }, });
			// if chat then remove it when completed
			if (appointmentData.interactionType == "0") {
				await chat.destroy({
					where: {
						senderId: appointmentData.therapistId,
						receiverId: appointmentData.patientId,
					},
				});
				await chat.destroy({
					where: {
						senderId: appointmentData.patientId,
						receiverId: appointmentData.therapistId,
					},
				});
			}

			flag = {
				timer: false,
			};

			var SuccessOrError = await common.responseServices.successOrErrors("successMessage");
			return common.responseModel.successResponse(SuccessOrError.timer, flag, "");
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
	timerSocket,
};