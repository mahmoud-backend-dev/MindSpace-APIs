/**
 * HELPERS
 */
var common = require("../common");

const Op = common.Sequelize.Op;
const { sequelize } = require("../../schema/db");
/**
 * DATABASE
 */
const users = common.db.users;

/**
 * GET PATIENTLIST FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.patientsList = async (req) => {
	try {
		var query = req.query;
		var whereCondition;

		// Role 1 for patients
		query.page != "" && typeof query.page != "undefined"
			? (page = parseInt(query.page))
			: (page = 1);

		query.limit != "" && typeof query.limit != "undefined"
			? (limit = parseInt(query.limit))
			: (limit = 10);

		query.search != "" && typeof query.search != "undefined"
			? (search = query.search)
			: (search = "");

		// Month Filter
		var months = query.month ? parseInt(query.month) : "";
		//Country Filter
		var country = query.country ? query.country : "";

		/**Conditions */
		var whereCondition = {
			role: 1,
			isDeleted: 0,
		};
		if (country) {
			whereCondition.country = country;
		}
		if (search) {
			whereCondition[Op.or] = [
				{ firstName: { [Op.substring]: `%${search}%` } },
				{ lastName: { [Op.substring]: `%${search}%` } },
				{ email: { [Op.substring]: `%${search}%` } },
				{ mobileNumber: { [Op.substring]: `%${search}%` } },
			];
		}
		if (months) {
			whereCondition.createdAt = sequelize.where(
				sequelize.fn("month", sequelize.col("createdAt")),
				months
			);
		}

		var adminPatientDataCount = await users.count({
			where: whereCondition,
		});
		var adminPatientData = await users.findAll({
			where: whereCondition,
			order: [["createdAt", "desc"]],
		});
		if (adminPatientData.length == 0 || adminPatientDataCount == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_126");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.noParams,
				successOrError.location
			);
			return common.responseModel.successGetResponse(successOrError.failMsg, [], resobj);
		}

		var dataArray = [];

		for (let i = 0; i < adminPatientData.length; i++) {
			var response = await common.response.admins.patientsObjectRes(adminPatientData[i]);

			dataArray.push(response);
		}
		var pagination = await common.pagination(limit, page, adminPatientDataCount);
		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return common.responseModel.successGetResponse(
			successOrError.getPatients,
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
