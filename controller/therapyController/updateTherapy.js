/**
 * HELPERS
 */
var common = require("../common");
var Op = common.db.Sequelize.Op;

/**
 * DATABASE
 */
const therapyCollection = common.db.therapies;
const bucketName = process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_THERAPY;
/**
 *
 * THERAPI UPDATE DETAILS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.update = async (req) => {
	try {
		/**
		 * THERAPI ID VALIDATION
		 */

		if (req.params.id) {
			var decryptId = await common.helpers.decryptData(req.params.id);

			var therapiesIdQuery = { where: { id: decryptId } };
			var therapiesDetails = await common.query.findOne(therapyCollection, therapiesIdQuery);

			var therapiesObject = {};

			if (therapiesDetails != null) {
				/**
				 * UPDATE THERAPINAME THEN CALL THIS CONDITION
				 */
				var condition = {};
				var conditionArr = [];
				if (req.body.therapiName != "" && typeof req.body.therapiName != "undefined") {
					var therapiName = req.body.therapiName;
					conditionArr.push({ therapiName: req.body.therapiName });
					therapiesObject.therapiName = req.body.therapiName;
				} else {
					therapiesObject.therapiName = therapiesDetails.therapiName;
				}
				if (req.body.arabicName != "" && typeof req.body.arabicName != "undefined") {
					var arabicName = req.body.arabicName;
					conditionArr.push({ arabicName: req.body.arabicName });
					therapiesObject.arabicName = req.body.arabicName;
				} else {
					therapiesObject.arabicName = therapiesDetails.arabicName;
				}

				if (therapiName && arabicName) {
					condition[Op.or] = conditionArr;
				} else if (therapiName || arabicName) {
					conditionArr;
					let value = Object.values(conditionArr[0]);
					condition[Object.keys(conditionArr[0])] = value[0];
				}

				var therapiQuery = {
					where: condition,
				};
				if (Object.keys(condition).length != 0) {
					condition.id = {
						[Op.ne]: decryptId,
					};
					var findTherapies = await common.query.find(therapyCollection, therapiQuery);

					if (findTherapies.length) {
						/**
						 * CHECK SAME NAME ALREADY EXIST VALIDATION
						 */
						var successOrError = await common.responseServices.successOrErrors("err_98");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.therapi +
								" or " +
								successOrError.parameters.arabicName,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}
				}

				if (req.files) {
					var extention = req.files.image.mimetype.split("/");
					var key = req.body.therapiName
						? req.body.therapiName
						: therapiesDetails.dataValues.therapiName;
					const d = await common.helpers.uploadFileToS3(
						req.files.image,
						key + "." + extention[1],
						bucketName
					);

					if (d.failed == false) {
						await common.helpers.deleteFileFromS3(therapiesDetails.image, bucketName);
					}

					therapiesObject.image = key + "." + extention[1];
				}

				var therapiId = { id: decryptId };
				var update = await common.query.update(therapyCollection, therapiId, therapiesObject);

				if (update == 0) {
					/**
					 * SOME THING WENT WRONG WHILE UPDATE LANGUAGE
					 */

					var successOrError = await common.responseServices.successOrErrors("err_30");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				} else {
					/**
					 * SUCCESS RESPONSE
					 */

					var therapiesDetails = await common.query.findOne(
						therapyCollection,
						therapiesIdQuery
					);

					var response = await common.response.therapies.therapiesObjectRes(therapiesDetails);
					var successOrError = await common.responseServices.successOrErrors("successMessage");
					return await common.responseModel.successResponse(
						successOrError.updateTherapy,
						response,
						[]
					);
				}
			} else {
				var successOrError = await common.responseServices.successOrErrors("err_131");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.therapiId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		} else {
			/**
			 * INVALID THERAPY ID
			 */

			var successOrError = await common.responseServices.successOrErrors("err_131");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapiId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
	} catch (error) {
		/**
		 * CATCH ERROR
		 */
		console.log(error);
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
