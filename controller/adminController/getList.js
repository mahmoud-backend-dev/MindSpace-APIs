/**
 * HELPERS
 */
var common = require("../common");

const Op = common.Sequelize.Op;
/**
 * DATABASE
 */
const adminCollection = common.db.admin;

/**
 * GET ADMINS LIST
 * @param {Object} req
 * @returns Object
 */
module.exports.list = async (req) => {
	try {
		var query = req.query;
		let whereCondition = {};

		query.page != "" && typeof query.page != "undefined"
			? (page = parseInt(query.page))
			: (page = 1);

		query.limit != "" && typeof query.limit != "undefined"
			? (limit = parseInt(query.limit))
			: (limit = 10);

		query.search != "" && typeof query.search != "undefined"
			? (search = query.search)
			: (search = "");

		query.orderField != "" && typeof query.orderField != "undefined"
			? (orderField = query.orderField)
			: (orderField = "createdAt");

		query.orderBy != "" && typeof query.orderBy != "undefined"
			? (orderBy = query.orderBy)
			: (orderBy = "DESC");

		if (search) {
			whereCondition = {
				[Op.or]: [
					{ fullName: { [Op.substring]: `%${search}%` } },
					{ email: { [Op.substring]: `%${search}%` } },
					{ phone: { [Op.substring]: `%${search}%` } },
					{ assignRole: { [Op.substring]: `%${search}%` } },
				],
			};
		}
		var offset = (page - 1) * limit;
		var adminDataCount = await common.query.count(adminCollection, {
			where: whereCondition,
		});
		var adminData = await common.query.find(adminCollection, {
			where: whereCondition,
			limit: limit,
			offset: offset,
		});

		if (adminData.length == 0 || adminDataCount == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_125");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.noParams,
				successOrError.location
			);
			return common.responseModel.successGetResponse(successOrError.failMsg, [], resobj);
		}
		var dataArray = [];

		for (let i = 0; i < adminData.length; i++) {
			var response = await common.response.admins.adminObjectRes(adminData[i]);

			dataArray.push(response);
		}
		var pagination = await common.pagination(limit, page, adminDataCount);
		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return common.responseModel.successGetResponse(
			successOrError.adminGetAll,
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
