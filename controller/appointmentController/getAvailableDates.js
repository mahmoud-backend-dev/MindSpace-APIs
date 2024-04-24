/**
 * HELPERS
 */

var moment = require("moment");
moment.suppressDeprecationWarnings = true;
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const leaveDaysCollections = common.db.therapistLeaveDays;

/**
 * GET AVAILABLE DATES FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.getAvailableDates = async (req) => {
	try {
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

		var decryptedId = await common.helpers.decryptData(req.query.therapistId);

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

		var therapistExists = await usersCollection.findOne({
			where: { id: decryptedId, isDeleted: 0 },
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

		var leaveExists = await leaveDaysCollections.findAll({
			where: {
				userId: therapistExists.id,
				isMorningAvailable: 1,
				isAfternoonAvailable: 1,
				isEveningAvailable: 1,
			},
			order: [["leaveStartDate", "asc"]],
		});

		var dateArr = [];
		if (leaveExists.length != 0) {
			var temp = "";
			if (therapistExists.timezone == req.query.timezone) {
				for (let i = 0; i < leaveExists.length; i++) {
					const element = leaveExists[i];

					dateArr.push(
						moment(element.leaveStartDate).tz(req.query.timezone).format("YYYY-MM-DD")
					);
				}
			} else {
				for (let i = 0; i < leaveExists.length; i++) {
					const element = leaveExists[i];

					if (i != 0) {
						if (moment(element.leaveStartDate).isSame(moment(temp))) {
							dateArr.push(
								moment(element.leaveStartDate).tz(req.query.timezone).format("YYYY-MM-DD")
							);
						}
						temp = element.leaveEndDate;
					} else {
						temp = element.leaveEndDate;
					}
				}
			}
		}

		if (dateArr.length != 0) {
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successGetResponse(
				successOrError.notAvailable,
				dateArr,
				{}
			);
		} else {
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successGetResponse(successOrError.notAvailable, [], {});
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
