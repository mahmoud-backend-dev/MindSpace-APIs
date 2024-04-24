/**
 * HELPERS
 */
var common = require("../common");

/**
 * BUCKECT
 */
const bucketName = process.env.AWS_BUCKETNAME;
const profileImageUrl = process.env.AWS_UPLOAD_PATH_FOR_PROFILE;

const { certificateObject, educationalCertiObjRes } = require("../../response/usersObject");

/**
 * DATABASE
 */
const doctorsCollection = common.db.users;
const usersCollection = common.db.users;
const userTherapies = common.db.userTherapies;
const therapies = common.db.therapies;
const professional = common.db.professional;
const certifications = common.db.certifications;
const therapistWorkDays = common.db.therapistWorkDays;
const Op = common.db.Sequelize;

/**
 *
 * ADMIN UPDATE DETAILS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.updateDoctorProfile = async (req) => {
	try {
		/**
		 * ADMIN ID VALIDATION
		 */
		if (req.params.id) {
			var decryptId = await common.helpers.decryptData(req.params.id);

			if (decryptId != false) {
				var doctorsIdQuery = { where: { id: decryptId, isDeleted: 0 } };
				var doctorsDetails = await common.query.findOne(doctorsCollection, doctorsIdQuery);

				//GET THE ID
				var doctorId = { id: decryptId };

				var doctorsObject = {};

				if (doctorsDetails != null) {
					/**
					 * UPDATE FIRSTNAME THEN CALL THIS CONDITION
					 */
					if (req.body.firstName != "" && typeof req.body.firstName != "undefined") {
						var validationFirstName = await common.helpers.nameValidation(req.body.firstName);

						if (validationFirstName == false) {
							/**
							 * FIRST NAME VALIDATION
							 */

							var successOrError = await common.responseServices.successOrErrors("err_43");
							var resobj = await common.responseModel.resObj(
								successOrError.code,
								successOrError.message,
								successOrError.parameters.firstName,
								successOrError.location
							);
							return await common.responseModel.failResponse(
								successOrError.failMsg,
								{},
								resobj
							);
						} else {
							doctorsObject.firstName = req.body.firstName;
						}
					} else {
						doctorsObject.firstName = doctorsDetails.dataValues.firstName;
					}

					/** CHECK GENDER  */
					if (req.body.gender != "" && typeof req.body.gender != "undefined") {
						if (req.body.gender != 1 && req.body.gender != 2 && req.body.gender != 3) {
							var successOrError = await common.responseServices.successOrErrors("err_58");
							var resobj = await common.responseModel.resObj(
								successOrError.code,
								successOrError.message,
								successOrError.parameters.gender,
								successOrError.location
							);
							return await common.responseModel.failResponse(
								successOrError.failMsg,
								{},
								resobj
							);
						} else {
							doctorsObject.gender = req.body.gender;
						}
					} else {
						doctorsObject.gender = doctorsDetails.dataValues.gender;
					}

					/**
					 * UPDATE LASTNAME THEN CALL THIS CONDITION
					 */
					if (req.body.lastName != "" && typeof req.body.lastName != "undefined") {
						var validationLastName = await common.helpers.nameValidation(req.body.lastName);

						if (validationLastName == false) {
							/**
							 * FIRST NAME VALIDATION
							 */

							var successOrError = await common.responseServices.successOrErrors("err_43");
							var resobj = await common.responseModel.resObj(
								successOrError.code,
								successOrError.message,
								successOrError.parameters.lastName,
								successOrError.location
							);

							return await common.responseModel.failResponse(
								successOrError.failMsg,
								{},
								resobj
							);
						} else {
							doctorsObject.lastName = req.body.lastName
								? req.body.lastName
								: doctorsDetails.dataValues.lastName;
						}
					} else {
						doctorsObject.lastName = req.body.lastName;
					}

					/**
					 * UPDATE PHONE  THEN CALL THIS CONDITION
					 */
					if (req.body.phone != "" && typeof req.body.phone != "undefined") {
						var validationPhone = await common.helpers.checkPhone(req.body.phone);

						if (validationPhone == false) {
							/**
							 * PHONE NAME VALIDATION
							 */

							var successOrError = await common.responseServices.successOrErrors("err_119");
							var resobj = await common.responseModel.resObj(
								successOrError.code,
								successOrError.message,
								successOrError.parameters.fullName,
								successOrError.location
							);
							return await common.responseModel.failResponse(
								successOrError.failMsg,
								{},
								resobj
							);
						} else {
							/** Check Phone exist exists  in Db */

							var mobileNumber = await usersCollection.findOne({
								where: {
									id: { [Op.ne]: doctorId, isDeleted: 0, mobileNumber: req.body.phone },
								},
							});

							if (mobileNumber) {
								var successOrError = await common.responseServices.successOrErrors(
									"err_41"
								);
								var resobj = await common.responseModel.resObj(
									successOrError.code,
									successOrError.message,
									successOrError.parameters.mobileNumber,
									successOrError.location
								);
								return await common.responseModel.failResponse(
									successOrError.failMsg,
									{},
									resobj
								);
							} else {
								doctorsObject.mobileNumber = req.body.phone
									? req.body.phone
									: doctorsDetails.dataValues.phone;
							}
						}
					} else {
						doctorsObject.mobileNumber = req.body.phone;
					}

					/**
					 * UPDATE EMAIL THEN CALL THIS CONDITION
					 */
					if (
						req.body.email != "" &&
						typeof req.body.email != "undefined" &&
						typeof req.body.email == "string"
					) {
						var emailValidation = await common.helpers.validateEmail(req.body.email);
						var adminEmailQuery = { email: req.body.email, isDeleted: 0 };
						var adminDetails = await common.query.findSome(
							doctorsCollection,
							adminEmailQuery
						);
						var filter = adminDetails.filter((item) => item.dataValues.id != decryptId);

						if (filter.length != 0) {
							/**
							 * EMAIL ALREADY EXITS
							 */

							var successOrError = await common.responseServices.successOrErrors("err_04");
							var resobj = await common.responseModel.resObj(
								successOrError.code,
								successOrError.message,
								successOrError.parameters.email,
								successOrError.location
							);
							return await common.responseModel.failResponse(
								successOrError.failMsg,
								{},
								resobj
							);
						} else {
							if (emailValidation == false) {
								/**
								 * INVALID EMAIL
								 */

								var successOrError = await common.responseServices.successOrErrors(
									"err_03"
								);
								var resobj = await common.responseModel.resObj(
									successOrError.code,
									successOrError.message,
									successOrError.parameters.email,
									successOrError.location
								);
								return await common.responseModel.failResponse(
									successOrError.failMsg,
									{},
									resobj
								);
							} else {
								var email = await usersCollection.findOne({
									where: {
										id: { [Op.ne]: doctorId },
										isDeleted: 0,
										email: req.body.email,
									},
								});

								if (email) {
									var successOrError = await common.responseServices.successOrErrors(
										"err_04"
									);
									var resobj = await common.responseModel.resObj(
										successOrError.code,
										successOrError.message,
										successOrError.parameters.email,
										successOrError.location
									);
									return await common.responseModel.failResponse(
										successOrError.failMsg,
										{},
										resobj
									);
								} else {
									doctorsObject.email = req.body.email
										? req.body.email
										: doctorsDetails.dataValues.email;
								}
							}
						}
					}

					/**
					 * UPDATE DESCRIPTION THEN CALL THIS CONDITION
					 */
					if (req.body.description != "" && typeof req.body.description != "undefined") {
						doctorsObject.description = req.body.description
							? req.body.description
							: doctorsDetails.dataValues.description;
					} else {
						doctorsObject.description = req.body.description;
					}

					/** UPDATE PROFILE  THEN CALL THIS CONDITION*/

					var files = req.files;
					if (files && files.profileImage != "" && typeof files.profileImage != "undefined") {
						var validateProfileImage = await common.helpers.profileValidation(
							files.profileImage
						);

						// INVALID FILE
						if (validateProfileImage == false) {
							var successOrError = await common.responseServices.successOrErrors("err_29");
							var resobj = await common.responseModel.resObj(
								successOrError.code,
								successOrError.message,
								successOrError.parameters.profileImage,
								successOrError.location
							);
							return await common.responseModel.failResponse(
								successOrError.failMsg,
								{},
								resobj
							);
						}
						// UPLOAD FILE ON BUCKECT
						var bucket = bucketName + "/" + profileImageUrl;
						await common.helpers.uploadFileToS3(
							files.profileImage,
							validateProfileImage,
							bucket
						);

						var fileExists = await usersCollection.findOne({
							where: { id: decryptId, isDeleted: 0 },
						});

						if (fileExists) {
							if (fileExists.profileImage != "") {
								await common.helpers.deleteFileFromS3(fileExists.profileImage, bucket);
							}
						}
						doctorsObject.profileImage = validateProfileImage;
					}

					/**
					 * UPDATE CATEGORY THEN CALL THIS CONDITION
					 */

					if (req.body.categories && req.body.categories.length) {
						//REMOVE CATEGORY FROM  usertherapies TABLE
						var updateEmailQuery = { userId: doctorId.id };

						await common.query.remove(userTherapies, updateEmailQuery);

						for (let i = 0; i < req.body.categories.length; i++) {
							const categoryId = req.body.categories[i];

							await common.query.create(userTherapies, {
								userId: doctorId.id,
								therapiId: categoryId,
							});
						}
					}

					var update = await common.query.update(doctorsCollection, doctorId, doctorsObject);

					if (update == 0) {
						/**
						 * SOME THING WENT WRONG WHILE UPDATE ADMIN
						 */

						var successOrError = await common.responseServices.successOrErrors("err_29");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}
				} else {
					var successOrError = await common.responseServices.successOrErrors("err_19");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.userId,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
			} else {
				/**
				 * INVALID ADMIN ID
				 */
				var successOrError = await common.responseServices.successOrErrors("err_23");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.therapistId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		} else {
			/**
			 * INVALID ADMIN ID
			 */

			var successOrError = await common.responseServices.successOrErrors("err_57");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.doctorId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/**
		 * SUCCESS RESPONSE
		 */
		var doctorsDetails = await common.query.find(usersCollection, {
			where: { id: decryptId, isDeleted: 0 },

			attributes: [
				"id",
				"firstName",
				"lastName",
				"email",
				"mobileNumber",
				"description",
				"createdAt",
				"profileImage",
				"gender",
			],
			include: [
				{
					model: userTherapies,
					as: "userTherapies",
					attributes: ["therapiId"],
					include: [
						{
							model: therapies,
							as: "therapies",
							attributes: ["therapiName"],
						},
					],
				},
				{
					model: professional,
					as: "professionalDetails",
				},
				{
					model: certifications,
					as: "certifications",
				},
				{
					model: therapistWorkDays,
					as: "therapistWorkDays",
					attributes: [
						"id",
						"dayOfWeek",
						"morningStartTime",
						"morningEndTime",
						"isMorningAvailable",
						"afternoonStartTime",
						"afternoonEndTime",
						"isAfternoonAvailable",
						"eveningStartTime",
						"eveningEndTime",
						"isEveningAvailable",
					],
				},
			],
		});

		/** Single Doctor details Object */
		var dataArray = {};
		for (let i = 0; i < doctorsDetails.length; i++) {
			let doctorsDetailsList = doctorsDetails[i];
			let inner = doctorsDetailsList.userTherapies;
			let innerExperience = doctorsDetailsList.professionalDetails;
			let certificationsDetails = doctorsDetailsList.certifications;
			let workDaysDetails = doctorsDetailsList.therapistWorkDays;

			const therapiArr = [];
			const certificates = [];
			const workingTimeTable = [];

			let professionalCount = 0;
			for (let j = 0; j < inner.length; j++) {
				const element1 = inner[j].therapies.therapiName;
				therapiArr.push(element1);
			}
			for (let k = 0; k < innerExperience.length; k++) {
				const element2 = innerExperience[k].workExperience;
				professionalCount += parseInt(element2);
			}

			for (let l = 0; l < certificationsDetails.length; l++) {
				const element = certificationsDetails[l];
				if (element.documentType == "government") {
					const governmentData = await certificateObject(element);
					certificates.push(governmentData.document);
				} else {
					const educationData = await educationalCertiObjRes(element);
					certificates.push(educationData.document);
				}
			}

			for (let m = 0; m < workDaysDetails.length; m++) {
				const workingDayElement = workDaysDetails[m];
				workingTimeTable.push(workingDayElement);
			}

			var response = await common.response.admins.singleDoctorsObjectRes(
				doctorsDetailsList,
				therapiArr,
				professionalCount,
				certificates,
				workingTimeTable,
				"",
				""
			);
			dataArray = response;
		}

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(
			successOrError.updateDoctors,
			dataArray,
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
