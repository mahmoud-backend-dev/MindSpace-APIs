const { Op } = require("sequelize");
const moment = require("moment");
const helpers = require("../helpers/helpers");
require("dotenv").config();
var common = require("./common");
const governmentFile =
	process.env.AWS_URL +
	"/" +
	process.env.AWS_BUCKETNAME +
	"/" +
	process.env.AWS_UPLOAD_PATH_FOR_GOVERNMENT_CERTIFICATE;
const educationalFiles =
	process.env.AWS_URL +
	"/" +
	process.env.AWS_BUCKETNAME +
	"/" +
	process.env.AWS_UPLOAD_PATH_FOR_EDUCATIONAL;
const profileImage =
	process.env.AWS_URL +
	"/" +
	process.env.AWS_BUCKETNAME +
	"/" +
	process.env.AWS_UPLOAD_PATH_FOR_PROFILE;
/**
 * DATABASE
 */
const usersCollection = common.db.users;
const appointmentCollections = common.db.appointments;
const professionalCollection = common.db.professional;
const bankDetailsCollection = common.db.bankDetails;
const userTherapiesCollection = common.db.userTherapies;
const therapyCollection = common.db.therapies;
const certificateCollection = common.db.certifications;
const employmentHistory = common.db.employmentHistory;
const languageCollections = common.db.therapistLanguages;
const workDaysCollection = common.db.therapistWorkDays;
const leaveDaysCollection = common.db.therapistLeaveDays;

/**
 * TO GET DATA OF SINGLE USER BY ID
 * @param {Number} userId
 * @param {String} token
 * @returns
 */

// async function query(userId) {
// 	var userQuery = {
// 		where: { id: userId },
// 	};
// 	return userQuery;
// }

async function singleUserObjectRes(userId, token) {
	var userData = await common.query.findOne(usersCollection, {
		where: { id: userId },
	});

	if (userData.role == 1) {
		var userObj = await patientObjectRes(userData, token);
	} else if (userData.role == 0) {
		var appointmentDataCount = await appointmentCollections.findAndCountAll({
			where: { therapistId: userId, status: "1" },
		});

		var userData = await usersCollection.findOne({
			where: { id: userId },
			include: [
				{
					model: bankDetailsCollection,
					as: "bankDetails",
				},
				{
					model: professionalCollection,
					as: "professionalDetails",
					include: [
						{
							model: employmentHistory,
							as: "empHistory",
						},
					],
				},
				{
					model: certificateCollection,
					as: "certifications",
				},
				{
					model: userTherapiesCollection,
					as: "userTherapies",
					include: [
						{
							model: therapyCollection,
							as: "therapies",
						},
					],
				},
				{
					model: languageCollections,
					as: "therapistlanguages",
				},
				{
					model: workDaysCollection,
					as: "therapistWorkDays",
				},
				{
					model: leaveDaysCollection,
					as: "therapistLeaveDays",
				},
			],
		});

		var userObj = await therapistObjectRes(userData, token);

		var therapiesDetails = [];
		var professionalDetails = [];
		var bankDetails = {};
		var certificationsDetails;
		var educationalDetails = [];
		var langaugeDetails = [];
		var leaveDayArr = [];
		var workDayArr = [];

		if (userData) {
			if (userData.professionalDetails) {
				for (let i = 0; i < userData.professionalDetails.length; i++) {
					const element = userData.professionalDetails[i];
					var professionObj = await userProffesionalObj(element);
					professionalDetails.push(professionObj);
				}
			}
			if (userData.bankDetails) {
				for (let i = 0; i < userData.bankDetails.length; i++) {
					const element = userData.bankDetails[i];
					bankDetails = await userBankObj(element);
				}
			}
			if (userData.userTherapies) {
				for (let j = 0; j < userData.userTherapies.length; j++) {
					const element = userData.userTherapies[j];

					var userTherapiesObj = await userTherapiObj(element.therapies);
					therapiesDetails.push(userTherapiesObj);
				}
			}

			if (userData.certifications) {
				for (let k = 0; k < userData.certifications.length; k++) {
					const element = userData.certifications[k];

					if (element.documentType == "government") {
						certificationsObj = await certificateObject(element);
						certificationsDetails = certificationsObj;
					} else {
						var eduObj = await educationalCertiObjRes(element);
						educationalDetails.push(eduObj);
					}
				}
			}

			if (userData.therapistlanguages) {
				for (let l = 0; l < userData.therapistlanguages.length; l++) {
					const element = userData.therapistlanguages[l];
					langaugeDetails.push(element.languageName);
				}
			}
			if (userData.therapistWorkDays) {
				for (let i = 0; i < userData.therapistWorkDays.length; i++) {
					const element = userData.therapistWorkDays[i];
					var workDayObj = await workDaysResObj(element.id);
					workDayArr.push(workDayObj);
				}
			}
			if (userData.therapistLeaveDays) {
				for (let i = 0; i < userData.therapistLeaveDays.length; i++) {
					const element = userData.therapistLeaveDays[i];
					var workDayObj = await leaveDaysResObj(element.id);
					leaveDayArr.push(workDayObj);
				}
			}
		}

		userObj.therapiesDetails = therapiesDetails;
		userObj.professionalDetails = professionalDetails;
		userObj.bankDetails = bankDetails;
		userObj.certificateDetails = certificationsDetails;
		userObj.educationalDetails = educationalDetails;
		userObj.langaugeDetails = langaugeDetails;
		userObj.workDaysDetails = workDayArr;
		userObj.leaveDetails = leaveDayArr;

		if (appointmentDataCount) {
			userObj.sessionCompleted = appointmentDataCount.count;
		}
	}

	return userObj;
}

