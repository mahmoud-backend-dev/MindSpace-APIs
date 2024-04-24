/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const Sequelize = common.db.Sequelize;
/**
 * GET ALL CITY OF THERAPISTS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.getAllCity = async (req) => {
	try {
		var params = req.query;

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
		query.where = {
			role: 0, isDeleted: 0
		};

		query.attributes = [Sequelize.fn("DISTINCT", Sequelize.col("city")), "city"];

		var count = await common.query.find(usersCollection, query);

		query.order = [["id", sort]];
		query.limit = limitQuery;
		query.offset = offset;
		var cityData = await common.query.find(usersCollection, query);

		if (cityData.length == 0 || count.length == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_133");
			return common.responseModel.successGetResponse(successOrError.message, [], {});
		}
		var cityArr = [];
		for (let i = 0; i < cityData.length; i++) {
			const element = cityData[i];
			cityArr.push(element.city);
		}

		var pagination = await common.pagination(limitQuery, pageQuery, count.length);

		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return common.responseModel.successGetResponse(
			successOrError.getallCity,
			cityArr,
			{},
			pagination
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
