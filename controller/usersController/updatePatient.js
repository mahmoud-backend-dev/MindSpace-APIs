/**
 * HELPERS
 */

var common = require("../common");
/**
 * BUCKECT
 */
const bucketName = process.env.AWS_BUCKETNAME;
const profileImageUrl = process.env.AWS_UPLOAD_PATH_FOR_PROFILE;
/**
 * DATABASE
 */
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const usersCollection = common.db.users;

/**
 * UPDATE PATIENT FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.updatePatient = async (req) => {
	try {
		const id = req.params.id;
		var decryptId = await common.helpers.decryptData(id);

		if (!decryptId) {
			var successOrError = await common.responseServices.successOrErrors("err_32");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userDetails = await common.query.findOne(usersCollection, {
			where: { id: decryptId, role: 1, isDeleted: 0 },
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
		if (req.body.countryCode != "" && typeof req.body.countryCode != "undefined") {
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
			if (typeof req.body.countryCode == "undefined" || req.body.countryCode == "") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.countryCode,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			var usersDetails = await usersCollection.findOne({
				where: {
					mobileNumber: req.body.mobileNumber,
					id: { [Op.ne]: userDetails.id },
					isDeleted: 0,
				},
			});

			if (usersDetails) {
				/**
				 * MOBILE NUMBER EXITS
				 */

				var successOrError = await common.responseServices.successOrErrors("err_41");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.mobileNumber,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

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

			var verificationCheck = await common.sms.verifyOtp(
				req.body.countryCode,
				req.body.mobileNumber,
				req.body.code
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
		if (req.body.eCountryCode != "" && typeof req.body.eCountryCode != "undefined") {
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
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}
		if (req.body.emergencyNumber != "" && typeof req.body.emergencyNumber != "undefined") {
			/**
			 * MOBILE NUMBER VALIDATION
			 */
			const validateMobileNumber = await common.helpers.checkPhone(req.body.emergencyNumber);

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
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			// var usersDetails = await usersCollection.findOne({
			// 	where: {
			// 		emergencyNumber: req.body.emergencyNumber,
			// 		id: { [Op.ne]: userDetails.id },
			// 		isDeleted: 0,
			// 	},
			// });

			// if (usersDetails) {
			// 	/**
			// 	 * MOBILE NUMBER EXITS
			// 	 */

			// 	var successOrError = await common.responseServices.successOrErrors("err_41");
			// 	var resobj = await common.responseModel.resObj(
			// 		successOrError.code,
			// 		successOrError.message,
			// 		successOrError.parameters.emergencyNumber,
			// 		successOrError.location
			// 	);
			// 	return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			// }
		}

		var files = req.files;
		if (files && files.profileImage != "" && typeof files.profileImage != "undefined") {
			var validateProfileImage = await common.helpers.profileValidation(files.profileImage);

			// INVALID FILE
			if (validateProfileImage == false) {
				var successOrError = await common.responseServices.successOrErrors("err_29");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.profileImage,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			// UPLOAD FILE ON BUCKECT
			var bucket = bucketName + "/" + profileImageUrl;
			await common.helpers.uploadFileToS3(files.profileImage, validateProfileImage, bucket);

			var fileExists = await usersCollection.findOne({
				where: { id: userDetails.id, isDeleted: 0 },
			});

			if (fileExists) {
				if (fileExists.profileImage != "") {
					await common.helpers.deleteFileFromS3(fileExists.profileImage, bucket);
				}
			}
		}

		var personalDetailsObj = {
			firstName: req.body.firstName ? req.body.firstName : userDetails.firstName,
			lastName: req.body.lastName ? req.body.lastName : userDetails.lastName,
			nickName: req.body.nickName ? req.body.nickName : userDetails.nickName,
			mobileNumber: req.body.mobileNumber ? req.body.mobileNumber : userDetails.mobileNumber,
			eCountryCode: req.body.eCountryCode ? req.body.eCountryCode : "",
			emergencyNumber: req.body.emergencyNumber ? req.body.emergencyNumber : "",
			countryCode: req.body.countryCode ? req.body.countryCode : userDetails.countryCode,
			profileImage:
				files && files.profileImage ? validateProfileImage : userDetails.profileImage,
		};

		await usersCollection.update(personalDetailsObj, { where: { id: userDetails.id } });
		var response = await common.response.users.singleUserObjectRes(userDetails.id);

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
		 * SUCCESS
		 */

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(successOrError.updatePatient, response, {});
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