/**
 * USER RESPONSE FUNCTION
 * @param {Object} data
 * @param {String} token
 * @returns Object
 */

async function therapistByPatientIdObject(data) {
	therapist = {
		id: await helpers.encryptData(data.id),
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
	};
	return therapist;
}

async function therapistObjectRes(data, token) {
	if (data.profileImage != "") {
		var img = await common.helpers.fetchFileFromS3(
			data.profileImage,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
		);
	} else {
		var img = "";
	}

	if (data.gender != "1" && data.gender != "2" && data.gender != "3") {
		var gender = "";
	} else {
		var gender = data.gender;
	}

	userData = {
		id: await helpers.encryptData(data.id),
		token: token,
		role: data.role,
		loginType: data.loginType,
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		dob: data.dob != null ? moment(data.dob).format("DD-MM-YYYY") : "",
		countryCode: data.countryCode,
		mobileNumber: data.mobileNumber,
		address: data.address,
		status: data.status,
		linkedinId: data.linkedinId,
		facebookId: data.facebookId,
		city: data.city,
		country: data.country,
		timezone: data.timezone,
		description: data.description,
		language: data.language,
		gender: gender,
		googleId: data.googleId,
		appleId: data.appleId,
		instagramId: data.instagramId,
		linkedinId: data.linkedinId,
		facebookLink: data.facebookLink,
		isNotification: data.isNotification,
		isEmailVerified: data.isEmailVerified,
		profileImage: img,
		isActive: data.isActive,
		onlineStatus: data.onlineStatus,
		isChat: data.isChat,
		isVoice: data.isVoice,
		isVideo: data.isVideo,
		reason: data.reason,
		chatSessionPrice: data.chatSessionPrice,
		videoSessionPrice: data.videoSessionPrice,
		voiceSessionPrice: data.voiceSessionPrice,
		isConsultNow: data.isConsultNow,
		chatConsultNowPrice: data.chatConsultNowPrice,
		voiceConsultNowPrice: data.voiceConsultNowPrice,
		videoConsultNowPrice: data.videoConsultNowPrice,
		personalDetailsFlag: data.personalDetailsFlag,
		isProfileSet: data.isProfileSet,
		professionalFlag: data.professionalFlag,
		therapiFlag: data.therapiesFlag,
		certificationFlag: data.certificationFlag,
		bankDetailsFlag: data.bankDetailsFlag,
		workDaysDetailsFlag: data.workDaysDetailsFlag,
		deviceType: data.deviceType,
		deviceToken: data.deviceToken,
		deviceId: data.deviceId,
		voIpToken: data.voIpToken,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
	return userData;
}

async function userProffesionalObj(data) {
	var empHistory = [];
	if (data.empHistory) {
		for (let i = 0; i < data.empHistory.length; i++) {
			const element = data.empHistory[i];

			var historyObj = {
				id: await common.helpers.encryptData(data.id),
				employmentHistory: element.employmentHistory,
				noOfYears: element.noOfYears,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			};
			empHistory.push(historyObj);
		}
	}
	var obj = {
		id: await helpers.encryptData(data.id),
		qualifications: data.qualifications,
		university: data.university,
		specialization: data.specialization,
		workExperience: data.workExperience,
		employmentHistory: empHistory,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};

	return obj;
}

async function userBankObj(data) {
	var obj = {
		id: await helpers.encryptData(data.id),
		accountName: data.accountName,
		bankName: data.bankName,
		accountNo: parseInt(data.accountNo),
		branchAddress: data.branchAddress,
		ibanNo: data.ibanNo,
		typeofAccount: data.accountType,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
	return obj;
}

async function userTherapiObj(data) {
	var obj = {
		id: await helpers.encryptData(data.id),
		therapiName: data.therapiName,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
	return obj;
}

async function patientObjectRes(data, token) {
	if (data.profileImage != "") {
		var img = await common.helpers.fetchFileFromS3(
			data.profileImage,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
		);
	} else {
		var img = "";
	}

	if (data.gender == "1") {
		var gender = "Male";
	} else if (data.gender == "2") {
		var gender = "Female";
	} else if (data.gender == "3") {
		var gender = "Others";
	} else {
		var gender = "";
	}
	// if (data.gender != "1" && data.gender != "2" && data.gender != "3") {
	// 	var gender = "";
	// } else {
	// 	var gender = data.gender;
	// }
	var obj = {
		id: await helpers.encryptData(data.id),
		token: token,
		role: data.role,
		firstName: data.firstName,
		lastName: data.lastName,
		nickName: data.nickName,
		email: data.email,
		googleId: data.googleId,
		appleId: data.appleId,
		facebookId: data.facebookId,
		instagramId: data.instagramId,
		linkedinId: data.linkedinId,
		gender: gender,
		countryCode: data.countryCode,
		profileImage: img,
		mobileNumber: data.mobileNumber,
		eCountryCode: data.eCountryCode,
		timezone: data.timezone,
		emergencyNumber: data.emergencyNumber,
		civilId: data.civilId,
		status: data.status,
		isProfileSet: data.isProfileSet,
		loginType: data.loginType,
		isEmailVerified: data.isEmailVerified,
		isActive: data.isActive,
		deviceType: data.deviceType,
		deviceToken: data.deviceToken,
		voIpToken: data.voIpToken,
		deviceId: data.deviceId,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};

	return obj;
}

async function certificateObject(data) {
	var url = await common.helpers.fetchFileFromS3(
		data.document,
		process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_GOVERNMENT_CERTIFICATE
	);

	var obj = {
		id: await helpers.encryptData(data.id),
		document: url,
		documentType: data.documentType,
		documentName: data.document,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};

	return obj;
}
async function educationalCertiObjRes(data) {
	var url = await common.helpers.fetchFileFromS3(
		data.document,
		process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_EDUCATIONAL
	);

	var obj = {
		id: await helpers.encryptData(data.id),
		document: url,
		documentType: data.documentType,
		documentName: data.document,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};

	return obj;
}
async function empHistoryObjRes(data) {
	var obj = {
		id: await helpers.encryptData(data.id),
		employmentHistory: data.employmentHistory,
		noOfYears: data.noOfYears,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};

	return obj;
}
async function therapistObjResponse(userId) {
	var obj = await singleUserObjectRes(userId);

	var education = [];
	var specialization = [];
	var experience = [];
	var areasOfSpecialization = [];
	var experienceYears = 0;
	var communication = userData.langaugeDetails;
	if (userData.professionalDetails) {
		for (let i = 0; i < userData.professionalDetails.length; i++) {
			const element = userData.professionalDetails[i];
			var educationObj = {
				qualification: element.qualifications,
				university: element.university,
			};
			experienceYears = experienceYears + parseInt(element.workExperience);
			education.push(educationObj);
			specialization.push(element.specialization);
			for (let index = 0; index < element.employmentHistory.length; index++) {
				const element1 = element.employmentHistory[index];
				var experienceObj = {
					employmentHistory: element1.employmentHistory,
					noOfYears: element1.noOfYears,
				};
				experience.push(experienceObj);
			}
		}
	}
	for (let k = 0; k < userData.therapiesDetails.length; k++) {
		const element = obj.therapiesDetails[k];
		areasOfSpecialization.push(element.therapiName);
	}

	var therapistObj = {
		id: obj.id,
		doctorName: obj.firstName + " " + obj.lastName,
		yearsOfExperience: experienceYears,
		specialization: specialization,
		sessionCompleted: obj.sessionCompleted ? obj.sessionCompleted : 0,
		communication: communication,
		isChat: obj.isChat,
		isVoice: obj.isVoice,
		isVideo: obj.isVideo,
		chatSessionPrice: obj.chatSessionPrice,
		videoSessionPrice: obj.videoSessionPrice,
		voiceSessionPrice: obj.voiceSessionPrice,
		isConsultNow: obj.isConsultNow,
		chatConsultNowPrice: obj.chatConsultNowPrice,
		voiceConsultNowPrice: obj.voiceConsultNowPrice,
		videoConsultNowPrice: obj.videoConsultNowPrice,
		profileImage: obj.profileImage,
		facebookId: obj.facebookId,
		instagramId: obj.instagramId,
		linkedinId: obj.linkedinId,
		education: education,
		experience: experience,
		areasOfSpecialization: areasOfSpecialization,
	};

	return therapistObj;
}

async function getAllTherapistObj(userData) {
	if (userData.role == 1) {
		var userObj = await patientObjectRes(userData);
	} else if (userData.role == 0) {
		const therapiArr = [];
		const languageArr = [];
		var therapies = await userTherapiesCollection.findAll({
			where: { userId: userData.id },
			include: [
				{
					model: therapyCollection,
					as: "therapies",
				},
			],
		});

		for (let j = 0; j < therapies.length; j++) {
			const element1 = therapies[j];
			therapiArr.push(element1.therapies.therapiName);
		}

		var languages = await usersCollection.findAll({
			where: { "$therapistlanguages.userId$": userData.id },
			include: [
				{
					model: languageCollections,
					as: "therapistlanguages",
				},
			],
		});

		if (languages) {
			for (let j = 0; j < languages.length; j++) {
				const element = languages[j];

				for (let k = 0; k < element.therapistlanguages.length; k++) {
					const element1 = element.therapistlanguages[k];

					languageArr.push(element1.languageName);
				}
			}
		}
		if (userData.gender == "1") {
			var gender = "Male";
		} else if (userData.gender == "2") {
			var gender = "Female";
		} else if (userData.gender == "3") {
			var gender = "Others";
		} else {
			var gender = "";
		}

		if (userData.profileImage != "") {
			var img = await common.helpers.fetchFileFromS3(
				userData.profileImage,
				process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
			);
		} else {
			var img = "";
		}

		var userObj = {
			id: await common.helpers.encryptData(userData.id),
			isActive: userData.isActive,
			isOnline: userData.onlineStatus,
			role: userData.role,
			therapistName: userData.firstName + " " + userData.lastName,
			gender: gender,
			language: userData.language,
			chatSessionPrice: userData.chatSessionPrice,
			videoSessionPrice: userData.videoSessionPrice,
			voiceSessionPrice: userData.voiceSessionPrice,
			isChat: userData.isChat,
			isVoice: userData.isVoice,
			isVideo: userData.isVideo,
			isConsultNow: userData.isConsultNow,
			chatConsultNowPrice: userData.chatConsultNowPrice,
			voiceConsultNowPrice: userData.voiceConsultNowPrice,
			videoConsultNowPrice: userData.videoConsultNowPrice,
			facebookId: userData.facebookId,
			instagramId: userData.instagramId,
			linkedinId: userData.linkedinId,
			profileImage: img,
			area: userData.city,
			therapies: therapiArr,
			languages: languageArr,
		};
	}

	return userObj;
}
//---------------
async function workDaysResObj(id) {
	var data = await workDaysCollection.findOne({ where: { id: id } });
	var date = moment().format("YYYY-MM-DD");

	// var date = moment(date + " " + data.morningStartTime + "Z")
	// 	.utc()
	// 	.format("");
	var obj = {
		id: await common.helpers.encryptData(data.id),
		userId: await common.helpers.encryptData(data.userId),
		dayOfWeek: data.dayOfWeek,
		morningStartTime: moment(date + " " + data.morningStartTime + "Z")
			.utc()
			.format(),

		morningEndTime: moment(date + " " + data.morningEndTime + "Z")
			.utc()
			.format(),
		isMorningAvailable: data.isMorningAvailable,
		afternoonStartTime: moment(date + " " + data.afternoonStartTime + "Z")
			.utc()
			.format(),
		afternoonEndTime: moment(date + " " + data.afternoonEndTime + "Z")
			.utc()
			.format(""),
		isAfternoonAvailable: data.isAfternoonAvailable,
		eveningStartTime: moment(date + " " + data.eveningStartTime + "Z")
			.utc()
			.format(""),
		eveningEndTime: moment(date + " " + data.eveningEndTime + "Z")
			.utc()
			.format(""),
		isEveningAvailable: data.isEveningAvailable,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
	return obj;
}
async function leaveDaysResObj(leaveDataId) {
	var data = await leaveDaysCollection.findOne({ where: { id: leaveDataId } });

	var obj = {
		id: await common.helpers.encryptData(data.id),
		userId: await common.helpers.encryptData(data.userId),
		leaveStartDate: data.leaveStartDate.toISOString().replace("T", " "),
		leaveEndDate: data.leaveEndDate.toISOString().replace("T", " "),
		isMorningAvailable: data.isMorningAvailable,
		isAfternoonAvailable: data.isAfternoonAvailable,
		isEveningAvailable: data.isEveningAvailable,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};

	return obj;
}
async function getTransactionList(leaveDataId) {
	var data = await leaveDaysCollection.findOne({ where: { id: leaveDataId } });

	var obj = {
		id: await common.helpers.encryptData(data.id),
		userId: await common.helpers.encryptData(data.userId),
		leaveStartDate: data.leaveStartDate.toISOString().replace("T", " "),
		leaveEndDate: data.leaveEndDate.toISOString().replace("T", " "),
		isMorningAvailable: data.isMorningAvailable,
		isAfternoonAvailable: data.isAfternoonAvailable,
		isEveningAvailable: data.isEveningAvailable,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};

	return obj;
}

module.exports = {
	patientObjectRes,
	singleUserObjectRes,
	userProffesionalObj,
	userBankObj,
	userTherapiObj,
	therapistObjectRes,
	certificateObject,
	educationalCertiObjRes,
	empHistoryObjRes,
	therapistObjResponse,
	getAllTherapistObj,
	workDaysResObj,
	leaveDaysResObj,
	therapistByPatientIdObject,
	getTransactionList,
};
