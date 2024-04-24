/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 * BLOCK UNBLOCK USER FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.blockUnblockUser = async (req) => {
	try {
		var errorArray = [];
		var errorFlag = 0;
		if (req.params.id != "" && typeof req.params.id != "undefined") {
			var decryptId = await common.helpers.decryptData(req.params.id);

			if (decryptId != false) {
				var usersDetails = await common.query.findOne(usersCollection, {
					where: { id: decryptId, isDeleted: 0 },
				});

				if (usersDetails == null) {
					/**
					 * USER NOT FOUND
					 */
					errorFlag = 1;
					var successOrError = common.responseServices.successOrErrors("err_19");
					var resobj = common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.userId,
						successOrError.location
					);
					errorArray.push(resobj);
				} else {
					if (req.body.action == "" || typeof req.body.action == "undefined") {
						/**
						 * USER NOT FOUND
						 */
						errorFlag = 1;
						var successOrError = common.responseServices.successOrErrors("err_02");
						var resobj = common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.action,
							successOrError.location
						);
						errorArray.push(resobj);
					} else {
						if (req.body.action == 0 || req.body.action == 1) {
							await common.query.update(
								usersCollection,
								{ id: decryptId },
								{ isBlock: req.body.action }
							);
						} else {
							/**
							 * INVALID USER ID
							 */
							errorFlag = 1;
							var successOrError = common.responseServices.successOrErrors("err_88");
							var resobj = common.responseModel.resObj(
								successOrError.code,
								successOrError.message,
								successOrError.parameters.action,
								successOrError.location
							);
							errorArray.push(resobj);
						}
					}
				}
			} else {
				/**
				 * INVALID USER ID
				 */
				errorFlag = 1;
				var successOrError = common.responseServices.successOrErrors("err_32");
				var resobj = common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.userId,
					successOrError.location
				);
				errorArray.push(resobj);
			}
		} else {
			/**
			 * INVALID USER ID
			 */
			errorFlag = 1;
			var successOrError = common.responseServices.successOrErrors("err_32");
			var resobj = common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			errorArray.push(resobj);
		}
		if (errorArray.length >= 0 && errorFlag == 1) {
			return common.responseModel.failResponse("Errors", {}, errorArray);
		} else {
			var successOrError = common.responseServices.successOrErrors("successMessage");
			if (req.body.action == 0) {
				var responseMessage = successOrError.unblock;
			} else if (req.body.action == 1) {
				var responseMessage = successOrError.block;
			}
			/**
             * SUCCESS RESPONSE
            //  */

			return common.responseModel.successResponse(responseMessage, {}, []);
		}
	} catch (error) {
		/**
		 * CATCH ERROR
		 */
		var successOrError = common.responseServices.successOrErrors("ex_00");
		var resobj = common.responseModel.resObj(
			successOrError.code,
			error.message,
			successOrError.parameters.noParams,
			successOrError.location
		);
		var array = [];
		array.push(resobj);
		return common.responseModel.failResponse(successOrError.failMsg, {}, array);
	}
};
