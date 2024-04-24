/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */

const feedbackCollection = common.db.feedback;

/**
 * GET FEEDBACKS LIST
 * @param {Object} req
 * @returns Object
 */
module.exports.contactUsList = async (req) => {
	try {
		var query = req.query;

		query.page != "" && typeof query.page != "undefined"
			? (page = parseInt(query.page))
			: (page = 1);

		query.limit != "" && typeof query.limit != "undefined"
			? (limit = parseInt(query.limit))
			: (limit = 10);

		var offset = (page - 1) * limit;
		var contactDatacount = await common.query.count(feedbackCollection, {});
		var contactData = await feedbackCollection.findAll({
			order: [["createdAt", "DESC"]],
			limit: limit,
			offset: offset,
		});

		if (contactData.length == 0 || contactDatacount == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_129");

			return common.responseModel.successGetResponse(successOrError.failMsg, [], {});
		}

		var dataArray = [];

		for (let i = 0; i < contactData.length; i++) {
			var response = await common.response.feedback.feedbackObjectRes(contactData[i]);

			dataArray.push(response);
		}
		var pagination = await common.pagination(limit, page, contactDatacount);
		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return common.responseModel.successGetResponse(
			successOrError.feedbackGet,
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
