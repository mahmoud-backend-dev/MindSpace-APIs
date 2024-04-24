var common = require("./common");
var moment = require("moment");
var { pagination } = require("../helpers/pagination");

/**
 * DATABASE
 */
const appointmentCollections = common.db.appointments;
const usersCollections = common.db.users;
const paymentCollection = common.db.payment;

async function appointmentObjectRes(id, therapistId, patientId) {
	var data = await appointmentCollections.findOne({
		where: { id: id },
	});
	var appointmentObj = {};

	var doctorData = await usersCollections.findOne({
		where: { id: therapistId },
	});
	var patientData = await usersCollections.findOne({
		where: { id: patientId },
	});

	var encryptId = await common.helpers.encryptData(data.id);

	if (doctorData.profileImage != "") {
		var therapistImg = await common.helpers.fetchFileFromS3(
			doctorData.profileImage,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
		);
	} else {
		var therapistImg = "";
	}
	if (patientData.profileImage != "") {
		var patientImg = await common.helpers.fetchFileFromS3(
			patientData.profileImage,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
		);
	} else {
		var patientImg = "";
	}

	var appointmentDate = moment(data.appointmentDate).format("YYYY-MM-DD");

	if (data.interactionType == 0) {
		var sessionPrice = doctorData.chatSessionPrice;
	} else if (data.interactionType == 1) {
		var sessionPrice = doctorData.voiceSessionPrice;
	} else if (data.interactionType == 2) {
		var sessionPrice = doctorData.videoSessionPrice;
	}

	appointmentObj = {
		"id": encryptId,
		"patientId": await common.helpers.encryptData(patientData.id),
		"therapistId": await common.helpers.encryptData(doctorData.id),
		"doctorName": doctorData.firstName + " " + doctorData.lastName,
		"patientName": patientData.firstName + " " + patientData.lastName,
		"appointmentDate": data.appointmentDate ? appointmentDate : null,
		"therapistProfileImage": therapistImg,
		"patientProfileImage": patientImg,
		"slotStartTime": data.slotStartTime,
		"slotEndTime": data.slotEndTime,
		"sessionType": data.interactionType,
		"sessionPrice": sessionPrice,
		"createdAt": data.createdAt,
		"updatedAt": data.updatedAt,
	};

	return appointmentObj;
}

async function getAllAppointmentRes(userId, limitQuery, pageQuery, sort, status, role) {
	if (role == 1) {
		var whereCondition = { patientId: userId, status: status, "$payment.paymentStatus$": "1" };
	} else if (role == 0) {
		var whereCondition = { therapistId: userId, status: status, "$payment.paymentStatus$": "1" };
	}
	var offset = limitQuery * (pageQuery - 1);
	var count = await appointmentCollections.count({
		where: whereCondition,
		include: [{ model: paymentCollection, as: "payment" }],
	});
	var sortFiled = "";
	var sort = "";
	if (status == "0" || status == "3") {
		sortFiled = "slotStartTime";
		sort = "asc";
	} else if (status == "2" || status == "1" || status == "4") {
		sortFiled = "updatedAt";
		sort = "desc";
	}
	var userDetails = await appointmentCollections.findAll({
		where: whereCondition,
		include: [{ model: paymentCollection, as: "payment" }],
		offset: offset,
		limit: limitQuery,
		order: [[sortFiled, sort]],
	});

	if (!userDetails || count == 0) {
		var data = "";
		return data;
	}
	var paginations = await pagination(limitQuery, pageQuery, count);

	var resArr = [];

	for (let i = 0; i < userDetails.length; i++) {
		const element = userDetails[i];

		var responseObj = await appointmentObjectRes(
			element.id,
			element.therapistId,
			element.patientId,
			role
		);

		resArr.push(responseObj);
	}

	var returnObj = {
		pagination: paginations,
		data: resArr,
	};

	return returnObj;
}

module.exports = {
	appointmentObjectRes,
	getAllAppointmentRes,
};
