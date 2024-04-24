/**
 *  NPM PACKAGES
 */

/**
 *  HELPERS
 */
var common = require("../common");
const commonEmail = require("../../services/mailService.js/adminTherapistUpdatePassword");
/**
 * BUCKECT
 */
const bucketName = process.env.AWS_BUCKETNAME;
const profileImage = process.env.AWS_UPLOAD_PATH_FOR_PROFILE;

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const userTherapyCollection = common.db.userTherapies;

/**
 * ADMIN CREATE DOCTOR
 * @param {Object} req
 * @returns Object
 */
module.exports.create = async (req) => {
	try {
		/**
		 * REQUIRE FIELD
		 * 0:Therapis
		 */

		/** FIRSR NAME */
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

		const validateFirstName = await common.helpers.nameValidation(req.body.firstName);

		if (validateFirstName == false) {
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
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** LAST NAME */
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

		const validateLastName = await common.helpers.nameValidation(req.body.lastName);

		if (validateLastName == false) {
			/**
			 * LAST NAME VALIDATION
			 */

			var successOrError = await common.responseServices.successOrErrors("err_44");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.lastName,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** GENDER VALIDATION */
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

		/** GENDER VALIDATION WILL BE 1 ,2 or3 */
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

		/** CATEGORY VALIDATION */
		if (req.body.therapies == "" || typeof req.body.therapies == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.addTherapies,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** MOBILE VALIDATION */
		if (req.body.mobileNumber == "" || typeof req.body.mobileNumber == "undefined") {
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
		}
		var usersDetails = await common.query.findOne(usersCollection, {
			where: {
				mobileNumber: req.body.mobileNumber,
				isDeleted: 0,
			},
		});

		if (usersDetails != null) {
			/**
			 * MOBILE NUMBER  OR EMAIL ALREADY EXITS
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

		/** EMAIL VALIDATION */
		if (req.body.email == "" || typeof req.body.email == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.email,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		/**
		 * EMAIL  VALIDATION
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

		if (usersDetails) {
			/**
			 *  EMAIL ALREADY EXITS
			 */

			var successOrError = await common.responseServices.successOrErrors("err_42");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.email,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** PROFILE PIC */
		var files = req.files;
		if (files && files.profileImage != "" && typeof files.profileImage != "undefined") {
			var validateProfileImage = await common.helpers.profileValidation(files.profileImage);
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
			var bucket = bucketName + "/" + profileImage;
			await common.helpers.uploadFileToS3(files.profileImage, validateProfileImage, bucket);
		}

		var addUserObject = {
			role: 0, // 0:Therapist , 1:Patient
			loginType: 0,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			nickName: req.body.nickName ? req.body.nickName : "",
			password: req.body.password ? req.body.password : "",
			email: req.body.email,
			gender: req.body.gender ? req.body.gender : "0",
			mobileNumber: req.body.mobileNumber,
			countryCode: req.body.countryCode,
			googleId: req.body.loginType == 1 ? req.body.googleId : "",
			appleId: req.body.loginType == 2 ? req.body.appleId : "",
			address: req.body.address ? req.body.address : "",
			status: 1, //0 : inactive , 1 : active , 2:banned , 3:pending",
			isProfileSet: 0,
			isActive: "2",
			isEmailVerified: 0,
			language: req.body.language ? req.body.language : "",
			civilId: req.body.civilId ? req.body.civilId : "",
			dob: req.body.dob ? req.body.dob.split("-").reverse().join("-") : null,
			city: req.body.city ? req.body.city : "",
			country: req.body.country ? req.body.country : "",
			linkedinId: req.body.linkedinId ? req.body.linkedinId : "",
			facebookId: req.body.loginType == 3 ? req.body.facebookId : "",
			facebookLink: req.body.facebookLink ? req.body.facebookLink : "",
			description: req.body.description ? req.body.description : "",
			personalDetailsFlag: 1,
			profileImage: validateProfileImage,
		};

		var usersDetails = await common.query.create(usersCollection, addUserObject);

		/** Conver to array */
		const therapiesArr = req.body.therapies.split(",").map(Number);

		for (let j = 0; j < therapiesArr.length; j++) {
			const element = therapiesArr[j];
			var userTherapiObj = {
				"therapiId": element,
				"userId": usersDetails.id,
			};
			await common.query.create(userTherapyCollection, userTherapiObj);
		}
		/** SEND MAIL  */

		var date = new Date();
		var milliseconds = date.getTime();

		const randomString = await common.helpers.randomString(30);

		var encryptedId = await common.helpers.encryptData(usersDetails.dataValues.id);
		var type = 2;
		var html = await commonEmail.sendEmail(encryptedId, milliseconds, randomString, type);
		var subject = "Your update password link.";
		await common.helpers.sendMail(html, subject, usersDetails.dataValues.email);

		//GET Creted  ID
		var TherapistId = { id: usersDetails.dataValues.id };
		// Update OBj
		var updateObj = {
			randomString: randomString,
		};

		// Update Admin RANDOMSTRING
		await common.query.update(usersCollection, TherapistId, updateObj);

		if (!usersDetails) {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var response = await common.response.admins.patientsObjectRes(usersDetails);

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
		return common.responseModel.successCreateResponse(successOrError.addDoctor, response, {});
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
