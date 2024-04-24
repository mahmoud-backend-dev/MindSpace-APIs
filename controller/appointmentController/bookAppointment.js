/**
 * HELPERS
 */
var moment = require("moment");
var common = require("../common");
var chatMaster = common.db.chatMaster;

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const appointmentCollection = common.db.appointments;
const paymentCollection = common.db.payment;
const { Op, Sequelize } = common.db.Sequelize;

/**
 * BOOK APPOINTMENT FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.bookAppointment = async (req) => {
	try {
		var bodyParams = req.body;

		if (bodyParams.patientId == "" || typeof bodyParams.patientId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var decryptPatientId = await common.helpers.decryptData(bodyParams.patientId);
		if (!decryptPatientId) {
			var successOrError = await common.responseServices.successOrErrors("err_59");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (bodyParams.therapistId == "" || typeof bodyParams.therapistId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var decryptTherapistId = await common.helpers.decryptData(bodyParams.therapistId);

		if (!decryptTherapistId) {
			var successOrError = await common.responseServices.successOrErrors("err_23");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var patientExists = await usersCollection.findOne({
			where: { id: decryptPatientId, isDeleted: 0 },
		});

		if (!patientExists) {
			var successOrError = await common.responseServices.successOrErrors("err_126");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var therapistExists = await usersCollection.findOne({
			where: { id: decryptTherapistId, isDeleted: 0 },
		});

		if (!therapistExists) {
			var successOrError = await common.responseServices.successOrErrors("err_128");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (
			bodyParams.typeofInteraction == "" ||
			typeof bodyParams.typeofInteraction == "undefined"
		) {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.typeofInteraction,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (
			bodyParams.typeofInteraction != 0 &&
			bodyParams.typeofInteraction != 1 &&
			bodyParams.typeofInteraction != 2
		) {
			var successOrError = await common.responseServices.successOrErrors("err_61");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.typeofInteraction,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (bodyParams.appointmentDate == "" || typeof bodyParams.appointmentDate == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentDate,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		const appointmentTime = moment.utc(bodyParams.appointmentDate);
		const currentTime = moment.utc();

		if (currentTime > appointmentTime) {
			var successOrError = await common.responseServices.successOrErrors("err_157");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentDate,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var appointmentDate = moment(appointmentDate).format("YYYY-MM-DD");

		/** Check If same user Book slot with same time  */

		const sameSlotExist = await appointmentCollection.findOne({
			where: {
				patientId: decryptPatientId,
				appointmentDate: bodyParams.appointmentDate,
				slotStartTime: bodyParams.appointmentDate,
			},
		});

		if (sameSlotExist) {
			checkPaymentSuccess = await paymentCollection.findOne({
				where: {
					appointmentId: sameSlotExist.id,
					paymentStatus: "1",
				},
			});

			if (checkPaymentSuccess) {
				const getTherpiestName = await usersCollection.findOne({
					where: {
						id: sameSlotExist.therapistId,
						isDeleted: 0,
					},
				});

				const getName = getTherpiestName.firstName
					? getTherpiestName.firstName
					: getTherpiestName.nickName;

				var successOrError = await common.responseServices.successOrErrors("err_153");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					`You have already booked same slot with ${getName}`,
					successOrError.parameters.appointmentDate,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}

		let amount = 0;
		if(!bodyParams.consultNow){
			if (bodyParams.typeofInteraction == 0) {
				amount = therapistExists.chatSessionPrice;
			} else if (bodyParams.typeofInteraction == 1) {
				amount = therapistExists.voiceSessionPrice;
			} else if (bodyParams.typeofInteraction == 2) {
				amount = therapistExists.videoSessionPrice;
			}
		}else{
			if (bodyParams.typeofInteraction == 0) {
				amount = therapistExists.chatConsultNowPrice;
			} else if (bodyParams.typeofInteraction == 1) {
				amount = therapistExists.voiceConsultNowPrice;
			} else if (bodyParams.typeofInteraction == 2) {
				amount = therapistExists.videoConsultNowPrice;
			}
		}
		let customerPhone = patientExists.countryCode + patientExists.mobileNumber;
		let customerName = patientExists.firstName + " " + patientExists.lastName;
		var responseObj = await common.payment.payment(
			amount,
			customerPhone,
			customerName.toUpperCase()
		);
		if (responseObj.status == 201) {
			var url = responseObj.checkout_url;
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			return await common.responseModel.failResponse(successOrError.message, {}, responseObj);
		}

		var appointmentObj = {
			patientId: decryptPatientId,
			therapistId: decryptTherapistId,
			appointmentDate: moment(bodyParams.appointmentDate).format("YYYY-MM-DD"),
			interactionType: bodyParams.typeofInteraction,
			slotStartTime: bodyParams.appointmentDate,
			slotEndTime: moment(bodyParams.appointmentDate).add(1, "hours").utc().format(),
			channelName: (await common.helpers.randomString(5)) + Date.now(),
			sessionId: responseObj.sessionId,
			paymentStatus: responseObj.state,
		};

		console.log("appointmentObj", appointmentObj);
		var utcDate = moment(bodyParams.appointmentDate).utc().format("YYYY-MM-DD HH:mm:ss");

		var appointmentExists = await appointmentCollection.findOne({
			where: {
				patientId: decryptPatientId,
				therapistId: decryptTherapistId,
				//	slotStartTime: bodyParams.appointmentDate,
				slotStartTime: {
					[Op.eq]: Sequelize.fn("CONVERT_TZ", utcDate, "+00:00", "+00:00"),
				},
			},
		});

		if (appointmentExists) {
			await appointmentCollection.update(appointmentObj, {
				where: {
					patientId: decryptPatientId,
					therapistId: decryptTherapistId,
					//	slotStartTime: bodyParams.appointmentDate,
					slotStartTime: {
						[Op.eq]: Sequelize.fn("CONVERT_TZ", utcDate, "+00:00", "+00:00"),
					},
				},
			});

			var bookAppointment = await appointmentCollection.findOne({
				where: { id: appointmentExists.id },
			});
		} else {
			var bookAppointment = await appointmentCollection.create(appointmentObj);
			// add to master chat 
			var chatExist = await chatMaster.findOne({
				where: { loginUserId: decryptPatientId, chatUserId: decryptTherapistId },
			});
			const createObj = {
				loginUserId: decryptPatientId,
				chatUserId: decryptTherapistId,
				inChat: 0,
				consultationFlag: 1,
				scheduleDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
			};
			const createObj1 = {
				loginUserId: decryptTherapistId,
				chatUserId: decryptPatientId,
				inChat: 0,
				consultationFlag: 1,
				scheduleDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
			};
			if (!chatExist) {
				await chatMaster.create(createObj);
				await chatMaster.create(createObj1);
			}
		}

		if (!bookAppointment) {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				"",
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var response = await common.response.appointment.appointmentObjectRes(
			bookAppointment.id,
			decryptTherapistId,
			decryptPatientId
		);
		let paymentObj = {
			appointmentId: bookAppointment.id,
			sessionId: responseObj.sessionId,
			paymentStatus: "0",
			amount: responseObj.amount,
			orderNo: responseObj.orderNo,
		};

		var paymentExits = await paymentCollection.findOne({
			where: { appointmentId: bookAppointment.id },
		});
		if (paymentExits) {
			await paymentCollection.update(paymentObj, { where: { id: bookAppointment.id } });
		} else {
			await paymentCollection.create(paymentObj);
		}

		if (response) {
			response["checkout_url"] = url;
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return common.responseModel.successCreateResponse(
				successOrError.addAppointment,
				response,
				{}
			);
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				"",
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
	} catch (error) {
		/**
		 * CATCH ERROR
		 */
		console.log("error", error);
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
