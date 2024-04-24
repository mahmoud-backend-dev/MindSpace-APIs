var moment = require("moment");

/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const userNotificationsCollection = common.db.userNotifications;
const notificationsCollection = common.db.notifications;
const usersCollection = common.db.users;
const appointmentCollection = common.db.appointments;
const paymentCollection = common.db.payment;
const chat = common.db.chat;

/**
 * SEND CRONE NOTIFICATION FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.sendNotifications = async (req) => {
	try {
		var appointments = await appointmentCollection.findAll({
			include: [
				{ model: usersCollection, as: "therapistAppointments" },
				{ model: usersCollection, as: "patientAppointments" },
				{ model: paymentCollection, as: "payment" },
			],
			where: { status: "0", "$payment.paymentStatus$": "1" },
		});

		for (let index = 0; index < appointments.length; index++) {
			const element = appointments[index];

			if (
				moment(element.slotStartTime).format("YYYY-MM-DD") ==
				moment().utc().format("YYYY-MM-DD")
			) {
				const datetime1 = moment.utc(element.slotStartTime);
				const datetime2 = moment.utc().format();
				const diffMinutes = datetime1.diff(datetime2, "minutes");

				const time1 = moment.utc(element.slotStartTime).format("HH:mm");
				const time2 = moment.utc().format("HH:mm");

				if (diffMinutes == 30) {
					var fcmArray = [];

					fcmArray.push({
						name:
							element.therapistAppointments.firstName +
							" " +
							element.therapistAppointments.lastName,
						token: element.patientAppointments.deviceToken,
						timezone: element.patientAppointments.timezone,
					});
					fcmArray.push({
						name:
							element.patientAppointments.firstName +
							" " +
							element.patientAppointments.lastName,
						token: element.therapistAppointments.deviceToken,
						timezone: element.therapistAppointments.timezone,
					});

					for (let j = 0; j < fcmArray.length; j++) {
						const element1 = fcmArray[j];

						var name = j == 0 ? fcmArray[1].name : fcmArray[0].name;
						var token = j == 0 ? fcmArray[1].token : fcmArray[0].token;

						var date = moment(element.appointmentDate, "YYYY-MM-DD").format("DD MMMM YYYY");
						var time = moment(element.slotStartTime).tz(element1.timezone).format("hh:mm A");

						var htmlFCM = `You have an upcoming appointment with ${name} for ${date}, ${time}.`;

						var bodySend = htmlFCM;

						var titleSend = "Reminder Appointment";
						var typeSend = "reminder_appointment";

						var isSend = await common.notification.sendSingleFirebaseNotification(
							token,
							bodySend,
							titleSend,
							typeSend
						);

						if (isSend == true) {
							var notificationObj = {
								key: "reminder_appointment",
								title: titleSend,
								message: bodySend,
								data: "",
							};
							var notification = await notificationsCollection.create(notificationObj);
							var userNotificatonObj = {
								notificationId: notification.id,
								userId: element.therapistAppointments.id,
								sendBy: "1",
							};

							await userNotificationsCollection.create(userNotificatonObj);
						}
					}
					/** Update both to Running  before 30 mins*/
					var updateObj = { status: "3", serviceStatus: "5" };
					await appointmentCollection.update(updateObj, { where: { id: element.id } });
				} else if (time1 == time2) {
					/** Update both to Running  */
					var updateObj = { status: "3", serviceStatus: "5" };
					await appointmentCollection.update(updateObj, { where: { id: element.id } });
				}
			}
		}
		var appointments = await appointmentCollection.findAll({
			include: [
				{ model: usersCollection, as: "therapistAppointments" },
				{ model: usersCollection, as: "patientAppointments" },
			],
			where: { status: "3" },
		});
		if (appointments.length != 0) {
			for (let i = 0; i < appointments.length; i++) {
				const element = appointments[i];
				const slotendTime = moment(element.slotEndTime).utc().add(30, 'minutes').format("HH:mm"); //DB
				const currentTime = moment().utc().format("HH:mm"); //Current

				if (currentTime >= slotendTime) {
					/** Update both to completed  */
					var updateObj = { status: "1", serviceStatus: "3" };
					await appointmentCollection.update(updateObj, { where: { id: element.id } });
					// if chat then remove it when completed
					if (element.interactionType == "0") {
						await chat.destroy({
							where: {
								senderId: element.therapistId,
								receiverId: element.patientId,
							},
						});
						await chat.destroy({
							where: {
								senderId: element.patientId,
								receiverId: element.therapistId,
							},
						});
					}
				}
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
};