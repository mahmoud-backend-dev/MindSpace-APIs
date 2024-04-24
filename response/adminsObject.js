const { Common } = require("googleapis");
var helpers = require("../helpers/helpers");
require("dotenv").config();
/**
 * ADMIN OBJECT
 * @param {OBJECT} data
 * @param {STRING} token
 * @returns OBJECT
 */
async function adminObjectRes(data, token) {
	var encryptFunc = await helpers.encryptData(data.id);
	adminData = {
		id: encryptFunc,
		token: token,
		fullName: data.fullName,
		email: data.email,
		role: data.assignRole == "0" ? 0 : 1,
		phone: data.phone,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
	if (data.profile != "") {
		adminData.profile = await helpers.fetchFileFromS3(
			data.profile,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
		);
	} else {
		adminData.profile = "";
	}

	return adminData;
}

async function patientsObjectRes(data) {
	var encryptFunc = await helpers.encryptData(data.id);

	if (data.gender == "1") {
		var gender = "Male";
	} else if (data.gender == "2") {
		var gender = "Female";
	} else if (data.gender == "3") {
		var gender = "Others";
	} else {
		var gender = "";
	}

	patientsData = {
		id: encryptFunc,
		firstName: data.firstName ? data.firstName : "",
		lastName: data.lastName ? data.lastName : "",
		country: data.country ? data.country : "",
		email: data.email ? data.email : "",
		gender: gender,
		countryCode: data.countryCode,
		mobileNumber: data.mobileNumber ? data.mobileNumber : "",
		createdAt: data.createdAt,
	};
	if (data.profileImage != "") {
		patientsData.profileImage = await helpers.fetchFileFromS3(
			data.profileImage,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
		);
	} else {
		patientsData.profileImage = "";
	}

	return patientsData;
}

async function doctorsObjectRes(data, therapies) {
	var encryptFunc = await helpers.encryptData(data.id);
	if (data.gender == "1") {
		var gender = "Male";
	} else if (data.gender == "2") {
		var gender = "Female";
	} else if (data.gender == "3") {
		var gender = "Others";
	} else {
		var gender = "";
	}

	doctorsData = {
		id: encryptFunc,
		firstName: data.firstName ? data.firstName : "",
		lastName: data.lastName ? data.lastName : "",
		email: data.email ? data.email : "",
		gender: gender,
		therapies: therapies ? therapies : [],
		dob: data.dob ? data.dob : "",
		address: data.address ? data.address : "",
		countryCode: data.countryCode ? data.countryCode : "",
		country: data.country ? data.country : "",
		city: data.city ? data.city : "",
		mobileNumber: data.mobileNumber ? data.mobileNumber : "",
		isActive: data.isActive && data.isActive,
		isSuspend: data.isSuspend,
		suspendReason: data.suspendReason ? data.suspendReason : "",
		suspendSubject: data.suspendSubject ? data.suspendSubject : "",
		createdAt: data.createdAt,
	};
	if (data.profileImage != "") {
		doctorsData.profileImage = await helpers.fetchFileFromS3(
			data.profileImage,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
		);
	} else {
		doctorsData.profileImage = "";
	}

	return doctorsData;
}

async function singleDoctorsObjectRes(
	data,
	therapies,
	experiance,
	certificates,
	workingTimeTable,
	reviews,
	ratingCount,
	bankDetails,
	visitedAndEarning = {}
) {
	var encryptFunc = await helpers.encryptData(data.id);

	var ratingCount = ratingCount && reviews.length ? ratingCount / reviews.length : 0;
	doctorsData = {
		id: encryptFunc,
		firstName: data.firstName ? data.firstName : "",
		lastName: data.lastName ? data.lastName : "",
		visitedPatient: visitedAndEarning ? visitedAndEarning.count : 0,
		totalEarning: visitedAndEarning ? visitedAndEarning.totalEarning : 0,
		email: data.email ? data.email : "",
		mobileNumber: data.mobileNumber ? data.mobileNumber : "",
		isSuspend: data.isSuspend ? data.isSuspend : "",
		suspendReason: data.suspendReason ? data.suspendReason : "",
		suspendSubject: data.suspendSubject ? data.suspendSubject : "",
		description: data.description ? data.description : "",
		experiance: experiance ? experiance : 0,
		specializedCategories: therapies ? therapies : [],
		gender: data.gender ? data.gender : 0,
		joiningDate: data.createdAt ? data.createdAt : "",
		timeTalble: workingTimeTable ? workingTimeTable : "",
		submitted_documents: certificates ? certificates : [],
		averageRatingCount: ratingCount,
		totalpatientReviews: reviews.length != 0 ? reviews.length : 0,
		reviews: reviews ? reviews : [],
		bankDetails: bankDetails ? bankDetails : [],
	};
	if (data.profileImage != "") {
		doctorsData.profileImage = await helpers.fetchFileFromS3(
			data.profileImage,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
		);
	} else {
		doctorsData.profileImage = "";
	}

	return doctorsData;
}

async function adminAssocationObjectRes(data, assignArr) {
	var encryptFunc = await helpers.encryptData(data.id);
	adminData = {
		id: encryptFunc,
		fullName: data.fullName,
		email: data.email,
		role: data.assignRole == "0" ? "supervisor" : "junior supervisor",
		phone: data.phone,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
		assignRole: assignArr,
	};
	if (data.profile != "") {
		adminData.profile = await helpers.fetchFileFromS3(
			data.profile,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
		);
	} else {
		adminData.profile = "";
	}
	return adminData;
}

module.exports = {
	singleDoctorsObjectRes,
	adminObjectRes,
	doctorsObjectRes,
	patientsObjectRes,
	adminAssocationObjectRes,
};
