/**
 * HELPERS
 */
const { Op } = require("sequelize");
var common = require("../common");

/**
 * DATABASE
 */
const reportsCollections = common.db.reports;
const usersCollection = common.db.users;
const appointmentCollection = common.db.appointments;

/**
 * GET ALL REPORTS FUNCTION
 * @param {Object} req
 * @returns Object
 */

module.exports.getAllReports = async (req) => {
	try {
		var queryParams = req.query;
		var condition = {};

		var limit = parseInt(queryParams.limit);
		var page = parseInt(queryParams.page);
		var count = await reportsCollections.count(condition);

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

		const whereCondition = {};

		/** Find Users */

		const descUserId = await common.helpers.decryptData(queryParams.userId);
		if (queryParams.userId) {
			whereCondition[Op.or] = {
				patientId: descUserId,
				therapistId: descUserId,
			};
		}

		/** Search */
		if (queryParams.search) {
			if (queryParams.role == "0") {
				whereCondition[Op.or] = [
					{
						"$patientReports.firstName$": {
							[Op.like]: `%${queryParams.search}%`,
						},
					},
					{
						"$patientReports.nickName$": {
							[Op.like]: `%${queryParams.search}%`,
						},
					},
					{ uuid: { [Op.like]: `%${queryParams.search}%` } },
				];
			} else {
				whereCondition[Op.or] = [
					{
						"$therapistReports.firstName$": {
							[Op.like]: `%${queryParams.search}%`,
						},
					},
					{
						"$therapistReports.nickName$": {
							[Op.like]: `%${queryParams.search}%`,
						},
					},
					{ uuid: { [Op.like]: `%${queryParams.search}%` } },
				];
			}
		}

		var offset = limitQuery * (pageQuery - 1);

		condition.limit = limitQuery;
		condition.offset = offset;
		condition.order = [["id", "desc"]];
		condition.where = whereCondition;
		condition.include = [
			{
				model: appointmentCollection,
				as: "appointmentReport",
				attributes: ["appointmentDate", "slotStartTime"],
			},
			{
				model: usersCollection,
				as: "patientReports",
				attributes: ["firstName", "nickName"],
			},
			{
				model: usersCollection,
				as: "therapistReports",
				attributes: ["firstName"],
			},
		];

		var reportsdata = await reportsCollections.findAll(condition);

		if (reportsdata.length == 0 || count == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_151");
			return await common.responseModel.successResponse(successOrError.message, [], {});
		}

		const userTimeZone = req.user.timezone;

		var reportArr = [];
		for (let i = 0; i < reportsdata.length; i++) {
			const element = reportsdata[i];
			var resObj = await common.response.reports.reportObjectRes(element.id, userTimeZone);
			reportArr.push(resObj);
		}
		var paginations = await common.pagination(limitQuery, pageQuery, count);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return common.responseModel.successGetResponse(
			successOrError.reports,
			reportArr,
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
