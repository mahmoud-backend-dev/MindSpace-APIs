/**
 * HELPERS
 */
var common = require("../common");

const Op = common.Sequelize.Op;
/**
 * DATABASE
 */

const languageCollection = common.db.language;

/**
 * TO ADD AND REMOVE FAVORITE
 * @param {Object} req
 * @returns Object
 */
module.exports.LanguagesList = async (req) => {
	try {
		var query = req.query;
		let whereCondition;

		query.page != "" && typeof query.page != "undefined"
			? (page = parseInt(query.page))
			: (page = 1);

		query.limit != "" && typeof query.limit != "undefined"
			? (limit = parseInt(query.limit))
			: (limit = 10);
		query.search != "" && typeof query.search != "undefined"
			? (search = query.search)
			: (search = "");

		if (search) {
			whereCondition = {
				[Op.or]: [{ languageName: { [Op.like]: `%${search}%` } }],
			};
		} else {
			whereCondition = {};
		}

		var languagesDataCount = await common.query.count(languageCollection, {
			where: whereCondition,
		});
		var offset = (page - 1) * limit;
		var languagesData = await common.query.find(languageCollection, {
			where: whereCondition,
			order: [["createdAt", "DESC"]],
			limit: limit,
			offset: offset,
		});

		if (languagesData.length == 0 || languagesDataCount == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_129");
			return common.responseModel.successGetResponse(successOrError.failMsg, [], {});
		}
		var dataArray = [];

		for (let i = 0; i < languagesData.length; i++) {
			var response = await common.response.languages.languageObject(languagesData[i]);

			dataArray.push(response);
		}
		var pagination = await common.pagination(limit, page, languagesDataCount);

		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return common.responseModel.successGetResponse(
			successOrError.languages,
			dataArray,
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
