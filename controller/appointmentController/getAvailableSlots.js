/**
 * HELPERS
 */
var moment = require("moment");
moment.suppressDeprecationWarnings = true;
const { Op } = require("sequelize");
var common = require("../common");
const constant = require("../../config/constant");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const appointmentCollection = common.db.appointments;
const workDaysCollections = common.db.therapistWorkDays;
const leaveDaysCollection = common.db.therapistLeaveDays;
const paymentCollections = common.db.payment;

/**
 * GET AVAILABLE SLOTS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.getAvailableSlots = async (req) => {
	try {
		if (req.query.utcStartTime == "" || typeof req.query.utcStartTime == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.utcStartTime,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (req.query.utcEndTime == "" || typeof req.query.utcEndTime == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.utcEndTime,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (req.query.therapistId == "" || typeof req.query.therapistId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (req.query.patientId == "" || typeof req.query.patientId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var decryptedId = await common.helpers.decryptData(req.query.therapistId);
		var patientDecryptedId = await common.helpers.decryptData(req.query.patientId);

		if (!decryptedId) {
			var successOrError = await common.responseServices.successOrErrors("err_23");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (!patientDecryptedId) {
			var successOrError = await common.responseServices.successOrErrors("err_69");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var therapistExists = await usersCollection.findOne({
			where: { id: decryptedId, isDeleted: 0 },
		});
		var patientExists = await usersCollection.findOne({
			where: { id: patientDecryptedId, isDeleted: 0 },
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

		var utcStartTime = moment(req.query.utcStartTime, true).isValid();
		var utcEndTime = moment(req.query.utcEndTime, true).isValid();

		if (utcStartTime == false || utcEndTime == false) {
			var successOrError = await common.responseServices.successOrErrors("err_65");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.utcStartTime,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var weekDay = moment(req.query.utcStartTime).utc().format("dddd");
		var weekDay2 = moment(req.query.utcEndTime).utc().format("dddd");

		var timeArr = [];

		var getTimeDetails = await workDaysCollections.findAll({
			where: { userId: therapistExists.id, dayOfWeek: { [Op.in]: [weekDay, weekDay2] } },
		});

		var startDateUtc = moment(req.query.utcStartTime).utc().format();
		var endDateUtc = moment(req.query.utcEndTime).utc().format();

		var round = 1000 * 60 * 15;
		var date = new Date(startDateUtc);
		var roundedStartTime = new Date(Math.ceil(date.getTime() / round) * round);

		var utcDateSlots = await common.helpers.getDateTimeSlots(roundedStartTime, endDateUtc, 15);
		var leaveDays = await leaveDaysCollection.findOne({
			where: {
				[Op.and]: [
					// {
					// 	leaveStartDate: {
					// 		[Op.substring]: moment(req.query.utcStartTime).utc().format("YYYY-MM-DD"),
					// 	},
					// },
					{
						leaveEndDate: {
							[Op.substring]: moment(req.query.utcEndTime).utc().format("YYYY-MM-DD"),
						},
					},
					{
						[Op.or]: {
							isMorningAvailable: true,
							isAfternoonAvailable: true,
							isEveningAvailable: true,
						},
					},
					{
						userId: therapistExists.id,
					},
				],
			},
		});

		if (getTimeDetails) {
			for (let i = 0; i < getTimeDetails.length; i++) {
				const element = getTimeDetails[i];

				const obj = {
					day: element.dayOfWeek,
					morning: {
						isAvailable: element.isMorningAvailable,
						startTime: element.morningStartTime,
						endTime: element.morningEndTime,
					},
					afternoon: {
						isAvailable: element.isAfternoonAvailable,
						startTime: element.afternoonStartTime,
						endTime: element.afternoonEndTime,
					},

					evening: {
						isAvailable: element.isEveningAvailable,
						startTime: element.eveningStartTime,
						endTime: element.eveningEndTime,
					},
				};
				timeArr.push(obj);
			}

			var availableSlots = [];

			const weekday = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];

			for (let i = 0; i < timeArr.length; i++) {
				const element = timeArr[i];

				var slots = [];

				if (leaveDays) {
					if (leaveDays.isMorningAvailable == false) {
						let slotsarr = await common.helpers.getTimeSlots(
							element.morning.startTime,
							element.morning.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
					if (leaveDays.isAfternoonAvailable == false) {
						let slotsarr = await common.helpers.getTimeSlots(
							element.afternoon.startTime,
							element.afternoon.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
					if (leaveDays.isEveningAvailable == false) {
						let slotsarr = await common.helpers.getTimeSlots(
							element.evening.startTime,
							element.evening.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
				} else {
					if (element.morning.isAvailable == 1) {
						let slotsarr = await common.helpers.getTimeSlots(
							element.morning.startTime,
							element.morning.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
					if (element.afternoon.isAvailable == 1) {
						let slotsarr = await common.helpers.getTimeSlots(
							element.afternoon.startTime,
							element.afternoon.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
					if (element.evening.isAvailable == 1) {
						let slotsarr = await common.helpers.getTimeSlots(
							element.evening.startTime,
							element.evening.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
				}
				for (let k = 0; k < slots.length; k++) {
					const element2 = slots[k];
					for (let j = 0; j < utcDateSlots.length; j++) {
						const element3 = utcDateSlots[j];
						var date = new Date(element3);
						let day = weekday[date.getDay()];
						if (day == element.day) {
							var temp = moment(element3).utc().format("HH:mm");
							if (element2 == temp) {
								var currentTime = moment().utc().format();
								var slotTime = moment.utc(element3);
								const diffMinutes = slotTime.diff(currentTime, "minutes");
								if (diffMinutes > 180) {
									availableSlots.push(element3);
								}
							}
						}
					}
				}
			}
			var slotExists = await appointmentCollection.findAll({
				where: {
					appointmentDate: { [Op.in]: availableSlots },
					therapistId: therapistExists.id,
				},
				include: [{ model: paymentCollections, as: "payment" }],
			});

			var busySlots = [];
			for (let i = 0; i < slotExists.length; i++) {
				const element = slotExists[i];

				if (element.payment.dataValues.paymentStatus == "1") {
					busySlots.push(moment(element.slotStartTime).utc().format());
				}
				if (element.status == 2) {
					busySlots.pop();
				}
			}

			availableSlots = availableSlots.filter((val) => !busySlots.includes(val));

			var successOrError = await common.responseServices.successOrErrors("successMessage");

			if (availableSlots.length == 0) {
				return await common.responseModel.successGetResponse(
					successOrError.slotsNotAvailable,
					[],
					{}
				);
			} else {
				return await common.responseModel.successGetResponse(
					successOrError.slots,
					availableSlots,
					{}
				);
			}
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_68");
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
