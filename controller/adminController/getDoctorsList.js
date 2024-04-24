/**
 * HELPERS
 */
var common = require("../common");

const Op = common.Sequelize.Op;

/**
 * DATABASE
 */
const users = common.db.users;
const userTherapies = common.db.userTherapies;
const therapies = common.db.therapies;

/**
 * GET DOCTOR LIST
 * @param {Object} req
 * @returns Object
 */
module.exports.doctorsList = async (req) => {
	try {
		var query = req.query;
		//let whereCondition;

		// Role 1 for patients
		query.page != "" && typeof query.page != "undefined"
			? (page = parseInt(query.page))
			: (page = 1);

		query.limit != "" && typeof query.limit != "undefined"
			? (limit = parseInt(query.limit))
			: (limit = 10);

		query.search != "" && typeof query.search != "undefined"
			? (search = query.search)
			: (search = "");

		// ORDER FIELD (createdAt)
		query.orderField != "" && typeof query.orderField != "undefined"
			? (orderField = query.orderField)
			: (orderField = "createdAt");

		// ORDER (ASC | DESC)
		query.orderBy != "" && typeof query.orderBy != "undefined"
			? (orderBy = query.orderBy)
			: (orderBy = "DESC");

		//isActive Filter

		var offset = (page - 1) * limit;

		var isActive = query.isActive ? query.isActive : "";

		var whereCondition = [{ role: 0 }, { isDeleted: 0 }];
		if (isActive == "2" || isActive == "4") {
			whereCondition.push({
				[Op.and]: [
					{
						[Op.or]: [
							{ personalDetailsFlag: 0 },
							{ professionalFlag: 0 },
							{ therapiesFlag: 0 },
							{ certificationFlag: 0 },
							{ bankDetailsFlag: 0 },
							{ workDaysDetailsFlag: 0 },
							{ isActive: isActive },
						],
					},
					{ isActive: { [Op.ne]: "3" } },
				],
			});
		} else if (isActive == "1" || isActive == "0") {
			whereCondition.push({
				[Op.and]: [
					{ personalDetailsFlag: 1 },
					{ professionalFlag: 1 },
					{ therapiesFlag: 1 },
					{ certificationFlag: 1 },
					{ bankDetailsFlag: 1 },
					{ workDaysDetailsFlag: 1 },
					{ isActive: isActive },
				],
			});
		} else if (isActive == "3") {
			whereCondition.push({ isActive: "3" });
		}

		if (search) {
			whereCondition.push({
				[Op.or]: [
					{ firstName: { [Op.substring]: `%${search}%` } },
					{ lastName: { [Op.substring]: `%${search}%` } },
					{ email: { [Op.substring]: `%${search}%` } },
					{ mobileNumber: { [Op.substring]: `%${search}%` } },
				],
			});
		}

		var query = {
			where: whereCondition,
		};

		var adminDoctorsData = await common.query.count(users, query);
		query.order = [[orderField, orderBy]];
		query.limit = limit;
		query.offset = offset;
		query.include = [
			{
				model: userTherapies,
				as: "userTherapies",
				attributes: ["therapiId"],
				include: [
					{
						model: therapies,
						as: "therapies",
						attributes: ["therapiName"],
					},
				],
			},
		];

		var doctorsDetails = await common.query.find(users, query);

		if (doctorsDetails.length == 0 || adminDoctorsData == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_128");
			return common.responseModel.successGetResponse(successOrError.failMsg, [], {});
		}
		const dataArray = [];
		for (let i = 0; i < doctorsDetails.length; i++) {
			let doctorsDetailsList = doctorsDetails[i];
			let inner = doctorsDetailsList.userTherapies;

			const therapiArr = [];
			for (let j = 0; j < inner.length; j++) {
				const element1 = inner[j].therapies?.therapiName;

				therapiArr.push(element1);
			}

			var response = await common.response.admins.doctorsObjectRes(
				doctorsDetailsList,
				therapiArr
			);
			dataArray.push(response);
		}
		var pagination = await common.pagination(limit, page, adminDoctorsData);
		/**
		 * SUCCESS RESPONSE
		 */
		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return common.responseModel.successGetResponse(
			successOrError.getDoctors,
			dataArray,
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
