var common = require("./common");

var Sequelize = require("sequelize");

const { pagination } = require("../helpers/pagination");

/**
 * DATABASE
 */
const reviewsCollections = common.db.reviews;
const professionalCollections = common.db.professional;

async function reviewsObjectRes(id) {
	var data = await reviewsCollections.findOne({ where: { id: id } });

	var encryptId = await common.helpers.encryptData(data.id);

	var reviewsObj = {
		"id": encryptId,
		"therapistId ": await common.helpers.encryptData(data.therapistId),
		"patientId ": await common.helpers.encryptData(data.patientId),
		"description": data.description,
		"rating": data.rating,
		"createdAt": data.createdAt,
		"updatedAt": data.updatedAt,
	};
	return reviewsObj;
}

async function getAllReviewsObj(data) {
	var spArr = [];

	if (data.patientReviews.profileImage != "") {
		var profileImage = await common.helpers.fetchFileFromS3(
			data.patientReviews.profileImage,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
		);
	}

	var count = await reviewsCollections.count({
		where: { therapistId: data.therapistId },
	});

	var specialization = await professionalCollections.findAll({
		where: { userId: data.therapistReviews.id },
	});
	if (specialization.length != 0) {
		for (let i = 0; i < specialization.length; i++) {
			const element = specialization[i];
			spArr.push(element.specialization);
		}
		var specializationArr = [...new Set(spArr)];
	}
	

	var reviewsObj = {
		"id": await common.helpers.encryptData(data.id),
		"therapistId ": await common.helpers.encryptData(data.therapistReviews.id),
		"patientId ": await common.helpers.encryptData(data.patientReviews.id),
		"rating": data.rating,
		"description": data.description ? data.description : "",
		"doctorName": data.therapistReviews.firstName + " " + data.therapistReviews.lastName,
		"patientName": data.patientReviews.firstName + " " + data.patientReviews.lastName,
		"doctorSpecialization": specializationArr,
		"doctorEmail": data.therapistReviews.email,
		"doctorPhone": data.therapistReviews.mobileNumber,
		"countOfPatientReviews": count,
		"patientProfileImage": profileImage ? profileImage : "",
		"createdAt": data.createdAt,
		"updatedAt": data.updatedAt,
	};

	return reviewsObj;
}

module.exports = {
	reviewsObjectRes,
	getAllReviewsObj,
};
