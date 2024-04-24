/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 * GET NOTES FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.getNotes = async (req) => {
	try {
		var queryParams = req.query;

		if (typeof queryParams.userId == "undefined" || queryParams.userId == "") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userId = await common.helpers.decryptData(queryParams.userId);

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

		var usersDetails = await common.query.findOne(usersCollection, {
			where: { id: userId, role: 1, isDeleted: 0 },
		});
		if (!usersDetails) {
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
			return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var limit = parseInt(queryParams.limit);
		var page = parseInt(queryParams.page);

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

		if (typeof queryParams.order != "undefined" && queryParams.order != "") {
			if (queryParams.order == "1") {
				var sort = "desc";
			} else if (queryParams.order == "0") {
				var sort = "asc";
			}
		} else {
			var sort = "asc";
		}

		var notesObj = await common.response.journals.getAlljournals(
			usersDetails.id,
			limitQuery,
			pageQuery,
			sort,
			queryParams.search
		);

		if (notesObj) {
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successGetResponse(
				successOrError.getNotes,
				notesObj.data,
				{},
				notesObj.pagination
			);
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_36");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.notesId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
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
