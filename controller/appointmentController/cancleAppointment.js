/**
 * HELPERS
 */
var moment = require("moment");
var common = require("../common");
const commonEmail = require("../../services/mailService.js/appointmentCancelMail");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const appointmentCollection = common.db.appointments;
const notificationCollections = common.db.notifications;
const userNotifications = common.db.userNotifications;
const paymentCollections = common.db.payment;

/**
 * CANCEL APPOINTMENT FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.cancleAppointment = async (req) => {
	try {
		var appointmentId = req.params.id;

		if (appointmentId == "" || typeof appointmentId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
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

		if (req.body.role != 0 && req.body.role != 1) {
			var successOrError = await common.responseServices.successOrErrors("err_74");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.role,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var appointmentExists = await appointmentCollection.findOne({
			where: { id: decryptAppointmentId },
			include: [{ model: paymentCollections, as: "payment" }],
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
		var updateObj = {
			status: "2",
		};
		var updateCancelStatus = await appointmentCollection.update(updateObj, {
			where: { id: decryptAppointmentId },
		});

		if (updateCancelStatus == 1) {
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
			var email = req.body.role == "1" ? therapistData.email : patientData.email;
			var name =
				req.body.role == "1"
					? therapistData.firstName + " " + therapistData.lastName
					: patientData.firstName + " " + patientData.lastName;
			var timezone = req.body.role == "1" ? therapistData.timezone : patientData.timezone;

			var date = moment(appointmentExists.appointmentDate, "YYYY-MM-DD").format("DD-MMMM-YYYY");

			var thearapistFcmToken = "";
			var subject = "Cancelled Appointment Notification";
			var mailObj = {
				date: date,
				paymentDetails: {
					amount: appointmentExists.payment.amount,
					paymentId: appointmentExists.payment.paymentId,
					transactionId: appointmentExists.payment.transactionId,
				},
			};

			var userNameArr = [
				{
					name: name,
					email: email,
					msg: `We regret to inform you that your appointment on ${date} at ${moment(
						appointmentExists.slotStartTime
					)
						.tz(timezone)
						.format(
							"hh:mm A"
						)} has been cancelled. Please contact us for further assistance.\n\nThank you.`,
				},
				{
					name: "Admin",
					email: process.env.MAIL_AUTH_USER,
					msg: `The appointment between ${
						patientData.firstName + " " + patientData.lastName
					} and ${
						therapistData.firstName + " " + therapistData.lastName
					}, scheduled for ${date} at ${moment(appointmentExists.slotStartTime)
						.tz("Asia/Kuwait")
						.format("hh:mm A")} has been cancelled.`,
				},
			];
			for (let i = 0; i < userNameArr.length; i++) {
				const element = userNameArr[i];
				mailObj.userName = element.name;
				mailObj.msg = element.msg;
				var html = await commonEmail.sendEmail(mailObj);

				await common.helpers.sendMail(html, subject, element.email);
			}

			if (therapistData.isNotification == true && therapistData.deviceToken != "") {
				thearapistFcmToken = therapistData.deviceToken;

				var htmlFCM = `Your appointment is cancelled with ${name} at ${moment(
					response.appointmentDate,
					"YYYY-MM-DD"
				).format("DD MMMM")}, ${moment(response.slotStartTime)
					.tz(therapistData.timezone)
					.format("hh:mm A")}.`;
				var bodySend = htmlFCM;

				var titleSend = "Cancelled Appointment";
				var typeSend = "canceled_appointment";

				var isSend = await common.notification.sendSingleFirebaseNotification(
					thearapistFcmToken,
					bodySend,
					titleSend,
					typeSend
				);

				if (isSend == true) {
					var notificationObj = {
						key: typeSend,
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
				successOrError.cancleAppointment,
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
