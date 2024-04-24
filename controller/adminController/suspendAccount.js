/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const doctorsCollection = common.db.users;

/**
 *
 * SUSPEND DOCTORS ACCOUNT FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.suspendAccount = async (req) => {
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
				var adminId = { id: decryptId };
				var doctorsObject = {};

				var token = doctorsDetails.deviceToken;

				if (doctorsDetails != null) {
					/**
					 *  isSUSPEND  THEN CALL THIS CONDITION
					 */
					if (req.body.isSuspend == "" || typeof req.body.isSuspend == "undefined") {
						var successOrError = await common.responseServices.successOrErrors("err_121");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.isSuspend,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}

					/**
					 *UPDATE isSuspend THEN CALL THIS CONDITION (Boolaen 0 Or 1)
					 */

					if (req.body.isSuspend != 0 && req.body.isSuspend != 1) {
						/**
						 * isSuspend  VALIDATION
						 */
						errorFlag = 1;
						var successOrError = await common.responseServices.successOrErrors("err_121");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.isSuspend,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					} else {
						doctorsObject.isSuspend = parseInt(req.body.isSuspend);
					}

					if (req.body.suspendReason == "" || typeof req.body.suspendReason == "undefined") {
						/**
						 *  SuspendReason  THEN CALL THIS CONDITION
						 */

						var successOrError = await common.responseServices.successOrErrors("err_122");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.suspendReason,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					} else {
						doctorsObject.suspendReason = req.body.suspendReason;
					}

					/**
					 *  SuspendSubject  THEN CALL THIS CONDITION
					 */

					if (req.body.suspendSubject == "" || typeof req.body.suspendSubject == "undefined") {
						var successOrError = await common.responseServices.successOrErrors("err_123");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.suspendSubject,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					} else {
						doctorsObject.suspendSubject = req.body.suspendSubject;
					}

					if (req.body.isSuspend == 1) {
						doctorsObject.deviceToken = "";
						doctorsObject.deviceId = "";
						doctorsObject.voIpToken = "";
					}

					var update = await common.query.update(doctorsCollection, adminId, doctorsObject);

					if (update == 0) {
						/**
						 * SOMETHING WENT WRONG WHILE UPDATE ADMIN
						 */

						var successOrError = await common.responseServices.successOrErrors("err_30");
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
					var successOrError = await common.responseServices.successOrErrors("err_57");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.adminId,
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
					successOrError.parameters.adminId,
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
				successOrError.parameters.adminId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/**
		 * SUCCESS RESPONSE
		 */

		if (req.body.isSuspend == "1") {
			if (token != "") {
				let key = "autoLogout";
				await common.notification.sendSingleFirebaseNotification(token, "", "", key);
			}
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successResponse(successOrError.suspend, {}, {});
		} else {
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successResponse(successOrError.unSuspend, {}, {});
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
		var array = [];
		array.push(resobj);
		return await common.responseModel.failResponse(successOrError.failMsg, {}, array);
	}
};
