/**
 * HELPERS
 */
var common = require("../common");
const { pagination } = require("../../helpers/pagination");
const { Sequelize, sequelize } = require("../../schema/db");
const Op = common.Sequelize.Op;

/**
 * DATABASE
 */
const users = common.db.users;
const userTherapies = common.db.userTherapies;
const therapies = common.db.therapies;
const therapiescollections = common.db.therapies;
const languageCollections = common.db.therapistLanguages;

/**
 * GET ALL USERS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.findAllUsers = async (req) => {
	try {
		var queryParams = req.query;

		let whereCondition = {};
		let include = [];

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

		if (typeof queryParams.role != "undefined" && queryParams.role != "") {
			if (queryParams.role == 0 || queryParams.role == 1) {
				whereCondition.role = queryParams.role;
			} else {
				var successOrError = await common.responseServices.successOrErrors("err_74");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.role,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}
		whereCondition.isActive = "1";
		whereCondition.isDeleted = 0;

		var andArr = [];
		if (typeof queryParams.search != "undefined" && queryParams.search != "") {
			const therapistData = await therapies.findAll({
				where: { therapiName: { [Op.substring]: `%${queryParams.search}%` } },
			});
			const userArr = [];
			if (therapistData.length > 0) {
				const therapiesArray = [];
				for (let j = 0; j < therapistData.length; j++) {
					const element = therapistData[j];
					therapiesArray.push(element.id);
				}

				const userTherapiesData = await userTherapies.findAll({
					where: { therapiId: { [Op.in]: therapiesArray } },
				});

				if (userTherapiesData.length > 0) {
					for (let k = 0; k < userTherapiesData.length; k++) {
						const elementUser = userTherapiesData[k];
						if (userArr.includes(elementUser.userId) == false) {
							userArr.push(elementUser.userId);
						}
					}
				}
			}

			var therapistObj = {
				[Op.or]: [
					Sequelize.where(
						Sequelize.fn(
							"concat",
							Sequelize.col("firstName"),
							" ",
							Sequelize.col("lastName")
						),
						{
							[Op.substring]: `%${queryParams.search}%`,
						}
					),
				],
			};

			if (userArr.length > 0) {
				therapistObj[Op.or].push({ id: { [Op.in]: userArr } });
			}

			andArr.push(therapistObj);
			whereCondition[Op.or] = [andArr];

			var therapiess = {
				model: userTherapies,
				as: "userTherapies",
				separate: true,
				include: [
					{
						model: therapiescollections,
						as: "therapies",
					},
				],
				group: userTherapies.userId,
			};
			include.push(therapiess);
		}

		if (typeof queryParams.gender != "undefined" && queryParams.gender != "") {
			var gendersType = queryParams.gender.split(",");
			whereCondition.gender = {
				[Op.in]: gendersType,
			};
		}
		if (typeof queryParams.area != "undefined" && queryParams.area != "") {
			whereCondition.city = queryParams.area;
		}
		if (typeof queryParams.feeRangeStart != "undefined" && queryParams.feeRangeStart != "") {
			var feeRangeStart = queryParams.feeRangeStart;
		}
		if (typeof queryParams.feeRangeTo != "undefined" && queryParams.feeRangeTo != "") {
			var feeRangeTo = queryParams.feeRangeTo;
		}

		if (typeof queryParams.language != "undefined" && queryParams.language != "") {
			var languages = queryParams.language.split(",");

			var languageCon = {
				"$therapistlanguages.languageName$": { [Op.in]: languages },
			};
			andArr.push(languageCon);
			whereCondition[Op.or] = [andArr];

			var includeLanguage = {
				model: languageCollections,
				as: "therapistlanguages",
			};

			include.push(includeLanguage);
		}

		if (feeRangeStart && feeRangeTo) {
			var feeRangeCondition = {
				[Op.or]: [
					{
						chatSessionPrice: { [Op.between]: [feeRangeStart, feeRangeTo] },
					},
					{
						voiceSessionPrice: { [Op.between]: [feeRangeStart, feeRangeTo] },
					},
					{
						videoSessionPrice: { [Op.between]: [feeRangeStart, feeRangeTo] },
					},
				],
			};

			andArr.push(feeRangeCondition);
			whereCondition[Op.or] = [andArr];
		}

		if (typeof queryParams.therapistName != "undefined" && queryParams.therapistName != "") {
			var therapistName = {
				[Op.or]: [
					Sequelize.where(
						Sequelize.fn(
							"concat",
							Sequelize.col("firstName"),
							" ",
							Sequelize.col("lastName")
						),
						{
							[Op.substring]: `%${queryParams.therapistName}%`,
						}
					),
				],
			};
			whereCondition[Op.and] = therapistName[Op.or];
		}

		var offset = (pageQuery - 1) * limitQuery;
		var userData = await common.query.findAndCountAll(users, {
			include: include,
			where: whereCondition,
			order: sequelize.literal("rand()"),
			limit: limitQuery,
			offset: offset,
			subQuery: false,
		});

		if (userData.count == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_76");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.noParams,
				successOrError.location
			);

			return await common.responseModel.successGetResponse(successOrError.failMsg, {}, resobj);
		}
		var paginations = await pagination(limitQuery, pageQuery, userData.count);

		const dataArray = [];

		for (let i = 0; i < userData.rows.length; i++) {
			let doctorsDetailsList = userData.rows[i];
			var response = await common.response.users.getAllTherapistObj(doctorsDetailsList);
			dataArray.push(response);
		}

		// /**
		//  * SUCCESS RESPONSE
		//  */
		var successOrError = await common.responseServices.successOrErrors("successMessage");

		return common.responseModel.successGetResponse(
			successOrError.getUsers,
			dataArray,
			{},
			paginations
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
