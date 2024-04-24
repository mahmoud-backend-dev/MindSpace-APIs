/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const feedbackCollection = common.db.feedback;

/**
 *
 * FEEDBACK CREATE
 * @param {OBJECT} req
 * @returns OBJECT
 */
async function create(req) {
	try {
		if (req.body.feedback == "" || typeof req.body.feedback == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.feedback,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (req.body.patientId == "" || typeof req.body.patientId == "undefined") {
			/**
			 * REQUIRE FIELD MESSAGE
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (req.body.therapistId == "" || typeof req.body.therapistId == "undefined") {
			/**
			 * REQUIRE FIELD MESSAGE
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");

			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var decryptTherapistId = await common.helpers.decryptData(req.body.patientId);
		var decryptpatientId = await common.helpers.decryptData(req.body.therapistId);

		const createObj = {
			therapistId: decryptTherapistId,
			patientId: decryptpatientId,
			feedback: req.body.feedback,
		};

		var result = await common.query.create(feedbackCollection, createObj);

		if (result) {
			/**
			 * SUCCESS RESPONSE
			 */

			var response = await common.response.feedback.feedbackObjectRes(result);
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return common.responseModel.successCreateResponse(successOrError.feedback, response, {});
		} else {
			/**
			 * SOMETHING WENT WRONG WHILE CREATE FEEDBACK
			 */

			var successOrError = await common.responseServices.successOrErrors("err_56");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.message, {}, resobj);
		}
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
}

module.exports = {
	create,
};
