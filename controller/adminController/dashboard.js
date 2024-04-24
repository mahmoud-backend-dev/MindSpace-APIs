/**
 * HELPERES
 */
var common = require("../common");
var moment = require("moment");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const appointmentCollections = common.db.appointments;
const Op = common.db.Sequelize.Op;
const sequelize = common.db.sequelize;
const paymentCollection = common.db.payment;

/**
 * ADMIN DASHBOARD
 * @param {OBJECT} req
 * @returns {OBJECT}
 */
module.exports.dashboard = async (req) => {
	try {
		var userCount = await usersCollection.findAll({
			where: { isDeleted: 0 },
			attributes: ["role", [sequelize.fn("count", sequelize.col("role")), "count"]],
			group: ["role"],
		});

		var totalAppointments = await appointmentCollections.findAll({ where: { status: "1" } });

		var usersData = [];

		for (let i = 0; i < 12; i++) {
			const month = moment().subtract(i, "months").format("MM-YYYY");
			const monthName = moment().subtract(i, "months").format("MMMM");
			var responseObj = { [monthName]: { male: 0, female: 0 } };

			var userData = await usersCollection.findAll({
				attributes: ["gender"],
				include: [
					{
						model: appointmentCollections,
						as: "patientAppointments",
						required: true,
						attributes: [],
					},
				],
				// here to AND operations
				where: sequelize.where(
					sequelize.fn(
						"DATE_FORMAT",
						sequelize.col("patientAppointments.appointmentDate"),
						"%m-%Y"
					),
					month
				),

				group: ["patientAppointments.patientId"],
			});
			if (userData.lenth != 0) {
				for (let j = 0; j < userData.length; j++) {
					const element = userData[j];

					if (element.gender == 1) {
						responseObj[monthName].male = responseObj[monthName].male + 1;
					} else if (element.gender == 2) {
						responseObj[monthName].female = responseObj[monthName].female + 1;
					}
				}
			}
			usersData.push(responseObj);
		}

		let payemtDataArr = [];
		for (let j = 0; j < 12; j++) {
			const monthNo = moment().subtract(j, "months").format("MM-YYYY");
			const monthName = moment().subtract(j, "months").format("MMMM");

			const payments = await paymentCollection.findAll({
				where: {
					[Op.and]: [
						sequelize.where(
							sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%m-%Y"),
							monthNo
						),

						{ paymentStatus: "1" },
					],
				},
			});

			var paymentObj = { [monthName]: { amount: 0 } };
			if (payments.length != 0) {
				for (let k = 0; k < payments.length; k++) {
					const element = payments[k];
					paymentObj[monthName].amount =
						paymentObj[monthName].amount + parseInt(element.amount);
				}

				payemtDataArr.push(paymentObj);
			} else {
				payemtDataArr.push(paymentObj);
			}
		}

		var transactionsCount = await paymentCollection.count({});

		var response = {
			"totalPatients": userCount[0].dataValues.count,
			"totalTherapists": userCount[1].dataValues.count,
			"totalAppointments": totalAppointments.length,
			"maleFemaleCount": usersData,
			"paymentCount": payemtDataArr,
			"transactionsCount": transactionsCount,
		};
		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = common.responseServices.successOrErrors("successMessage");
		return common.responseModel.successResponse(successOrError.get, response, {});
	} catch (error) {
		/**
		 * CATCH ERROR
		 */
		var successOrError = common.responseServices.successOrErrors("ex_00");
		var resobj = common.responseModel.resObj(
			successOrError.code,
			error.message,
			successOrError.parameters.noParams,
			successOrError.location
		);
		return common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
	}
};
