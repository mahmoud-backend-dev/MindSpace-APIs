/**
 * HELPERS
 */
var common = require("../common");
/**
 * BUCKECT
 */
const bucketName = process.env.AWS_BUCKETNAME;
const educationalPath = process.env.AWS_UPLOAD_PATH_FOR_EDUCATIONAL;
const governmentPath = process.env.AWS_UPLOAD_PATH_FOR_GOVERNMENT_CERTIFICATE;

/**
 * DATABASE
 */
const certificateCollection = common.db.certifications;
/**
 * DELETE DOCUMENT FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.deleteDocument = async (req) => {
	try {
		var decryptId = await common.helpers.decryptData(req.params.id);

		if (!decryptId) {
			var successOrError = await common.responseServices.successOrErrors("err_55");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.documentId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var documentDetails = await common.query.findOne(certificateCollection, {
			where: { id: decryptId,  },
		});
		if (!documentDetails) {
			/**
			 * DOCUMENT  NOT FOUND
			 */
			var successOrError = await common.responseServices.successOrErrors("err_56");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.documentId,
				successOrError.location
			);
			return await common.responseModel.successGetResponse(successOrError.failMsg, {}, resobj);
		}

		if (documentDetails.documentType == "education") {
			if (documentDetails.document != "") {
				let bucket = bucketName + "/" + educationalPath;
				await common.helpers.deleteFileFromS3(documentDetails.document, bucket);
			}
		} else if (documentDetails.documentType == "government") {
			if (documentDetails.document != "") {
				var bucket = bucketName + "/" + governmentPath;
				await common.helpers.deleteFileFromS3(documentDetails.document, bucket);
			}
		}

		var deleteDocument = await certificateCollection.destroy({ where: { id: decryptId } });

		if (deleteDocument == 1) {
			/**
			 * SUCCESS RESPONSE
			 */
			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successResponse(successOrError.deleteDocument, {}, {});
		} else {
			/**
			 * SOMETHING WENT WRONG WHILE DELETING DOCUMENT
			 */
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.message,
				successOrError.parameters.noParams,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
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
};
