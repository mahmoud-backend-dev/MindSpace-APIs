/**
 * HELPERS
 */
var moment = require("moment");
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const appointmentCollection = common.db.appointments;
const notificationCollections = common.db.notifications;
const userNotifications = common.db.userNotifications;

/**
 * RESCHEDULE APPOINTMENT FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.rescheduleAppointment = async (req) => {
	try {
		var bodyParams = req.body;

		var appointmentId = req.params.id;

		if (appointmentId == "" || typeof appointmentId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		var decryptAppointmentId = await common.helpers.decryptData(appointmentId);

		if (!decryptAppointmentId) {
			var successOrError = await common.responseServices.successOrErrors("err_66");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var appointmentExists = await appointmentCollection.findOne({
			where: { id: decryptAppointmentId },
		});
		if (!appointmentExists) {
			var successOrError = await common.responseServices.successOrErrors("err_67");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var appointmentObj = {
			patientId: appointmentExists.patientId,
			therapistId: appointmentExists.therapistId,
			appointmentDate: bodyParams.appointmentDate
				? bodyParams.appointmentDate
				: appointmentExists.appointmentDate,
			slotStartTime: bodyParams.appointmentDate
				? bodyParams.appointmentDate
				: appointmentExists.slotStartTime,
			slotEndTime: bodyParams.appointmentDate
				? moment(bodyParams.appointmentDate).add(1, "hours")
				: appointmentExists.slotEndTime,
		};

		var isUpdate = await appointmentCollection.update(appointmentObj, {
			where: { id: decryptAppointmentId },
		});
		if (isUpdate == 1) {
			var response = await common.response.appointment.appointmentObjectRes(
				decryptAppointmentId,
				appointmentExists.therapistId,
				appointmentExists.patientId
			);

			var therapistData = await usersCollection.findOne({
				where: { id: appointmentExists.therapistId, isDeleted: 0 },
			});

			var patientData = await usersCollection.findOne({
				where: { id: appointmentExists.patientId, isDeleted: 0 },
			});
			var thearapistFcmToken = "";
			if (therapistData.isNotification == true && therapistData.deviceToken != "") {
				thearapistFcmToken = therapistData.deviceToken;
				var date = moment(response.appointmentDate, "YYYY-MM-DD").format("DD MMMM");
				var time = moment(response.slotStartTime).tz(therapistData.timezone).format("hh:mm A");

				var htmlFCM = `Your appointment is rescheduled with ${patientData.firstName} ${patientData.lastName} at ${date}, ${time}.`;
				var bodySend = htmlFCM;

				var titleSend = "Rescheduled Appointment";
				var typeSend = "rescheduled_appointment";

				var isSend = await common.notification.sendSingleFirebaseNotification(
					thearapistFcmToken,
					bodySend,
					titleSend,
					typeSend
				);

				if (isSend == true) {
					var notificationObj = {
						key: "rescheduled_appointment",
						title: titleSend,
						message: bodySend,
						data: "",
					};

					var notification = await notificationCollections.create(notificationObj);
					var userNotificatonObj = {
						notificationId: notification.id,
						userId: appointmentExists.therapistId,
						sendBy: "1",
					};
					await userNotifications.create(userNotificatonObj);
				}
			}

			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successResponse(
				successOrError.rescheduleAppointment,
				response,
				{}
			);
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.noParams,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
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
};
