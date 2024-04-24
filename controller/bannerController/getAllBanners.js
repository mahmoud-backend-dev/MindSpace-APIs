/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const bannersCollections = common.db.banners;

/**
 * GET ALL REVIEWS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.getAllBanners = async (req) => {
	try {
		var queryParams = req.query;
		var condition = {};

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

		var offset = limitQuery * (pageQuery - 1);

		var count = await bannersCollections.count(condition);
		condition.limit = limitQuery;
		condition.offset = offset;
		condition.order = [["updatedAt", sort]];

		var bannersdata = await bannersCollections.findAll(condition);
		if (bannersdata.length == 0 || count == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_86");
			return await common.responseModel.successResponse(successOrError.message, [], {});
		}
		var resArr = [];
		for (let i = 0; i < bannersdata.length; i++) {
			const element = bannersdata[i];
			var resObj = await common.response.banners.bannerObjectRes(element.id);
			resArr.push(resObj);
		}
		var paginations = await common.pagination(limitQuery, pageQuery, count);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successGetResponse(
			successOrError.banners,
			resArr,
			{},
			paginations
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
