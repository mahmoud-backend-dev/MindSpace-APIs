/**
 * HELPERS
 */
var moment = require("moment");
moment.suppressDeprecationWarnings = true;
const { Op } = require("sequelize");
var common = require("../common");
const constant = require("../../config/constant");
const { pagination } = require("../../helpers/pagination");

	

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
module.exports.consultNow = async (req) => {
	try {
		
		var availableTherapists = [];
		var round = 1000 * 60 * 60;
		const day = moment().utc().format('dddd');
		const min = moment().utc().format('mm');

		var requiredTime;
		
		if(min <= 45){
			var date = new Date(moment().utc().format());
			requiredTime = new Date(Math.ceil(date.getTime() / round) * round);
		}else{
			var date = new Date(moment().utc().add(1, 'hours').format());
			requiredTime = new Date(Math.ceil(date.getTime() / round) * round);
		}

		// console.log("requiredTime");
		// console.log(requiredTime);

		// get all therapists
		var query = {};
		query.where = {
			role: 0, isDeleted: 0, isActive: "1", isConsultNow: 1
		};
		var therapists = await common.query.findAndCountAll(usersCollection, query);
		// console.log(therapists.rows.length);

		for (let i = 0; i < therapists.rows.length; i++) {
			var therapist = therapists.rows[i];
			var therapistId = therapist.id;
			var isTherapyAvailable = false;

			// console.log("----------------- therapist -----------------------");
			// console.log(therapist.id);

			var getTimeDetails = await workDaysCollections.findOne({
				where: { userId: therapistId, dayOfWeek: day },
			});
			
			var leaveDays = await leaveDaysCollection.findOne({
				where: {
					[Op.and]: [
						{
							leaveEndDate: {
								[Op.substring]: moment().utc().format("YYYY-MM-DD"),
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
							userId: therapistId,
						},
					],
				},
			});

			// console.log("getTimeDetails");
			// console.log(getTimeDetails);
			// console.log("leaveDays");
			// console.log(leaveDays);

			if (getTimeDetails) {

				const timeObj = {
					day: getTimeDetails.dayOfWeek,
					morning: {
						isAvailable: getTimeDetails.isMorningAvailable,
						startTime: getTimeDetails.morningStartTime,
						endTime: getTimeDetails.morningEndTime,
					},
					afternoon: {
						isAvailable: getTimeDetails.isAfternoonAvailable,
						startTime: getTimeDetails.afternoonStartTime,
						endTime: getTimeDetails.afternoonEndTime,
					},

					evening: {
						isAvailable: getTimeDetails.isEveningAvailable,
						startTime: getTimeDetails.eveningStartTime,
						endTime: getTimeDetails.eveningEndTime,
					},
				};
				
				var slots = [];

				if (leaveDays) {
					if (leaveDays.isMorningAvailable == false) {
						let slotsarr = await common.helpers.getTimeSlots(
							timeObj.morning.startTime,
							timeObj.morning.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
					if (leaveDays.isAfternoonAvailable == false) {
						let slotsarr = await common.helpers.getTimeSlots(
							timeObj.afternoon.startTime,
							timeObj.afternoon.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
					if (leaveDays.isEveningAvailable == false) {
						let slotsarr = await common.helpers.getTimeSlots(
							timeObj.evening.startTime,
							timeObj.evening.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
				} else {
					if (timeObj.morning.isAvailable == 1) {
						let slotsarr = await common.helpers.getTimeSlots(
							timeObj.morning.startTime,
							timeObj.morning.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
					if (timeObj.afternoon.isAvailable == 1) {
						let slotsarr = await common.helpers.getTimeSlots(
							timeObj.afternoon.startTime,
							timeObj.afternoon.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
					if (timeObj.evening.isAvailable == 1) {
						let slotsarr = await common.helpers.getTimeSlots(
							timeObj.evening.startTime,
							timeObj.evening.endTime,
							constant.kInterval
						);

						slots.push(...slotsarr);
					}
				}

				// console.log("slots");
				// console.log(slots);

				if(!slots.includes(moment(requiredTime).utc().format("HH:mm"))){
					continue;
				}

				var slotExists = await appointmentCollection.findOne({
					where: {
						appointmentDate: requiredTime,
						therapistId: therapistId,
					},
					include: [{ model: paymentCollections, as: "payment" }],
				});

				if (slotExists) {
					// payment not successsed -> available 
					if (slotExists.payment.dataValues.paymentStatus != "1") {
						isTherapyAvailable = true;
					}
					// slot is cancled
					if (slotExists.status == 2) {
						isTherapyAvailable = false;
					}
				}else{
					isTherapyAvailable = true;
				}
				
				if(isTherapyAvailable){
					availableTherapists.push(therapist);
				}
			}

		}
		// console.log("******************************************");
		// console.log(requiredTime);
		// console.log(availableTherapists.length);

		const dataArray = [];

		for (let i = 0; i < availableTherapists.length; i++) {
			var response = await common.response.users.getAllTherapistObj(availableTherapists[i]);
			dataArray.push(response);
		}

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		var paginations = await pagination(availableTherapists.length, 1, availableTherapists.length);

		return common.responseModel.successGetResponse(
			successOrError.getUsers,
			dataArray,
			{},
			paginations
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


module.exports.getConsultNowTime = async ()=> {
	var round = 1000 * 60 * 60;
	const min = moment().utc().format('mm');

	if(min <= 45){
		var date = new Date(moment().utc().format());
		requiredTime = new Date(Math.ceil(date.getTime() / round) * round);
	}else{
		var date = new Date(moment().utc().add(1, 'hours').format());
		requiredTime = new Date(Math.ceil(date.getTime() / round) * round);
	}
	
	var successOrError = await common.responseServices.successOrErrors("successMessage");

	const response = {
		date: moment(requiredTime).utc().format("YYYY-MM-DD"),
		timeSlot : requiredTime
	};
	return common.responseModel.successGetResponse(
		successOrError.getUsers,
		response,
		{},
		null
	);
}


module.exports.enableConsultNow = async (req) => {
	try {
		
		var queryParams = req.query;
		var userId = await common.helpers.decryptData(queryParams.id);
		
		if (!userId) {
			var successOrError = await common.responseServices.successOrErrors("err_32");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userData = await usersCollection.findOne({ where: { id: userId, role: 0, isDeleted: 0} });

		if (!userData) {
			var successOrError = await common.responseServices.successOrErrors("err_76");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		// if already active
		if(userData.isConsultNow){
			var successOrError = await common.responseServices.successOrErrors("err_159");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		var edits = {isConsultNow: 1}

		// if prices not set -> same as default sessions
		if(userData.chatConsultNowPrice == 0 
			&& userData.voiceConsultNowPrice == 0
			&& userData.videoConsultNowPrice == 0){
				var edits = {
					isConsultNow: 1, 
					chatConsultNowPrice: userData.chatSessionPrice,
					voiceConsultNowPrice: userData.voiceSessionPrice,
					videoConsultNowPrice: userData.videoSessionPrice
				}
		}
		// enable
		await usersCollection.update( edits, { where: { id: userId } });

		var SuccessOrError = await common.responseServices.successOrErrors("successMessage");
		return common.responseModel.successResponse(
			SuccessOrError.enableConsultNow,
			"",
			""
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


module.exports.disableConsultNow = async (req) => {
	try {
		
		var queryParams = req.query;
		var userId = await common.helpers.decryptData(queryParams.id);

		if (!userId) {
			var successOrError = await common.responseServices.successOrErrors("err_32");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userData = await usersCollection.findOne({ where: { id: userId, role: 0, isDeleted: 0} });

		if (!userData) {
			var successOrError = await common.responseServices.successOrErrors("err_76");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		// if already deactive
		if(!userData.isConsultNow){
			var successOrError = await common.responseServices.successOrErrors("err_160");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		// enable
		await usersCollection.update({ isConsultNow: 0 }, { where: { id: userId } });

		var SuccessOrError = await common.responseServices.successOrErrors("successMessage");
		return common.responseModel.successResponse(
			SuccessOrError.disableConsultNow,
			"",
			""
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