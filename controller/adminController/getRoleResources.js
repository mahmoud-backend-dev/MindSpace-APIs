/**
 * HELPERS
 */
var common = require("../common");

const Op = common.Sequelize.Op;
/**
 * DATABASE
 */

const roleResources = common.db.roleResources;

/**
 *GET ROLE RESOURCES FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.RoleResourcesList = async (req) => {
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
				[Op.or]: [{ resourceName: { [Op.like]: `%${search}%` } }],
			};
		} else {
			whereCondition = {};
		}

		var resourcesDataCount = await common.query.count(roleResources, {
			where: whereCondition,
		});
		var offset = (page - 1) * limit;
		var roleResourcesDetails = await common.query.find(roleResources, {
			where: whereCondition,
			order: [["createdAt", "DESC"]],
			limit: limit,
			offset: offset,
		});

		if (roleResourcesDetails.length == 0 || resourcesDataCount == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_127");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.noParams,
				successOrError.location
			);
			return common.responseModel.successGetResponse(successOrError.failMsg, [], resobj);
		}

		var dataArray = [];

		for (let i = 0; i < roleResourcesDetails.length; i++) {
			var response = await common.response.roleresources.roleresourcesObject(
				roleResourcesDetails[i]
			);

			dataArray.push(response);
		}
		var pagination = await common.pagination(limit, page, resourcesDataCount);
		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return await common.responseModel.successGetResponse(
			successOrError.roleResources,
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
		var array = [];
		array.push(resobj);
		return await common.responseModel.failResponse(successOrError.failMsg, {}, array);
	}
};
