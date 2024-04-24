/**
 * HELPERS
 */
const { Op } = require("sequelize");
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 * FIND BY USER EMAIL,GOOGLEID APPLEID FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.userExists = async (req) => {
	try {
		var params = req.query;
		const query = [];
		if (
			params.mobileNumber != "" &&
			typeof params.mobileNumber != "undefined" &&
			params.countryCode != "" &&
			typeof params.countryCode != "undefined"
		) {
			const validateCountryCode = await common.helpers.countryCodeValidation(params.countryCode);

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

			/**
			 * MOBILE NUMBER VALIDATION
			 */
			const validateMobileNumber = await common.helpers.checkPhone(params.mobileNumber);

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

			query.push({
				countryCode: params.countryCode,
				mobileNumber: params.mobileNumber,
			});
		}

		if (params.email != "" && typeof params.email != "undefined") {
			var validateEmail = await common.helpers.validateEmail(params.email);

			if (validateEmail == false) {
				var successOrError = await common.responseServices.successOrErrors("err_03");
				var resobj = await common.responseModel.resObj(
					successOrError.message,
					successOrError.parameters.email,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			query.push({ email: params.email });
		}

		var usersDetails = await usersCollection.findOne({
			where: { [Op.or]: query, isDeleted: 0 },
		});

		if (usersDetails) {
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successResponse(successOrError.get, {}, {});
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_76");
			return await common.responseModel.failResponse(successOrError.failMsg, {}, {});
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
};
