/**
 * HELPERS
 */
var common = require("../common");
const Op = common.Sequelize.Op;
/**
 * DATABASE
 */
const usersCollection = common.db.users;
const appointmentsCollection = common.db.appointments;

/**
 * FIND  DOCTOR BY PATIENT ID FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.findAllDoctorByPatientId = async (req) => {
	try {
		var queryParams = req.params;

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

		var patientId = await common.helpers.decryptData(queryParams.id);

		if (!patientId) {
			var successOrError = await common.responseServices.successOrErrors("err_32");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** GET PATIENT THERAPIES BY ID */
		var userDetails = await common.query.find(appointmentsCollection, {
			where: { patientId: patientId },
		});

		const therapistIds = [];
		for (let i = 0; i < userDetails.length; i++) {
			const element = userDetails[i];
			if (element && element.therapistId) therapistIds.push(element.therapistId);
		}

		/** FIND THERAPIST BY MULTIPLE IDs */

		if (search) {
			/** For Search condtion */
			whereCondition = {
				id: {
					[Op.in]: therapistIds,
				},
				[Op.or]: [
					{ firstName: { [Op.substring]: `%${search}%` } },
					{ lastName: { [Op.substring]: `%${search}%` } },
					{ email: { [Op.substring]: `%${search}%` } },
				],
			};
		} else {
			whereCondition = {
				id: {
					[Op.in]: therapistIds,
				},
			};
		}

		var offset = (page - 1) * limit;
		var therapistDataCount = await usersCollection.count({
			where: whereCondition,
		});
		var therapistDetails = await usersCollection.findAll({
			where: whereCondition,
			limit: limit,
			offset: offset,
		});

		/** DATA NOT FOUND PATIENT */
		if (therapistDetails.length == 0 || therapistDataCount == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_128");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.noParams,
				successOrError.location
			);
			return common.responseModel.successGetResponse(successOrError.failMsg, [], resobj);
		}

		var dataArray = [];

		for (let i = 0; i < therapistDetails.length; i++) {
			var response = await common.response.users.therapistByPatientIdObject(therapistDetails[i]);

			dataArray.push(response);
		}

		var pagination = await common.pagination(limit, page, therapistDataCount);
		var successOrError = await common.responseServices.successOrErrors("successMessage");

		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return common.responseModel.successGetResponse(
			successOrError.therapist,
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
