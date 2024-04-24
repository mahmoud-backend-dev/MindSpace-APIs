/**
 * NPM PACKAGE
 */

/**
 * BUCKECT
 */
const bucketName = process.env.AWS_BUCKETNAME;
const educationalPath = process.env.AWS_UPLOAD_PATH_FOR_EDUCATIONAL;
const governmentPath = process.env.AWS_UPLOAD_PATH_FOR_GOVERNMENT_CERTIFICATE;
const profileImage = process.env.AWS_UPLOAD_PATH_FOR_PROFILE;

/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const certificationsCollections = common.db.certifications;

/**
 * UPDATE CIRTIFICATES BY USER ID FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.uploadDocumnet = async (req) => {
	try {
		var decryptId = await common.helpers.decryptData(req.params.therapistId);
		if (!decryptId) {
			var successOrError = await common.responseServices.successOrErrors("err_23");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userDetails = await common.query.findOne(usersCollection, {
			where: { id: decryptId, role: 0, isDeleted: 0 },
		});

		if (!userDetails) {
			/**
			 * USER NOT FOUND
			 */

			var successOrError = await common.responseServices.successOrErrors("err_19");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var files = req.files;

		if (files && files.educational != "" && typeof files.educational != "undefined") {
			if (Array.isArray(files.educational)) {
				for (let i = 0; i < files.educational.length; i++) {
					const element = files.educational[i];
					var validateEducational = await common.helpers.fileValidation(element);
					if (validateEducational == false) {
						var successOrError = await common.responseServices.successOrErrors("err_24");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.educational,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}

					var bucket = bucketName + "/" + educationalPath;
					var uploadFile = await common.helpers.uploadFileToS3(
						element,
						validateEducational,
						bucket
					);
					if (uploadFile == false) {
						var successOrError = await common.responseServices.successOrErrors("err_50");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.educational,
							successOrError.location
						);
						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}

					var insertObj = {
						documentType: "education",
						userId: userDetails.id,
						document: validateEducational,
					};

					await certificationsCollections.create(insertObj);
					if (
						userDetails.personalDetailsFlag == "1" &&
						userDetails.professionalFlag == "1" &&
						userDetails.therapiesFlag == "1" &&
						userDetails.certificationFlag == "1" &&
						userDetails.bankDetailsFlag == "1" &&
						(userDetails.isActive == "2" || userDetails.isActive == "4")
					) {
						await usersCollection.update(
							{ isActive: "0", reason: "" },
							{ where: { id: userDetails.id } }
						);
					}
				}
			} else {
				var validateEducational = await common.helpers.fileValidation(files.educational);
				if (validateEducational == false) {
					var successOrError = await common.responseServices.successOrErrors("err_24");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.educational,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				var bucket = bucketName + "/" + educationalPath;
				var uploadFile = await common.helpers.uploadFileToS3(
					files.educational,
					validateEducational,
					bucket
				);

				if (uploadFile == false) {
					var successOrError = await common.responseServices.successOrErrors("err_50");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.educational,
						successOrError.location
					);
					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				}

				var insertObj = {
					documentType: "education",
					userId: userDetails.id,
					document: validateEducational,
				};

				await certificationsCollections.create(insertObj);
				if (
					userDetails.personalDetailsFlag == "1" &&
					userDetails.professionalFlag == "1" &&
					userDetails.therapiesFlag == "1" &&
					userDetails.certificationFlag == "1" &&
					userDetails.bankDetailsFlag == "1" &&
					userDetails.workDaysDetailsFlag == "1" &&
					(userDetails.isActive == "2" || userDetails.isActive == "4")
				) {
					await usersCollection.update(
						{ isActive: "0", reason: "" },
						{ where: { id: userDetails.id } }
					);
				}
			}
		}

		if (files && files.government != "" && typeof files.government != "undefined") {
			var validateGovernment = await common.helpers.fileValidation(files.government);
			if (validateGovernment == false) {
				var successOrError = await common.responseServices.successOrErrors("err_28");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.government,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			var bucket = bucketName + "/" + governmentPath;
			var uploadFile = await common.helpers.uploadFileToS3(
				files.government,
				validateGovernment,
				bucket
			);

			if (uploadFile == false) {
				var successOrError = await common.responseServices.successOrErrors("err_50");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.educational,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			var fileObj = {
				documentType: "government",
				userId: userDetails.id,
				document: validateGovernment,
			};

			var fileExists = await certificationsCollections.findOne({
				where: { userId: userDetails.id, documentType: "government" },
			});

			if (fileExists) {
				if (fileExists.document != "") {
					await common.helpers.deleteFileFromS3(fileExists.document, bucket);
				}
				await certificationsCollections.update(fileObj, {
					where: { userId: userDetails.id, documentType: "government" },
				});
			} else {
				await certificationsCollections.create(fileObj);
				if (
					userDetails.personalDetailsFlag == "1" &&
					userDetails.professionalFlag == "1" &&
					userDetails.therapiesFlag == "1" &&
					userDetails.certificationFlag == "1" &&
					userDetails.bankDetailsFlag == "1" &&
					userDetails.workDaysDetailsFlag == "1" &&
					(userDetails.isActive == "2" || userDetails.isActive == "4")
				) {
					await usersCollection.update(
						{ isActive: "0", reason: "" },
						{ where: { id: userDetails.id } }
					);
				}
			}
		}

		if (files && files.profileImage != "" && typeof files.profileImage != "undefined") {
			var validateProfileImage = await common.helpers.profileValidation(files.profileImage);
			if (validateProfileImage == false) {
				var successOrError = await common.responseServices.successOrErrors("err_29");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.profileImage,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			var bucket = bucketName + "/" + profileImage;
			var uploadFile = await common.helpers.uploadFileToS3(
				files.profileImage,
				validateProfileImage,
				bucket
			);
			var profileUpdateObj = {
				profileImage: validateProfileImage,
			};

			var fileExists = await usersCollection.findOne({
				where: { id: userDetails.id },
			});

			if (fileExists) {
				if (fileExists.profileImage != "") {
					await common.helpers.deleteFileFromS3(fileExists.profileImage, bucket);
				}
				await usersCollection.update(profileUpdateObj, {
					where: { id: userDetails.id },
				});
			}
		}

		var certificatesDetailsFlag = { certificationFlag: 1 };
		await usersCollection.update(certificatesDetailsFlag, {
			where: { id: userDetails.id },
		});

		var response = await common.response.users.singleUserObjectRes(decryptId);
		/**
		 * ERROR RESPONSE
		 */
		if (!response) {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(successOrError.update, response, {});
	} catch (error) {
		/**
		 * CATCH ERROR
		 */

		var successOrError = await common.responseServices.successOrErrors("ex_00");
		var resobj = await common.responseModel.resObj(
			error.code,
			error.message,
			successOrError.parameters.noParams,
			successOrError.location
		);
		return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
	}
};
