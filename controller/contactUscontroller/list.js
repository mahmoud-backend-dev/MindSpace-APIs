/**
 * HELPERS
 */
var common = require("../common");

const Op = common.Sequelize.Op;
/**
 * DATABASE
 */

const contactUsCollection = common.db.contactUs;

/**
 * LIST CONTACT US FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.contactUsList = async (req) => {
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
				[Op.or]: [
					{ name: { [Op.like]: `%${search}%` } },
					{ email: { [Op.like]: `%${search}%` } },
				],
			};
		} else {
			whereCondition = {};
		}
		var offset = (page - 1) * limit;
		var contactDataCount = await common.query.count(contactUsCollection, {
			where: whereCondition,
		});
		var contactData = await common.query.find(contactUsCollection, {
			where: whereCondition,
			order: [["createdAt", "DESC"]],
			limit: limit,
			offset: offset,
		});
		if (contactData.length == 0 || contactDataCount == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_129");
			return common.responseModel.successGetResponse(successOrError.failMsg, [], {});
		}
		var dataArray = [];

		for (let i = 0; i < contactData.length; i++) {
			var response = await common.response.contactUs.constactUsObjectRes(contactData[i]);

			dataArray.push(response);
		}

		var pagination = await common.pagination(limit, page, contactDataCount);
		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return common.responseModel.successGetResponse(
			successOrError.contactUsGet,
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
