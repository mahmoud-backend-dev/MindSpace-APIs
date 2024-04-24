/**
 * HELPERS
 */
var common = require("../common");
/**
 * DATABASE
 */
const reportsCollection = common.db.reports;
const usersCollection = common.db.users;
const appointmentCollection = common.db.appointments;
/**
 *ADD APPOINTMENR REPORT FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.addReport = async (req) => {
	try {
		var bodyParams = req.body;

		/** Check patientId */
		if (bodyParams.patientId == "" || typeof bodyParams.patientId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var decryptPatientId = await common.helpers.decryptData(bodyParams.patientId);

		if (!decryptPatientId) {
			var successOrError = await common.responseServices.successOrErrors("err_59");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** Check therapistId */
		if (bodyParams.therapistId == "" || typeof bodyParams.therapistId == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var decryptTherapistId = await common.helpers.decryptData(bodyParams.therapistId);

		if (!decryptTherapistId) {
			var successOrError = await common.responseServices.successOrErrors("err_23");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var patientExists = await usersCollection.findOne({
			where: { id: decryptPatientId, isDeleted: 0 },
		});

		if (!patientExists) {
			var successOrError = await common.responseServices.successOrErrors("err_126");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var therapistExists = await usersCollection.findOne({
			where: { id: decryptTherapistId, isDeleted: 0 },
		});

		if (!therapistExists) {
			var successOrError = await common.responseServices.successOrErrors("err_128");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** check appointmentId */

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

		var decryptAppointmentId = await common.helpers.decryptData(bodyParams.appointmentId);

		if (!decryptAppointmentId) {
			var successOrError = await common.responseServices.successOrErrors("err_66");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var appointmentExists = await appointmentCollection.findOne({
			where: { id: decryptAppointmentId },
		});

		if (!appointmentExists) {
			var successOrError = await common.responseServices.successOrErrors("err_128");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** Check  session Summary  field */
		if (bodyParams.sessionSummary == "" || typeof bodyParams.sessionSummary == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.sessionSummary,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** Check homeWork field */
		if (bodyParams.homeWork == "" || typeof bodyParams.homeWork == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.homeWork,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** Check topicQuestions field */
		if (bodyParams.topicQuestions == "" || typeof bodyParams.topicQuestions == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.topicQuestions,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** Check comments field */
		if (bodyParams.comments == "" || typeof bodyParams.comments == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.comments,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		/** Check intervention Needed field */
		if (
			bodyParams.interventionNeeded == "" ||
			typeof bodyParams.interventionNeeded == "undefined"
		) {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.interventionNeeded,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		const genrateUUID = common.helpers.create_UUID();

		var addReportObj = {
			uuid: genrateUUID,
			patientId: decryptPatientId,
			therapistId: decryptTherapistId,
			appointmentId: decryptAppointmentId,
			sessionSummary: bodyParams.sessionSummary,
			homeWork: bodyParams.homeWork,
			topicQuestions: bodyParams.topicQuestions,
			comments: bodyParams.comments,
			interventionNeeded: bodyParams.interventionNeeded,
		};
		var addReportData = await reportsCollection.create(addReportObj);

		const userTimeZone = req.user.timezone;

		var response = await common.response.reports.reportObjectRes(addReportData.id, userTimeZone);

		/** Create PDF */
		var pdfResult = await common.createReportPDF.createReportPDF(response);

		/** Fetch Result */
		var file = await common.helpers.fetchFileFromS3(
			pdfResult,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_REPORT
		);

		var updateObj = {
			reportUrl: file,
		};

		response.reportUrl = file;

		/** Update record add reportURL */
		await reportsCollection.update(updateObj, {
			where: { id: addReportData.id },
		});

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return common.responseModel.successCreateResponse(successOrError.addreport, response, {});
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
