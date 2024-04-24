/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 * GET ALL APPOINTMENT BY USER ID FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.getAllAppointmentById = async (req) => {
	try {
		var queryParams = req.params;
		var params = req.query;

		var userId = await common.helpers.decryptData(queryParams.id);

		if (!userId) {
			var successOrError = await common.responseServices.successOrErrors("err_32");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userData = await usersCollection.findOne({ where: { id: userId, isDeleted: 0 } });

		if (!userData) {
			var successOrError = await common.responseServices.successOrErrors("err_76");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var limit = parseInt(req.query.limit);
		var page = parseInt(req.query.page);

		if (page && page > 0) {
			var pageQuery = parseInt(page);
		} else {
			var pageQuery = 1;
		}

		if (limit && limit > 0) {
			var limitQuery = parseInt(limit);
		} else {
			var limitQuery = 10;
		}

		if (params.status != "" && typeof params.status != "undefined") {
			if (
				params.status != 0 &&
				params.status != 1 &&
				params.status != 2 &&
				params.status != 3 &&
				params.status != 4
			) {
				var status = "0";
			} else {
				var status = params.status;
			}
		} else {
			var status = "0";
		}

		if (typeof queryParams.order != "undefined" && queryParams.order != "") {
			if (queryParams.order == "1") {
				var sort = "desc";
			} else if (queryParams.order == "0") {
				var sort = "asc";
			}
		} else {
			var sort = "asc";
		}

		var responseObj = await common.response.appointment.getAllAppointmentRes(
			userId,
			limitQuery,
			pageQuery,
			sort,
			status,
			userData.role
		);

		if (!responseObj) {
			/**
			 * NOTE NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_78");

			return common.responseModel.successGetResponse(successOrError.message, [], {});
		}

		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return await common.responseModel.successGetResponse(
			successOrError.appointments,
			responseObj.data,
			{},
			responseObj.pagination
		);
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
