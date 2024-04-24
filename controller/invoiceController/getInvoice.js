var moment = require("moment");

/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const appointmentCollection = common.db.appointments;
const paymentCollection = common.db.payment;

/**
 * FIND BY USER ID FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.getInvoice = async (req) => {
	try {
		var userId = await common.helpers.decryptData(req.params.id);
		var queryParams = req.query;

		if (!userId) {
			var successOrError = await common.responseServices.successOrErrors("err_69");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var userData = await usersCollection.findOne({ where: { id: userId, isDeleted: 0 } });

		if (!userData) {
			var successOrError = await common.responseServices.successOrErrors("err_19");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.userId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		var limit = parseInt(queryParams.limit);
		var page = parseInt(queryParams.page);

		if (page && page > 0) {
			var pageQuery = parseInt(page);
		} else {
			var pageQuery = 1;
		}

		if (limit && limit > 0) {
			var limitQuery = parseInt(limit);
		} else {
			var limitQuery = 10;
		}

		if (typeof queryParams.order != "undefined" && queryParams.order != "") {
			if (queryParams.order == "1") {
				var sort = "desc";
			} else if (queryParams.order == "0") {
				var sort = "asc";
			}
		} else {
			var sort = "asc";
		}

		var offset = limitQuery * (pageQuery - 1);
		var condition = {
			include: [
				{
					model: paymentCollection,
					as: "payment",
					required: true,
				},
				{
					model: usersCollection,
					as: "therapistAppointments",
				},
			],
			where: { patientId: userId, "$payment.paymentStatus$": "1" },
		};
		var count = await appointmentCollection.count(condition);

		condition.limit = limitQuery;
		condition.offset = offset;

		condition.order = [["updatedAt", sort]];

		var getAllInvoices = await appointmentCollection.findAll(condition);

		var invoiceArr = [];
		if (getAllInvoices != 0) {
			for (let index = 0; index < getAllInvoices.length; index++) {
				const element = getAllInvoices[index];

				if (element.invoice != "") {
					var invoice = await common.helpers.fetchFileFromS3(
						element.invoice,
						process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_INVOICE
					);
				}

				let resObj = {
					doctorName:
						element.therapistAppointments.firstName +
						" " +
						element.therapistAppointments.lastName,
					amount: element.payment.amount,
					date: moment(element.payment.createdAt).format("DD-MM-YYYY"),
					invoiceNumber: element.invoiceNumber,
					invoice: invoice ? invoice : "",
				};
				invoiceArr.push(resObj);
			}

			var paginations = await common.pagination(limitQuery, pageQuery, count);

			var successOrError = await common.responseServices.successOrErrors("successMessage");
			return await common.responseModel.successGetResponse(
				successOrError.invoice,
				invoiceArr,
				{},
				paginations
			);
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_82");
			return await common.responseModel.successResponse(successOrError.message, [], {});
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
