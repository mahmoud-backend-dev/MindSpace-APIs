/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const therapyCollection = common.db.therapies;

module.exports.add = async (req) => {
	try {
		var bodyFiles = req.files;
		if (!bodyFiles || bodyFiles.image == "" || typeof bodyFiles.image == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_146");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapiImage,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (req.body.arabicName == "" || typeof req.body.arabicName == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.arabicName,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (req.body.therapiName != "" && typeof req.body.therapiName != "undefined") {
			var usersDetails = await common.query.findOne(therapyCollection, {
				where: {
					therapiName: req.body.therapiName,
				},
			});

			if (usersDetails) {
				var successOrError = await common.responseServices.successOrErrors("err_149");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.addTherapy,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			var bucketName =
				process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_THERAPY;
			var extention = bodyFiles.image.mimetype.split("/");
			var image = req.body.therapiName + "." + extention[1];

			await common.helpers.uploadFileToS3(bodyFiles.image, image, bucketName);
			var addTherapyObject = {
				image: image,
				therapiName: req.body.therapiName,
				arabicName: req.body.arabicName,
			};

			var usersDetails = await common.query.create(therapyCollection, addTherapyObject);

			const newURL = await common.helpers.fetchFileFromS3(image, bucketName);

			usersDetails = newURL;

			/**
			 * SUCCESS RESPONSE
			 */
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return common.responseModel.successCreateResponse(
				successOrError.addTherapy,
				usersDetails,
				{}
			);
		}
		var successOrError = await common.responseServices.successOrErrors("err_146");
		var resobj = await common.responseModel.resObj(
			successOrError.code,
			successOrError.message,
			successOrError.parameters.therapiName,
			successOrError.location
		);
		return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
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
