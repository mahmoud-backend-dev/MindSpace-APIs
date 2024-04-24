/**
 * NPM PACKAGE
 */
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var iban = require("iban");
/**
 * HELPERS
 */
var common = require("../common");
const Op = common.db.Sequelize.Op;

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const bankCollection = common.db.bankDetails;
const professionCollection = common.db.professional;
const therapyCollection = common.db.therapies;
const userTherapyCollection = common.db.userTherapies;
const employmentHistory = common.db.employmentHistory;
const therapistLanguages = common.db.therapistLanguages;
/**
 * UPDATE BY USER ID FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.update = async (req) => {
	try {
		var id = req.params.therapistId;
		var decryptId = await common.helpers.decryptData(id);
		if (!decryptId) {
			var successOrError = await common.responseServices.successOrErrors("err_23");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userDetails = await common.query.findOne(usersCollection, {
			where: {
				id: decryptId,
				isDeleted: 0,
			},
		});

		if (!userDetails) {
			/**
			 * USER NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_19");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (
			typeof req.body.joinUs != "undefined" &&
			req.body.joinUs == true &&
			userDetails.role == 1
		) {
			var updateTherapist = {
				joinUs: 1,
				role: 0,
			};
			await usersCollection.update(updateTherapist, {
				where: { id: userDetails.id },
			});
		} else if (userDetails.role != 0) {
			var successOrError = await common.responseServices.successOrErrors("err_19");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (req.body.personalDetails != "" && typeof req.body.personalDetails != "undefined") {
			var personalDetails = req.body.personalDetails;
			// if (personalDetails.firstName != "" && typeof personalDetails.firstName != "undefined") {
			// 	const validateFirstName = await common.helpers.nameValidation(
			// 		personalDetails.firstName
			// 	);

			// 	if (validateFirstName == false) {
			// 		/**
			// 		 * FIRST NAME VALIDATION
			// 		 */

			// 		var successOrError = await common.responseServices.successOrErrors("err_43");
			// 		var resobj = await common.responseModel.resObj(
			// 			successOrError.code,
			// 			successOrError.message,
			// 			successOrError.parameters.firstName,
			// 			successOrError.location
			// 		);
			// 		return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			// 	}
			// }

			// if (personalDetails.lastName != "" && typeof personalDetails.lastName != "undefined") {
			// 	const validateLastName = await common.helpers.nameValidation(personalDetails.lastName);

			// 	if (validateLastName == false) {
			// 		/**
			// 		 * LAST NAME VALIDATION
			// 		 */

			// 		var successOrError = await common.responseServices.successOrErrors("err_44");
			// 		var resobj = await common.responseModel.resObj(
			// 			successOrError.code,
			// 			successOrError.message,
			// 			successOrError.parameters.lastName,
			// 			successOrError.location
			// 		);
			// 		return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			// 	}
			// }
			if (
				personalDetails.countryCode != "" &&
				typeof personalDetails.countryCode != "undefined"
			) {
				const validateCountryCode = await common.helpers.countryCodeValidation(
					personalDetails.countryCode
				);

				if (validateCountryCode == false) {
					/**
					 * COUNTRY CODE VALIDATION
					 */

					var successOrError = await common.responseServices.successOrErrors("err_40");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.countryCode,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
			}

			if (
				personalDetails.mobileNumber != "" &&
				typeof personalDetails.mobileNumber != "undefined"
			) {
				const validateMobileNumber = await common.helpers.checkPhone(
					personalDetails.mobileNumber
				);

				if (validateMobileNumber == false) {
					/**
					 * MOBILE NUMBER VALIDATION
					 */

					var successOrError = await common.responseServices.successOrErrors("err_119");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.mobileNumber,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				if (
					typeof personalDetails.countryCode == "undefined" ||
					personalDetails.countryCode == ""
				) {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.countryCode,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				var mobileExists = await usersCollection.findOne({
					where: {
						mobileNumber: personalDetails.mobileNumber,
						id: { [Op.ne]: userDetails.id },
						isDeleted: 0,
					},
				});
				if (mobileExists) {
					var successOrError = await common.responseServices.successOrErrors("err_41");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.mobileNumber,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				if (typeof personalDetails.code == "undefined" || personalDetails.code == "") {
					var successOrError = await common.responseServices.successOrErrors("err_155");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.noParams,
						successOrError.location
					);

					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				var verificationCheck = await common.sms.verifyOtp(
					personalDetails.countryCode,
					personalDetails.mobileNumber,
					personalDetails.code
				);
				if (verificationCheck.status != "approved") {
					var successOrError = await common.responseServices.successOrErrors("err_154");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.noParams,
						successOrError.location
					);

					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
			}
			if (personalDetails.dob != "" && typeof personalDetails.dob != "undefined") {
				const validateDob = await common.helpers.validatedate(personalDetails.dob);

				if (validateDob == false) {
					/**
					 * DATE OF BIRTH  VALIDATION
					 */

					var successOrError = await common.responseServices.successOrErrors("err_54");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.dob,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
			}

			if (
				personalDetails.changePassword != "" &&
				typeof personalDetails.changePassword != "undefined"
			) {
				const validatePass = await common.helpers.checkPassword(personalDetails.changePassword);

				if (validatePass == false) {
					var successOrError = await common.responseServices.successOrErrors("err_46");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.changePassword,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				if (
					personalDetails.retypePassword == "" ||
					typeof personalDetails.retypePassword == "undefined"
				) {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.retypePassword,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				const validateRetypePass = await common.helpers.checkPassword(
					personalDetails.retypePassword
				);

				if (validateRetypePass == false) {
					var successOrError = await common.responseServices.successOrErrors("err_46");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.retypePassword,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				if (personalDetails.changePassword != personalDetails.retypePassword) {
					var successOrError = await common.responseServices.successOrErrors("err_47");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.changePassword + " or retypePassword",
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
			}

			var personalObj = {
				firstName: personalDetails.firstName
					? personalDetails.firstName
					: userDetails.firstName,
				lastName: personalDetails.lastName ? personalDetails.lastName : userDetails.lastName,
				dob: personalDetails.dob
					? personalDetails.dob.split("-").reverse().join("-")
					: userDetails.dob,
				countryCode: personalDetails.countryCode,
				mobileNumber: personalDetails.mobileNumber
					? personalDetails.mobileNumber
					: userDetails.mobileNumber,
				password: personalDetails.changePassword
					? bcrypt.hashSync(personalDetails.changePassword, salt)
					: userDetails.password,
				address: personalDetails.address ? personalDetails.address : userDetails.address,
				city: personalDetails.city ? personalDetails.city : userDetails.city,
				country: personalDetails.country ? personalDetails.country : userDetails.country,
				linkedinId: personalDetails.linkedinId
					? personalDetails.linkedinId
					: userDetails.linkedinId,
				facebookLink: personalDetails.facebookLink
					? personalDetails.facebookLink
					: userDetails.facebookILink,
				description: personalDetails.description
					? personalDetails.description
					: userDetails.description,
				instagramId: personalDetails.instagramId
					? personalDetails.instagramId
					: userDetails.instagramId,
			};

			await usersCollection.update(personalObj, {
				where: { id: userDetails.id },
			});
		}

		if (typeof req.body.bankingDetails != "undefined") {
			var bankingDetails = req.body.bankingDetails;

			if (bankingDetails.accountName == "" || typeof bankingDetails.accountName == "undefined") {
				var successOrError = common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.accountName,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			var validatName = await common.helpers.validatName(bankingDetails.accountName);

			if (validatName == false) {
				var successOrError = await common.responseServices.successOrErrors("err_07");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.accountName,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			if (bankingDetails.accountNo == "" || typeof bankingDetails.accountNo == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.accountNo,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			var validateAccountNumber = await common.helpers.validateAccountNumber(
				bankingDetails.accountNo
			);
			if (validateAccountNumber == false) {
				var successOrError = await common.responseServices.successOrErrors("err_15");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.accountNo,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			// var accountNum = await common.query.findOne(bankCollection, {
			// 	where: {
			// 		[Op.and]: {
			// 			accountNo: bankingDetails.accountNo,
			// 			userId: { [Op.ne]: userDetails.id },
			// 		},
			// 	},
			// });

			// if (accountNum) {
			// 	var successOrError = await common.responseServices.successOrErrors("err_17");
			// 	var resobj = await common.responseModel.resObj(
			// 		successOrError.code,
			// 		successOrError.message,
			// 		successOrError.parameters.accountNo,
			// 		successOrError.location
			// 	);
			// 	return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			// }
			if (bankingDetails.bankName == "" || typeof bankingDetails.bankName == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.bankName,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			var validateBankName = await common.helpers.validatName(bankingDetails.bankName);

			if (validateBankName == false) {
				var successOrError = await common.responseServices.successOrErrors("err_07");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.bankName,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			if (
				bankingDetails.branchAddress == "" ||
				typeof bankingDetails.branchAddress == "undefined"
			) {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.branchAddress,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			if (bankingDetails.ibanNo == "" || typeof bankingDetails.ibanNo == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.ibanNo,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			var validateIBAN = await iban.isValid(bankingDetails.ibanNo);

			if (validateIBAN == false) {
				var successOrError = await common.responseServices.successOrErrors("err_08");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.ibanNo,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			// var ibanNumber = await common.query.findOne(bankCollection, {
			// 	where: {
			// 		ibanNo: bankingDetails.ibanNo,
			// 		userId: { [Op.ne]: userDetails.id },
			// 	},
			// });

			// if (ibanNumber) {
			// 	var successOrError = await common.responseServices.successOrErrors("err_18");
			// 	var resobj = await common.responseModel.resObj(
			// 		successOrError.code,
			// 		successOrError.message,
			// 		successOrError.parameters.ibanNo,
			// 		successOrError.location
			// 	);
			// 	return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			// }

			if (
				bankingDetails.typeofAccount == "" ||
				typeof bankingDetails.typeofAccount == "undefined"
			) {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.typeofAccount,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			var bankDetailObj = {
				accountName: bankingDetails.accountName,
				bankName: bankingDetails.bankName,
				accountNo: bankingDetails.accountNo,
				branchAddress: bankingDetails.branchAddress,
				ibanNo: bankingDetails.ibanNo,
				accountType: bankingDetails.typeofAccount,
				userId: userDetails.id,
			};

			var userBankDetails = await bankCollection.findOne({
				where: { userId: userDetails.id },
			});
			if (userBankDetails) {
				await bankCollection.update(bankDetailObj, {
					where: { userId: userDetails.id },
				});
			} else {
				await common.query.create(bankCollection, bankDetailObj);
			}

			var bankDetailsFlag = { bankDetailsFlag: 1 };
			if (
				userDetails.personalDetailsFlag == "1" &&
				userDetails.professionalFlag == "1" &&
				userDetails.therapiesFlag == "1" &&
				userDetails.certificationFlag == "1" &&
				userDetails.bankDetailsFlag == "1" &&
				userDetails.workDaysDetailsFlag == "1" &&
				(userDetails.isActive == "2" || userDetails.isActive == "4")
			) {
				bankDetailsFlag.isActive = "0";
				bankDetailsFlag.reason = "";
			}

			await usersCollection.update(bankDetailsFlag, {
				where: { id: userDetails.id },
			});
		}

		if (typeof req.body.professionalDetails != "undefined") {
			var professionaldetails = req.body.professionalDetails;
			var professionArr = [];

			for (let i = 0; i < professionaldetails.length; i++) {
				const element = professionaldetails[i];

				if (element.qualifications == "" || typeof element.qualifications == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.qualifications,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				var validateQualifications = await common.helpers.validatName(element.qualifications);

				if (validateQualifications == false) {
					var successOrError = await common.responseServices.successOrErrors("err_07");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.qualifications,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				if (element.university == "" || typeof element.university == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.university,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				var validateUniversity = await common.helpers.validatName(element.university);
				if (validateUniversity == false) {
					var successOrError = await common.responseServices.successOrErrors("err_07");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.university,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				if (element.specialization == "" || typeof element.specialization == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.specialization,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				var validateSpecialization = await common.helpers.validatName(element.specialization);
				if (validateSpecialization == false) {
					var successOrError = await common.responseServices.successOrErrors("err_07");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.specialization,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				if (element.workExperience == "" || typeof element.workExperience == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.workExperience,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				for (let j = 0; j < element.employmentHistory.length; j++) {
					const eleHistory = element.employmentHistory[j];

					if (
						eleHistory.employmentHistory == "" ||
						typeof eleHistory.employmentHistory == "undefined"
					) {
						var successOrError = await common.responseServices.successOrErrors("err_02");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.employmentHistory,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}
					if (eleHistory.noOfYears == "" || typeof eleHistory.noOfYears == "undefined") {
						var successOrError = await common.responseServices.successOrErrors("err_02");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.noOfYears,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}
				}

				professionArr.push(element);
			}

			if (professionArr.length != 0) {
				var empHistory = await professionCollection.findOne({
					where: { userId: userDetails.id },
				});

				if (empHistory) {
					await employmentHistory.destroy({
						where: { professionalId: empHistory.id },
					});
					await professionCollection.destroy({
						where: { userId: userDetails.id },
					});
				}

				for (let i = 0; i < professionArr.length; i++) {
					const element = professionArr[i];
					var obj = {
						qualifications: element.qualifications,
						university: element.university,
						specialization: element.specialization,
						workExperience: element.workExperience,
						userId: userDetails.id,
					};
					var proffessionData = await common.query.create(professionCollection, obj);

					if (element.employmentHistory.length != 0) {
						for (let j = 0; j < element.employmentHistory.length; j++) {
							const element2 = element.employmentHistory[j];

							var obj = {
								employmentHistory: element2.employmentHistory,
								noOfYears: element2.noOfYears,
								userId: userDetails.id,
								professionalId: proffessionData.id,
							};

							await common.query.create(employmentHistory, obj);
						}
					}
				}

				var professionalFlag = { professionalFlag: 1 };
				if (
					userDetails.personalDetailsFlag == "1" &&
					userDetails.professionalFlag == "1" &&
					userDetails.therapiesFlag == "1" &&
					userDetails.certificationFlag == "1" &&
					userDetails.bankDetailsFlag == "1" &&
					userDetails.workDaysDetailsFlag == "1" &&
					(userDetails.isActive == "2" || userDetails.isActive == "4")
				) {
					professionalFlag.isActive = "0";
					professionalFlag.reason = "";
				}

				await usersCollection.update(professionalFlag, {
					where: { id: userDetails.id },
				});
			}
		}

		var therapyObj = {
			isChat: req.body.isChat,
			isVoice: req.body.isVoice,
			isVideo: req.body.isVideo,
			chatSessionPrice: req.body.chatSessionPrice,
			voiceSessionPrice: req.body.voiceSessionPrice,
			videoSessionPrice: req.body.videoSessionPrice,
			isConsultNow: req.body.isConsultNow,
			chatConsultNowPrice: req.body.chatConsultNowPrice,
			voiceConsultNowPrice: req.body.voiceConsultNowPrice,
			videoConsultNowPrice: req.body.videoConsultNowPrice,
		};

		await usersCollection.update(therapyObj, { where: { id: userDetails.id } });

		if (typeof req.body.langaugeDetails != "undefined") {
			var languages = req.body.langaugeDetails;

			var language = await therapistLanguages.findOne({
				where: { userId: userDetails.id },
			});
			if (language) {
				await therapistLanguages.destroy({ where: { userId: userDetails.id } });
			}
			if (languages.length != 0) {
				for (let i = 0; i < languages.length; i++) {
					const element = languages[i];

					var languageObj = {
						languageName: element,
						userId: userDetails.id,
					};
					await therapistLanguages.create(languageObj);
				}
			}
		}

		if (typeof req.body.therapies != "undefined") {
			var therapies = req.body.therapies;
			var therapiArr = [];

			for (let k = 0; k < therapies.length; k++) {
				const element = therapies[k];
				var therapiId = await common.helpers.decryptData(element);
				var therapi = await therapyCollection.findOne({
					where: { id: therapiId },
				});
				if (!therapi) {
					var successOrError = await common.responseServices.successOrErrors("err_06");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.therapyId,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				therapiArr.push(therapi.id);
			}

			var therapiExists = await common.query.find(userTherapyCollection, {
				where: { userId: userDetails.id },
			});

			if (therapiExists) {
				await userTherapyCollection.destroy({
					where: { userId: userDetails.id },
				});
			}

			for (let j = 0; j < therapiArr.length; j++) {
				const element = therapiArr[j];
				var userTherapiObj = {
					therapiId: element,
					userId: userDetails.id,
				};
				await common.query.create(userTherapyCollection, userTherapiObj);
			}
			var therapieFlag = { therapiesFlag: 1 };
			if (
				userDetails.personalDetailsFlag == "1" &&
				userDetails.professionalFlag == "1" &&
				userDetails.therapiesFlag == "1" &&
				userDetails.certificationFlag == "1" &&
				userDetails.bankDetailsFlag == "1" &&
				userDetails.workDaysDetailsFlag == "1" &&
				(userDetails.isActive == "2" || userDetails.isActive == "4")
			) {
				therapieFlag.isActive = "0";
				therapieFlag.reason = "";
			}

			await usersCollection.update(therapieFlag, {
				where: { id: userDetails.id },
			});
		}

		var response = await common.response.users.singleUserObjectRes(decryptId);
		/**
		 * ERROR RESPONSE
		 */
		if (!response) {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(successOrError.update, response, {});
	} catch (error) {
		/**
		 * CATCH ERROR
		 */

		if (error.status == 404) {
			var successOrError = await common.responseServices.successOrErrors("err_156");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.noParams,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			var successOrError = await common.responseServices.successOrErrors("ex_00");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				error.message,
				successOrError.parameters.noParams,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
	}
};
