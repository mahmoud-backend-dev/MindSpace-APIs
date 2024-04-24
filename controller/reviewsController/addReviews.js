/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const appointmentCollections = common.db.appointments;
const reviewsCollections = common.db.reviews;

/**
 *ADD USER REVIEWS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.addReviews = async (req) => {
	try {
		var bodyParams = req.body;

		if (bodyParams.rating == "" || typeof bodyParams.rating == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.rating,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (parseFloat(bodyParams.rating) <= 0 || parseFloat(bodyParams.rating) > 5) {
			var successOrError = await common.responseServices.successOrErrors("err_83");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.rating,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (bodyParams.description == "" || typeof bodyParams.description == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.description,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (bodyParams.appointmentId == "" || typeof bodyParams.appointmentId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var decryptedId = await common.helpers.decryptData(bodyParams.appointmentId);

		if (!decryptedId) {
			var successOrError = await common.responseServices.successOrErrors("err_66");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				"body"
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userData = await appointmentCollections.findOne({ where: { id: decryptedId } });

		if (!userData) {
			var successOrError = await common.responseServices.successOrErrors("err_67");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				"body"
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var addReviews = {
			"rating": bodyParams.rating,
			"description": bodyParams.description,
			"therapistId": userData.therapistId,
			"patientId": userData.patientId,
		};

		var addReviewsData = await reviewsCollections.create(addReviews);

		var response = await common.response.reviews.reviewsObjectRes(addReviewsData.id);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successCreateResponse(
			successOrError.addReviews,
			response,
			{}
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
