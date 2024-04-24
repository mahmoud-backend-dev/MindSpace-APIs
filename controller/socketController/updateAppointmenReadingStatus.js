/**
 * HELPERS
 */

var common = require("../common");
const moment = require("moment");
/**
 * DATABASE
 */
const appointments = common.db.appointments;

const chat_master = common.db.chatMaster;
const chat = common.db.chat;

/**
 * UPDATE APPOINTMENT READING STATUS
 * @param {Object} req
 * @returns Object
 */

async function appointmentReadingStatus(
	appointment_Id,
	service_status,
	time,
	type,
	loginid,
	socket
) {
	try {
		var receiverId = "";
		var appointmentData = "";

		if (appointment_Id) {
			appointmentData = await appointments.findOne({
				where: { id: appointment_Id },
			});

			if (parseInt(appointmentData.patientId) == parseInt(loginid)) {
				receiverId = appointmentData.therapistId;
			} else {
				receiverId = appointmentData.patientId;
			}
			const slotendTime = moment(appointmentData.slotEndTime).utc().add(30, 'minutes').format("HH:mm"); //DB
			const currentTime = moment(time).utc().format("HH:mm"); //Current

			var updateArr = {};
			if (appointmentData) {
				if (service_status == "3") {
					if (currentTime >= slotendTime) {
						/** Update both to completed  */
						updateArr = {
							serviceStatus: "3",
							status: "1",
						};
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
					} else {
						if (appointmentData.interactionType == "0") {
							const updateConsObj = {
								inChat: false,
							};
							await chat_master.update(updateConsObj, {
								where: {
									loginUserId: appointmentData.therapistId,
									chatUserId: appointmentData.patientId,
								},
							});
							await chat_master.update(updateConsObj, {
								where: {
									loginUserId: appointmentData.patientId,
									chatUserId: appointmentData.therapistId,
								},
							});
						}
						updateArr = {
							serviceStatus: "5",
							status: "3",
						};
					}
				} else if (service_status == "4") {
					updateArr = {
						serviceStatus: "4",
						status: "3",
					};
				} else if (service_status == "1") {
					updateArr = {
						serviceStatus: "1",
						status: "3",
					};
				} else if (service_status == "2" || service_status == "6") {
					updateArr = {
						serviceStatus: service_status,
						status: "3",
					};
				} else {
					updateArr = {
						serviceStatus: "5",
						status: "3",
					};
				}

				var update = await appointments.update(updateArr, {
					where: { id: appointment_Id },
				});

				updateArr.sessionType = type;

				var SuccessOrError = await common.responseServices.successOrErrors("successMessage");
				return common.responseModel.successResponse(
					SuccessOrError.serviceStatus,
					updateArr,
					""
				);
			} else {
				var SuccessOrError = await common.responseServices.successOrErrors("err_67");
				var resobj = await common.responseModel.resObj(
					SuccessOrError.message,
					SuccessOrError.parameters.appointmentId,
					SuccessOrError.location
				);
				return common.responseModel.failResponse(SuccessOrError.fail_msg, [], resobj);
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
	appointmentReadingStatus,
};