/**
 * HELPERS
 */
var moment = require("moment");
var common = require("../common");
var Sequelize = require("sequelize");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

const appointmentCollection = common.db.appointments;
const paymentCollection = common.db.payment;

const Op = Sequelize.Op;

/**
 * GET ALL TRANSACTIONS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.getAllTransations = async (req) => {
	try {
		var queryParams = req.query;

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

		var where = {};
		if (typeof queryParams.search != "undefined" && queryParams.search) {
			var search = queryParams.search;
		}
		var condition = {
			include: [
				{
					model: usersCollection,
					as: "therapistAppointments",
				},
				{
					model: usersCollection,
					as: "patientAppointments",
				},
				{
					model: paymentCollection,
					as: "payment",
				},
			],
		};

		if (typeof queryParams.status != "undefined" && queryParams.status != "") {
			var status = queryParams.status;
		}
		if (typeof queryParams.interactionType != "undefined" && queryParams.interactionType != "") {
			var interactionType = queryParams.interactionType;
		}

		if (search) {
			condition.where = {
				[Op.or]: [
					Sequelize.where(
						Sequelize.fn(
							"concat",
							Sequelize.col("therapistAppointments.firstName"),
							" ",
							Sequelize.col("therapistAppointments.lastName")
						),
						{
							[Op.substring]: `%${queryParams.search}%`,
						}
					),
					Sequelize.where(
						Sequelize.fn(
							"concat",
							Sequelize.col("patientAppointments.firstName"),
							" ",
							Sequelize.col("patientAppointments.lastName")
						),
						{
							[Op.substring]: `%${queryParams.search}%`,
						}
					),

					{
						invoiceNumber: {
							[Op.substring]: `%${queryParams.search}%`,
						},
					},
				],
			};
		} else {
			if (status) {
				where["$payment.paymentStatus$"] = queryParams.status;
			}
			if (interactionType) {
				where.interactionType = queryParams.interactionType;
			}
			condition.where = where;
		}

		var offset = limitQuery * (pageQuery - 1);

		var count = await appointmentCollection.count(condition);
		if (typeof queryParams.isAppointments != "undefined" && queryParams.isAppointments != "") {
			if (queryParams.isAppointments == "1") {
				condition.order = [
					["appointmentDate", "desc"],
					["slotStartTime", "asc"],
				];
			} else if (queryParams.isAppointments == "0") {
				condition.order = [[{ model: paymentCollection, as: "payment" }, "createdAt", "desc"]];
			} else {
				var successOrError = await common.responseServices.successOrErrors("err_158");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.isAppointments,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		} else {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.isAppointments,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		condition.limit = limitQuery;
		condition.offset = offset;
		// condition.order = [
		// 	["appointmentDate", "desc"],
		// 	["slotStartTime", "asc"],
		// ];
		//condition.order = [[{ model: paymentCollection, as: "payment" }, "createdAt", "desc"]];
		var data = await appointmentCollection.findAll(condition);
		if (count == 0 || data.length == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_125");
			return await common.responseModel.successResponse(successOrError.failMsg, [], {});
		}

		var dataArr = [];

		for (let i = 0; i < data.length; i++) {
			const element = data[i];

			if (element.interactionType == "0") {
				var interactionType = "Text";
			} else if (element.interactionType == "1") {
				var interactionType = "Audio";
			} else if (element.interactionType == "2") {
				var interactionType = "Video";
			}

			if (element.status == "0") {
				var status = "Upcoming";
			} else if (element.status == "1") {
				var status = "Completed";
			} else if (element.status == "2") {
				var status = "Canceled";
			} else if (element.status == "3") {
				var status = "Ongoing";
			}

			if (element.payment != "") {
				if (element.payment.paymentStatus == "0") {
					var paymentStatus = "Pending";
					status = "-";
				} else if (element.payment.paymentStatus == "1") {
					var paymentStatus = "Succeeded";
				} else if (element.payment.paymentStatus == "2") {
					var paymentStatus = "Failed";
					status = "-";
				} else if (element.payment.paymentStatus == "4") {
					var paymentStatus = "Canceled";
					status = "-";
				}
			}
			if (element.invoice != "") {
				var invoiceUrl = await common.helpers.fetchFileFromS3(
					element.invoice,
					process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_INVOICE
				);
			} else {
				var invoiceUrl = "";
			}

			const startTime = moment(element.slotStartTime).tz("Asia/Kuwait").format("hh:mm A");
			const endTime = moment(element.slotEndTime).tz("Asia/Kuwait").format("hh:mm A");

			var resObj = {
				therapistName:
					element.therapistAppointments.firstName +
					" " +
					element.therapistAppointments.lastName,
				patientName:
					element.patientAppointments.firstName + " " + element.patientAppointments.lastName,
				appointmentDate: moment(element.appointmentDate).format("DD-MM-YYYY"),
				appointmentStatus: status,
				interationType: interactionType,
				paymentId: element.payment.paymentId,
				paymentStatus: paymentStatus,

				invoiceNumber: element.invoiceNumber,
				invoice: invoiceUrl,
				amount: element.payment.amount,
				transactionDate: moment(element.payment.createdAt).format("DD-MM-YYYY"),
				timeSlot: `${startTime} : ${endTime}`,
			};
			dataArr.push(resObj);
		}

		var pagination = await common.pagination(limitQuery, pageQuery, count);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successGetResponse(
			successOrError.transactions,
			dataArr,
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
