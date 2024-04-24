/**
 * HELPERS
 */
const { Op } = require("sequelize");
var common = require("../common");

/**
 * DATABASE
 */
const therapyCollection = common.db.therapies;

module.exports.getAll = async (req) => {
	try {
		var params = req.query;
		var search = "";
		var limit = parseInt(params.limit);
		var page = parseInt(params.page);

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

		params.search != "" && typeof params.search != "undefined"
			? (search = params.search)
			: (search = "");

		if (search) {
			whereCondition = {
				therapiName: { [Op.substring]: `%${search}%` },
			};
		} else {
			whereCondition = {};
		}

		var offset = (pageQuery - 1) * limitQuery;

		if (typeof params.order != "undefined" && params.order != "") {
			if (params.order == "1") {
				var sort = "desc";
			} else if (params.order == "0") {
				var sort = "asc";
			}
		} else {
			var sort = "asc";
		}

		var query = {};

		query.order = [["id", sort]];
		query.limit = limitQuery;
		query.offset = offset;
		query.where = whereCondition;

		var count = await common.query.count(therapyCollection, query);
		var therapiesData = await common.query.find(therapyCollection, query);

		if (therapiesData.length == 0 || count == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_16");
			return common.responseModel.successGetResponse(successOrError.message, [], {}, {});
		}
		var therapiArr = [];
		for (let i = 0; i < therapiesData.length; i++) {
			const element = therapiesData[i];
			var responseObj = await common.response.therapies.therapiesObjectRes(element);
			therapiArr.push(responseObj);
		}

		var pagination = await common.pagination(limitQuery, pageQuery, count);

		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successGetResponse(
			successOrError.getall,
			therapiArr,
			{},
			pagination
		);
	} catch (e) {
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
