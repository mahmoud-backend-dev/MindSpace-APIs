/**
 * HELPERS
 */
var common = require("../common");

/**
 * SEND OTP FUNCTION
 * @param {Object} req
 * @returns {Object}
 */
module.exports.sendOtp = async (req) => {
	try {
		await common.sms.sendOtp(req.body.countryCode, req.body.phone, req.body.email);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return common.responseModel.successCreateResponse(successOrError.otp, {}, {});
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
