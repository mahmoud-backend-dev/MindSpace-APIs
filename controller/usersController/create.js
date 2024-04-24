/**
 *  NPM PACKAGES
 */
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

const moment = require("moment");

/**
 *  HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const { Op } = common.Sequelize;

/**
 * [ ]
 * REGISTER USER FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.create = async (req) => {
	try {
		if (typeof req.body.code == "undefined" || req.body.code == "") {
			var successOrError = await common.responseServices.successOrErrors("err_155");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.noParams,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		var validOTP = await common.sms.verifyOtp(
			req.body.countryCode,
			req.body.mobileNumber,
			req.body.code
		);

		if (!validOTP) {
			var successOrError = await common.responseServices.successOrErrors("err_154");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.noParams,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/**
		 * REQUIRE FIELD
		 * 0:Therapist , 1:Patient
		 */

		if (typeof req.body.role == "undefined") {
			/**
			 * INVALID DETAILS
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.role,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (req.body.role != 0 && req.body.role != 1) {
			var successOrError = await common.responseServices.successOrErrors("err_74");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.role,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (typeof req.body.loginType == "undefined") {
			/**
			 * INVALID DETAILS
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.loginType,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (typeof req.body.deviceType == "undefined" || req.body.deviceType == "") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.deviceType,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (req.body.deviceType != "A" && req.body.deviceType != "I") {
			/**
			 * INVALID DEVICE TYPE
			 */
			var successOrError = await common.responseServices.successOrErrors("err_35");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.deviceType,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (typeof req.body.deviceToken == "undefined" || req.body.deviceToken == "") {
			/**
			 * REQUIRED  DEVICE TOKEN
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.deviceToken,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (req.body.deviceType == "I") {
			if (typeof req.body.voIpToken == "undefined" || req.body.voIpToken == "") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.voIpToken,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}

		if (
			req.body.loginType != 0 &&
			req.body.loginType != 1 &&
			req.body.loginType != 2 &&
			req.body.loginType != 3
		) {
			var successOrError = await common.responseServices.successOrErrors("err_31");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.loginType,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		// if (req.body.firstName != "" && typeof req.body.firstName != "undefined") {
		// 	const validateFirstName = await common.helpers.nameValidation(req.body.firstName);

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

		// if (req.body.lastName != "" && typeof req.body.lastName != "undefined") {
		// 	const validateLastName = await common.helpers.nameValidation(req.body.lastName);

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

		if (req.body.gender == "" || typeof req.body.gender == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.gender,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (req.body.gender != 1 && req.body.gender != 2 && req.body.gender != 3) {
			var successOrError = await common.responseServices.successOrErrors("err_58");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.gender,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (req.body.loginType == 0) {
			if (req.body.email == "" || typeof req.body.email == "undefined") {
				/**
				 * REQUIRED FIELD : EMAIL
				 */
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.email,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			if (req.body.countryCode == "" || typeof req.body.countryCode == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.countryCode,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			if (req.body.timezone == "" || typeof req.body.timezone == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.timezone,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			/** Check Given Time zone is valid or not */
			const validateTimeZone = common.helpers.isValidTimezone(req.body.timezone);

			if (validateTimeZone == false) {
				/**
				 * INVALID TIME ZONE
				 */

				var successOrError = await common.responseServices.successOrErrors("err_145");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.timezone,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			/**
			 * COUNTRY CODE VALIDATION
			 */
			const validateCountryCode = await common.helpers.countryCodeValidation(
				req.body.countryCode
			);
			if (validateCountryCode == false) {
				/**
				 * INVALID COUNTRY CODE
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
			if (req.body.mobileNumber == "" || typeof req.body.mobileNumber == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.mobileNumber,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			if (req.body.role == 0) {
				if (req.body.firstName == "" || typeof req.body.firstName == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.firstName,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				if (req.body.lastName == "" || typeof req.body.lastName == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.lastName,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				if (req.body.address == "" || typeof req.body.address == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.address,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				if (req.body.dob == "" || typeof req.body.dob == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.dob,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				var validateBirthdate = moment(req.body.dob, "DD-MM-YYYY", true).isValid();
				if (validateBirthdate == false) {
					var successOrError = await common.responseServices.successOrErrors("err_54");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.dob,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				if (req.body.city == "" || typeof req.body.city == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.city,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				if (req.body.country == "" || typeof req.body.country == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.country,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
			} else if (req.body.role == 1) {
				if (req.body.nickName == "" || typeof req.body.nickName == "") {
					if (
						req.body.firstName == "" ||
						(typeof req.body.firstName == "undefined" && req.body.lastName == "") ||
						typeof req.body.lastName == "undefined"
					) {
						var successOrError = await common.responseServices.successOrErrors("err_64");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							"",
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}
				}
				if (req.body.eCountryCode != "" && typeof req.body.eCountryCode != "undefined") {
					/**
					 * COUNTRY CODE VALIDATION
					 */
					const validateCountryCode = await common.helpers.countryCodeValidation(
						req.body.eCountryCode
					);
					if (validateCountryCode == false) {
						/**
						 * INVALID COUNTRY CODE
						 */

						var successOrError = await common.responseServices.successOrErrors("err_40");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.eCountryCode,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}
				}

				if (req.body.emergencyNumber != "" && typeof req.body.emergencyNumber != "undefined") {
					if (req.body.eCountryCode == "" || typeof req.body.eCountryCode == "undefined") {
						var successOrError = await common.responseServices.successOrErrors("err_40");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.eCountryCode,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}

					/**
					 * MOBILE NUMBER VALIDATION
					 */
					const validateMobileNumber = await common.helpers.checkPhone(
						req.body.emergencyNumber
					);

					if (validateMobileNumber == false) {
						/**
						 * INVALID MOBILE NUMBER
						 */

						var successOrError = await common.responseServices.successOrErrors("err_14");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.emergencyNumber,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}
					// const emergencyNumberExists = await usersCollection.findOne({
					// 	where: {
					// 		//[Op.or]: [
					// 		//	{ emergencyNumber: req.body.emergencyNumber },
					// 		mobileNumber: req.body.emergencyNumber,
					// 		//],
					// 		isDeleted: 0,
					// 	},
					// });

					// if (emergencyNumberExists != null) {
					// 	/**
					// 	 * EMERGENCY NUMBER ALREADY EXITS
					// 	 */

					// 	var successOrError = await common.responseServices.successOrErrors("err_05");
					// 	var resobj = await common.responseModel.resObj(
					// 		successOrError.code,
					// 		successOrError.message,
					// 		successOrError.parameters.emergencyNumber,
					// 		successOrError.location
					// 	);
					// 	return await common.responseModel.failResponse(
					// 		successOrError.failMsg,
					// 		{},
					// 		resobj
					// 	);
					// }
				}
			}

			if (req.body.password == "" || typeof req.body.password == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.password,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			/**
			 * PASSWORD VALIDATION
			 */

			if (req.body.confirmPassword == "" || typeof req.body.confirmPassword == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.confirmPassword,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			/**
			 *  CONFIRM PASSWORD VALIDATION
			 */

			if (req.body.password != req.body.confirmPassword) {
				/**
				 * CONFIRM PASSWORD OR PASSWORD NOT MATCH
				 */

				var successOrError = await common.responseServices.successOrErrors("err_13");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.confirmPassword,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			var password = bcrypt.hashSync(req.body.password, salt);
		} else if (req.body.loginType == 1) {
			if (req.body.googleId == "" || typeof req.body.googleId == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.googleId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		} else if (req.body.loginType == 2) {
			if (req.body.appleId == "" || typeof req.body.appleId == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.appleId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		} else if (req.body.loginType == 3) {
			if (req.body.facebookId == "" || typeof req.body.facebookId == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.facebookId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}

		if (req.body.mobileNumber != "" && typeof req.body.mobileNumber != "undefined") {
			/**
			 * MOBILE NUMBER VALIDATION
			 */
			const validateMobileNumber = await common.helpers.checkPhone(req.body.mobileNumber);

			if (validateMobileNumber == false) {
				/**
				 * INVALID MOBILE NUMBER
				 */

				var successOrError = await common.responseServices.successOrErrors("err_14");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.mobileNumber,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			var usersDetails = await common.query.findOne(usersCollection, {
				where: {
					mobileNumber: req.body.mobileNumber,
					isDeleted: 0,
				},
			});

			//if (usersDetails != null) {
			/**
			 * MOBILE NUMBER  OR EMERGENCY MOBILE NUMBER ALREADY EXITS
			 */

			if (usersDetails) {
				var successOrError = await common.responseServices.successOrErrors("err_41");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.mobileNumber,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}
		//}

		if (req.body.email != "" && typeof req.body.email != "undefined") {
			/**
			 * MOBILE NUMBER VALIDATION
			 */
			const validateEmail = await common.helpers.validateEmail(req.body.email);

			if (validateEmail == false) {
				/**
				 * INVALID EMAIL
				 */

				var successOrError = await common.responseServices.successOrErrors("err_03");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.email,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			var usersDetails = await common.query.findOne(usersCollection, {
				where: {
					email: req.body.email,
					isDeleted: 0,
				},
			});

			if (usersDetails != null) {
				/**
				 *  EMAIL ALREADY EXITS
				 */

				if (usersDetails.isDeleted == 1) {
					await usersCollection.update(
						{ email: "", firstName: "", lastName: "", nickName: "" },
						{ where: { id: usersDetails.id } }
					);
				} else {
					var successOrError = await common.responseServices.successOrErrors("err_42");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.email,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
			}
		}

		var addUserObject = {
			role: req.body.role, // 0:Therapist , 1:Patient
			loginType: req.body.loginType,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			nickName: req.body.nickName ? req.body.nickName : "",
			password: password ? password : "",
			email: req.body.email,
			gender: req.body.gender ? req.body.gender : "0",
			mobileNumber: req.body.mobileNumber,
			countryCode: req.body.countryCode,
			eCountryCode: req.body.eCountryCode,
			emergencyNumber: req.body.emergencyNumber,
			googleId: req.body.loginType == 1 ? req.body.googleId : "",
			appleId: req.body.loginType == 2 ? req.body.appleId : "",
			address: req.body.address ? req.body.address : "",
			status: req.body.role == 0 ? 3 : 1, //0 : inactive , 1 : active , 2:banned , 3:pending",
			isProfileSet: req.body.role == 0 ? 0 : 1,
			isActive: req.body.role == 0 ? "4" : "1",
			isEmailVerified: req.body.role == 1 ? 1 : 0,
			civilId: req.body.civilId ? req.body.civilId : "",
			dob: req.body.dob ? req.body.dob.split("-").reverse().join("-") : null,
			city: req.body.city ? req.body.city : "",
			country: req.body.country ? req.body.country : "",
			deviceType: req.body.deviceType ? req.body.deviceType : "",
			deviceToken: req.body.deviceToken ? req.body.deviceToken : "",
			deviceId: req.body.deviceId ? req.body.deviceId : "",
			timezone: req.body.timezone ? req.body.timezone : "",
			voIpToken: req.body.voIpToken ? req.body.voIpToken : "",
			linkedinId: req.body.linkedinId ? req.body.linkedinId : "",
			facebookId: req.body.loginType == 3 ? req.body.facebookId : "",
			facebookLink: req.body.facebookLink ? req.body.facebookLink : "",
			description: req.body.description ? req.body.description : "",
			personalDetailsFlag: 1,
			instagramId: req.body.instagramId ? req.body.instagramId : "",
		};

		var usersDetails = await common.query.create(usersCollection, addUserObject);

		if (!usersDetails) {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		const token = jwt.sign(
			{ userId: usersDetails.id, deviceId: usersDetails.deviceId },
			process.env.SECRET_KEY
		);

		var response = await common.response.users.singleUserObjectRes(usersDetails.id, token);
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
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successCreateResponse(
			successOrError.register,
			response,
			{}
		);
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
