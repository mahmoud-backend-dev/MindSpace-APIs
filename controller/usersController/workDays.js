/**
 * HELPERS
 */
const moment = require("moment");
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const workDaysCollection = common.db.therapistWorkDays;
const leaveDaysCollection = common.db.therapistLeaveDays;
const Sequelize = common.db.Sequelize;

/**
 *ADD THERAPIST WORK DAYS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.addWorkDays = async (req) => {
	try {
		var bodyParams = req.body;
		if (bodyParams.userId == "" || typeof bodyParams.userId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userId = await common.helpers.decryptData(bodyParams.userId);

		if (!userId) {
			var successOrError = await common.responseServices.successOrErrors("err_32");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userExists = await usersCollection.findOne({
			where: { id: userId, role: 0, isDeleted: 0 },
		});
		if (!userExists) {
			var successOrError = await common.responseServices.successOrErrors("err_19");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		var weekDayArr = [
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday",
			"sunday",
		];

		if (bodyParams.workDays != "" && typeof bodyParams.workDays != "undefined") {
			var insertObj = {};
			for (let i = 0; i < bodyParams.workDays.length; i++) {
				const element = bodyParams.workDays[i];
				if (element.dayOfWeek == "" || typeof element.dayOfWeek == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.dayOfWeek,
						successOrError.location
					);
					return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				var weekDay = element.dayOfWeek.charAt(0).toLowerCase() + element.dayOfWeek.slice(1);
				if (weekDayArr.includes(weekDay) == false) {
					var successOrError = await common.responseServices.successOrErrors("err_134");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.dayOfWeek,
						successOrError.location
					);
					return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				var dayOfWeek = element.dayOfWeek.charAt(0).toUpperCase() + element.dayOfWeek.slice(1);
				var findDay = await workDaysCollection.findOne({
					where: { userId: userId, dayOfWeek: dayOfWeek },
				});

				if (findDay) {
					await workDaysCollection.destroy({
						where: { userId: userId, dayOfWeek: dayOfWeek },
					});
				}
				if (element.isMorningAvailable == 0) {
					element.morningStartTime = "";
					element.morningEndTime = "";
				}
				if (element.isAfternoonAvailable == 0) {
					element.afternoonStartTime = "";
					element.afternoonEndTime = "";
				}
				if (element.isEveningAvailable == 0) {
					element.eveningStartTime = "";
					element.eveningEndTime = "";
				}

				//	var dayOfWeek = element.dayOfWeek.charAt(0).toUpperCase() + element.dayOfWeek.slice(1);
				insertObj = {
					"userId": userId,
					"dayOfWeek": dayOfWeek,
					"morningStartTime": element.morningStartTime
						? moment(element.morningStartTime).utc().format("HH:mm:ss")
						: element.morningStartTime,
					"morningEndTime": element.morningEndTime
						? moment(element.morningEndTime).utc().format("HH:mm:ss")
						: element.morningEndTime,
					"isMorningAvailable": element.isMorningAvailable ? element.isMorningAvailable : 0,
					"afternoonStartTime": element.afternoonStartTime
						? moment(element.afternoonStartTime).utc().format("HH:mm:ss")
						: element.afternoonStartTime,
					"afternoonEndTime": element.afternoonEndTime
						? moment(element.afternoonEndTime).utc().format("HH:mm:ss")
						: element.afternoonEndTime,
					"isAfternoonAvailable": element.isAfternoonAvailable
						? element.isAfternoonAvailable
						: 0,
					"eveningStartTime": element.eveningStartTime
						? moment(element.eveningStartTime).utc().format("HH:mm:ss")
						: element.eveningStartTime,
					"eveningEndTime": element.eveningEndTime
						? moment(element.eveningEndTime).utc().format("HH:mm:ss")
						: element.eveningEndTime,
					"isEveningAvailable": element.isEveningAvailable ? element.isEveningAvailable : 0,
				};

				await workDaysCollection.create(insertObj);
			}
		}

		if (typeof bodyParams.leaveDays != "undefined") {
			if (bodyParams.leaveDays.length == 0) {
				await leaveDaysCollection.destroy({
					where: {
						userId: userId,
					},
				});
			} else {
				for (let i = 0; i < bodyParams.leaveDays.length; i++) {
					const element = bodyParams.leaveDays[i];

					if (element.leaveStartDate == "" || typeof element.leaveStartDate == "undefined") {
						var successOrError = await common.responseServices.successOrErrors("err_02");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.leaveStartDate,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}
					if (element.leaveEndDate == "" || typeof element.leaveEndDate == "undefined") {
						var successOrError = await common.responseServices.successOrErrors("err_02");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.leaveEndDate,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}

					var dateExists = await leaveDaysCollection.findOne({
						where: {
							userId: userId,
							leaveEndDate: element.leaveEndDate,
							leaveStartDate: element.leaveStartDate,
						},
					});
					if (dateExists) {
						await leaveDaysCollection.destroy({
							where: {
								userId: userId,
							},
						});
					}
					var leaveInsertObj = {
						"userId": userId,
						"leaveStartDate": element.leaveStartDate ? element.leaveStartDate : null,
						"leaveEndDate": element.leaveEndDate ? element.leaveEndDate : null,
						"isMorningAvailable": element.isMorningAvailable,
						"isAfternoonAvailable": element.isAfternoonAvailable,
						"isEveningAvailable": element.isEveningAvailable,
					};

					await leaveDaysCollection.create(leaveInsertObj);
				}
			}
		}
		await usersCollection.update({ workDaysDetailsFlag: 1 }, { where: { id: userId } });
		if (userExists.isActive == "4" || userExists.isActive == "2") {
			await usersCollection.update({ isActive: "0" }, { where: { id: userId } });
		}

		var response = await common.response.users.singleUserObjectRes(userId);

		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return await common.responseModel.successCreateResponse(
			successOrError.addWorkDays,
			response,
			{}
		);
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
