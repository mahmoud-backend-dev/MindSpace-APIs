/**
 * NPM PACKAGE
 */

const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const commonEmail = require("../../services/mailService.js/adminUserUpdatePassword");
/**
 * HELPERS
 */
var common = require("../common");
const bucketName = process.env.AWS_BUCKETNAME;
const profileImage = process.env.AWS_UPLOAD_PATH_FOR_PROFILE;

/**
 * DATABASE
 */
const adminsCollection = common.db.admin;
const assignRoleResources = common.db.assignRoleResources;

/**
 *
 * REGISTER ADMIN
 * @param {OBJECT} req
 * @returns OBJECT
 */
async function create(req) {
	try {
		if (
			req.body.email == "" ||
			typeof req.body.email == "undefined" ||
			typeof req.body.email != "string"
		) {
			/**
			 * REQUIRE FIELD EMAIL
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.email,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			var emailValidation = await common.helpers.validateEmail(req.body.email);

			if (emailValidation == false) {
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
			} else {
				var adminEmailQuery = { where: { email: req.body.email } };
				var adminsDetails = await common.query.findOne(adminsCollection, adminEmailQuery);

				if (adminsDetails != null) {
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
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
			}
		}

		/**
		 *  PHONE  THEN CALL THIS CONDITION
		 */
		if (req.body.phone == "" || typeof req.body.phone == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.phone,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/**
		 * MOBILE NUMBER VALIDATION
		 */
		const validateMobileNumber = await common.helpers.checkPhone(req.body.phone);

		if (validateMobileNumber == false) {
			/**
			 * INVALID MOBILE NUMBER
			 */

			var successOrError = await common.responseServices.successOrErrors("err_14");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.phone,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			var adminPhoneQuery = { where: { phone: req.body.phone } };
			var adminsDetails = await common.query.findOne(adminsCollection, adminPhoneQuery);

			if (adminsDetails != null) {
				/**
				 * PHONE ALREADY EXITS
				 */

				var successOrError = await common.responseServices.successOrErrors("err_120");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.phone,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}

		var files = req.files;
		if (files && files.profile != "" && typeof files.profile != "undefined") {
			var validateProfileImage = await common.helpers.profileValidation(files.profile);

			if (validateProfileImage == false) {
				var successOrError = await common.responseServices.successOrErrors("err_29");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.profile,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			var bucket = bucketName + "/" + profileImage;

			await common.helpers.uploadFileToS3(files.profile, validateProfileImage, bucket);
		}

		if (req.body.fullName == "" || typeof req.body.fullName == "undefined") {
			/**
			 * IF ENTER FIRSTNAME THEN LASTNAME REQUIRE
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.fullName,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		} else {
			var validationfullName = await common.helpers.nameValidation(req.body.fullName);

			if (validationfullName == false) {
				/**
				 * FIRST NAME VALIDATION
				 */

				var successOrError = await common.responseServices.successOrErrors("err_43");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.fullName,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}

		var obj = {
			fullName: req.body.fullName ? req.body.fullName : "",
			email: req.body.email ? req.body.email : "",
			password: req.body.password ? bcrypt.hashSync(req.body.password, salt) : "",
			profile: req.files ? validateProfileImage : "",
			assignRole: req.body.assignRole ? req.body.assignRole : "0",
			phone: req.body.phone ? req.body.phone : "",
		};

		var adminsTotalList = await common.query.create(adminsCollection, obj);

		if (Object.keys(adminsTotalList.dataValues).length > 0) {
			let jwtSecretKey = process.env.SECRET_KEY;
			let data = {
				time: Date(),
				adminId: adminsTotalList.id,
			};

			const token = jwt.sign(data, jwtSecretKey);

			var assignResources = req.body.assignResources ? req.body.assignResources : [];

			for (let index = 0; index < assignResources.length; index++) {
				const element = assignResources[index];

				var decryptId = await common.helpers.decryptData(element.roleResourceId);

				const obj = {
					roleResourceId: decryptId,
					adminId: adminsTotalList.id,
					status: element.status,
				};
				await common.query.create(assignRoleResources, obj);
			}

			/** SEND MAIL  */

			const roleType = req.body.assignRole === 0 ? "supervisor" : "junior supervisor";

			var date = new Date();
			var milliseconds = date.getTime();

			const randomString = await common.helpers.randomString(30);

			var encryptedId = await common.helpers.encryptData(adminsTotalList.dataValues.id);
			var type = 0;

			var html = await commonEmail.sendEmail(
				encryptedId,
				milliseconds,
				randomString,
				roleType,
				type
			);
			var subject = "Your update password link.";
			await common.helpers.sendMail(html, subject, adminsTotalList.dataValues.email);

			//GET Creted  ID
			var adminUserId = { id: adminsTotalList.dataValues.id };
			// Update OBj
			var updateObj = {
				randomString: randomString,
			};

			// Update Admin RANDOMSTRING
			await common.query.update(adminsCollection, adminUserId, updateObj);

			/**
			 * SUCCESS RESPONSE
			 */
			var response = await common.response.admins.adminObjectRes(adminsTotalList, token);
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return common.responseModel.successCreateResponse(successOrError.register, response, {});
		} else {
			/**
			 * SOMETHING WENT WRONG WHILE REGISTER ADMIN
			 */

			var successOrError = await common.responseServices.successOrErrors("err_56");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.message, {}, resobj);
		}
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
}

module.exports = {
	create,
};
