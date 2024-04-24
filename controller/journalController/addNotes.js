/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const journalsCollections = common.db.journals;

/**
 * ADD NOTES FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.addNotes = async (req) => {
	try {
		var bodyParams = req.body;

		if (bodyParams.heading == "" || typeof bodyParams.heading == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.heading,
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
		if (bodyParams.userId == "" || typeof bodyParams.userId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);

			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var decryptedId = await common.helpers.decryptData(bodyParams.userId);

		if (!decryptedId) {
			var successOrError = await common.responseServices.successOrErrors("err_32");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				"body"
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userExists = await usersCollection.findOne({
			where: { id: decryptedId, role: 1, isDeleted: 0 },
		});

		if (!userExists) {
			var successOrError = await common.responseServices.successOrErrors("err_19");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				"body"
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var addNotes = {
			"heading": bodyParams.heading,
			"description": bodyParams.description,
			"userId": decryptedId,
		};

		var addNotesData = await journalsCollections.create(addNotes);

		var response = await common.response.journals.journalsObjectRes(addNotesData.id);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successCreateResponse(
			successOrError.addNotes,
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
