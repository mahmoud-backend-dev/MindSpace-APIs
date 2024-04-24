/**
 * NPM PACKAGE
 */
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 * CHANGE USER PASSWORD
 * @param {Object} req
 * @returns Object
 */
module.exports.changePassword = async (req) => {
	try {
		var decryptId = await common.helpers.decryptData(req.params.id);

		if (!decryptId) {
			/**
			 * INVALID USER ID
			 */
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
			where: { id: decryptId, isDeleted: 0 },
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
		} else {
			if (userDetails.isActive == false && userDetails.role == 0) {
				/**
				 * BLOCKED BY AN ADMIN
				 */
				var successOrError = await common.responseServices.successOrErrors("err_52");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.noParams,
					successOrError.location
				);
				var encryptId = await common.helpers.encryptData(userDetails.id);
				var usrObj = {
					id: encryptId,
				};
				return await common.responseModel.failResponse(successOrError.failMsg, usrObj, resobj);
			} else if (userDetails.isActive == false) {
				/**
				 * BLOCKED BY AN ADMIN
				 */
				var successOrError = await common.responseServices.successOrErrors("err_45");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.blockedByAdmin,
					successOrError.location
				);
				var encryptId = await common.helpers.encryptData(userDetails.id);
				var usrObj = {
					id: encryptId,
				};
				return await common.responseModel.failResponse(successOrError.failMsg, usrObj, resobj);
			}

			if (userDetails.loginType == 0) {
				if (req.body.currentPassword == "" || typeof req.body.currentPassword == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.currentPassword,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				var validateCurrentPassword = await common.helpers.checkPassword(
					req.body.currentPassword
				);
				if (validateCurrentPassword == false) {
					/**
					 * INVALID PASSWORD(Password should be 8 characters long, including at least one upper case, at least one lower case, at least one special character and at least one digit)
					 */

					var successOrError = await common.responseServices.successOrErrors("err_12");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.currentPassword,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				if (req.body.newPassword == "" || typeof req.body.newPassword == "undefined") {
					var successOrError = await common.responseServices.successOrErrors("err_02");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.newPassword,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				var comparePassword = await bcrypt.compare(
					req.body.currentPassword,
					userDetails.password
				);

				if (comparePassword == false) {
					var successOrError = await common.responseServices.successOrErrors("err_33");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.currentPassword,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				var newPassword = await bcrypt.compare(req.body.newPassword, userDetails.password);

				if (newPassword == true) {
					var successOrError = await common.responseServices.successOrErrors("err_89");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.currentPassword,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				var changePassword = await usersCollection.update(
					{
						password: bcrypt.hashSync(req.body.newPassword, salt),
					},
					{ where: { id: decryptId } }
				);
				if (changePassword != 1) {
					/**
					 * SOMETHING WENT WRONG WHILE UPDATING PASSWORD
					 */
					var successOrError = await common.responseServices.successOrErrors("err_30");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}
				/**
				 * SUCCESS RESPONSE
				 */
				var response = await common.response.users.singleUserObjectRes(decryptId);
				var successOrError = await common.responseServices.successOrErrors("successMessage");
				return await common.responseModel.successResponse(
					successOrError.updatePassword,
					response,
					{}
				);
			}
		}
	} catch (error) {
		/**
		 * CATCH ERROR
		 */
		var successOrError = await common.responseServices.successOrErrors("ex_00");
		var resobj = await common.responseModel.resObj(
			error.code,
			error.message,
			successOrError.parameters.noParams,
			successOrError.location
		);
		return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
	}
};
