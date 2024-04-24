const { randomInt } = require("crypto");
/**
 * HELPERS
 */
var moment = require("moment");
const commonEmail = require("../../services/mailService.js/paymentMail");
moment.suppressDeprecationWarnings = true;
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const paymentCollection = common.db.payment;
const appointmentCollection = common.db.appointments;
const userNotifications = common.db.userNotifications;
const notificationCollections = common.db.notifications;

/**
 * UPDATE PAYMENT STATUS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.updatePayment = async (req) => {
	try {
		var bodyParams = req.body;
		var appointmentId = await common.helpers.decryptData(req.params.appointmentId);

		if (!appointmentId) {
			var successOrError = await common.responseServices.successOrErrors("err_66");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var appointmentData = await appointmentCollection.findOne({ where: { id: appointmentId } });
		var paymentData = await paymentCollection.findOne({
			where: { appointmentId: appointmentId },
		});

		if (!appointmentData) {
			var successOrError = await common.responseServices.successOrErrors("err_67");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (!paymentData) {
			var successOrError = await common.responseServices.successOrErrors("err_96");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (bodyParams.paymentId == "" || typeof bodyParams.paymentId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.paymentId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (bodyParams.paymentId == paymentData.sessionId) {
			await paymentCollection.destroy({ where: { appointmentId: appointmentId } });
			await appointmentCollection.destroy({ where: { id: appointmentId } });
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successResponse(successOrError.linkExpired, {}, {});
		}

		var paymentResponse = await common.payment.getPaymentStatus(bodyParams.paymentId);
		if (paymentResponse.status == 200) {
			var updateObj = {
				paymentStatus: "",
				paymentId: paymentResponse.data.payment_details["Payment Id"]
					? paymentResponse.data.payment_details["Payment Id"]
					: "",
				transactionId: paymentResponse.data.payment_details["Transaction Id"]
					? paymentResponse.data.payment_details["Transaction Id"]
					: "",
				referenceNo: paymentResponse.data.payment_details.Ref
					? paymentResponse.data.payment_details.Ref
					: "",
				invoiceUrl: paymentResponse.data.receipt_url ? paymentResponse.data.receipt_url : "",
			};

			if (paymentResponse.data.payment_details.Status == "Success") {
				updateObj.paymentStatus = "1";
				var updatePaymentStatus = await paymentCollection.update(updateObj, {
					where: { appointmentId: appointmentId },
				});
				var therapistData = await usersCollection.findOne({
					where: { id: appointmentData.therapistId, isDeleted: 0 },
				});
				var patientData = await usersCollection.findOne({
					where: { id: appointmentData.patientId, isDeleted: 0 },
				});

				if (updatePaymentStatus == 1) {
					var date = moment(appointmentData.appointmentDate, "YYYY-MM-DD").format(
						"DD-MMMM-YYYY"
					);
					var time = moment(appointmentData.slotStartTime)
						.tz(therapistData.timezone)
						.format("hh:mm A");
					var mailObj = {
						date: date,
						time: time,
						Therapist: therapistData.firstName + " " + therapistData.lastName,
						patient: patientData.firstName + " " + patientData.lastName,
						paymentDetails: {
							amount: paymentResponse.data.payment_details.Amount,
							paymentId: updateObj.paymentId,
							transactionId: updateObj.transactionId,
							paymentMethod: paymentResponse.data.payment_details.Gateway,
						},
					};
					var thearapistFcmToken = "";
					var subject = "Appointment Confirmation";
					var html = await commonEmail.sendEmail(mailObj);
					await common.helpers.sendMail(html, subject, patientData.email);

					if (therapistData.deviceToken != "") {
						thearapistFcmToken = therapistData.deviceToken;
						var date = moment(appointmentData.appointmentDate, "YYYY-MM-DD").format(
							"DD MMMM"
						);
						var htmlFCM = `Your appointment has been scheduled with ${patientData.firstName} ${patientData.lastName} for ${date}, ${time}.`;
						var bodySend = htmlFCM;

						var titleSend = "New Appointment";
						var typeSend = "scheduled_appointment";

						var isSend = await common.notification.sendSingleFirebaseNotification(
							thearapistFcmToken,
							bodySend,
							titleSend,
							typeSend
						);
						if (isSend == true) {
							var notificationObj = {
								key: "scheduled_appointment",
								title: titleSend,
								message: bodySend,
								data: "",
							};
							var notification = await notificationCollections.create(notificationObj);
							var userNotificatonObj = {
								notificationId: notification.id,
								userId: therapistData.id,
								sendBy: "1",
							};

							await userNotifications.create(userNotificatonObj);
						}
					}

					if (appointmentData.interactionType == "0") {
						var interactionType = "Live Text";
						var sessionAmount = therapistData.chatSessionPrice;
					} else if (appointmentData.interactionType == "1") {
						var interactionType = "Live Audio Call";
						var sessionAmount = therapistData.voiceSessionPrice;
					} else if (appointmentData.interactionType == "2") {
						var interactionType = "Live Video Call";
						var sessionAmount = therapistData.videoSessionPrice;
					}
					const invoiceData = {
						items: [
							{
								thrapieService: interactionType,
								sessionAmount: sessionAmount,
								totalMinutes: 60,
								totalAmount: sessionAmount,
							},
						],

						therapistName: therapistData.firstName + " " + therapistData.lastName,
						patientName: patientData.firstName + " " + patientData.lastName,
						totalAmount: sessionAmount,
						adminCommission: 1.0,
						subtotal: sessionAmount,
						total: sessionAmount,
						invoiceNumber: "#INV" + randomInt(100000),
						slotStartTime:
							moment(appointmentData.slotStartTime)
								.tz(patientData.timezone)
								.format("hh:mm A") +
							" to " +
							moment(appointmentData.slotEndTime).tz(patientData.timezone).format("hh:mm A"),
						appointmentDate: moment(appointmentData.appointmentDate).format("DD-MM-YYYY"),
					};

					var createInvoice = await common.helpers.createInvoice(invoiceData);

					var updateObj = {
						invoice: createInvoice,
						invoiceNumber: invoiceData.invoiceNumber,
					};
					var invoice = await appointmentCollection.update(updateObj, {
						where: { id: appointmentId },
					});
					if (invoice == 1) {
						if (appointmentData.invoice != "") {
							var file = await common.helpers.fetchFileFromS3(
								appointmentData.invoice,
								process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_INVOICE
							);

							if (file) {
								await common.helpers.deleteFileFromS3(
									appointmentData.invoice,
									process.env.AWS_BUCKETNAME +
										"/" +
										process.env.AWS_UPLOAD_PATH_FOR_INVOICE
								);
							}
						}
						var file = await common.helpers.fetchFileFromS3(
							createInvoice,
							process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_INVOICE
						);

						var responseObj = {
							invoiceUrl: file,
						};
					}

					var successOrError = await common.responseServices.successOrErrors("successMessage");
					return common.responseModel.successResponse(
						successOrError.paymentSuccess,
						responseObj,
						{}
					);
				}
			} else if (paymentResponse.data.payment_details.Status == "Failed") {
				updateObj.paymentStatus = "2";
				await paymentCollection.update(updateObj, {
					where: { appointmentId: appointmentId },
				});

				let obj = {
					try_again_url: paymentResponse.data.try_again_url,
				};
				var successOrError = await common.responseServices.successOrErrors("successMessage");
				return common.responseModel.failResponse(successOrError.paymentFailed, obj, {});
			} else if (paymentResponse.data.payment_details.Status == "Canceled") {
				updateObj.paymentStatus = "4";
				await paymentCollection.update(updateObj, {
					where: { appointmentId: appointmentId },
				});
				let obj = {
					try_again_url: paymentResponse.data.try_again_url,
				};
				var successOrError = await common.responseServices.successOrErrors("successMessage");
				return common.responseModel.failResponse(successOrError.paymentFailed, obj, {});
			}
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_81");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.paymentId,
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
