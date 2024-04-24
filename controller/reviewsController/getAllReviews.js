/**
 * HELPERS
 */
var common = require("../common");
var Sequelize = require("sequelize");

/**
 * DATABASE
 */
const usersCollection = common.db.users;
const reviewsCollections = common.db.reviews;
const Op = Sequelize.Op;

/**
 * GET ALL REVIEWS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.getReviews = async (req) => {
	try {
		var queryParams = req.query;
		var condition = {};
		if (queryParams.userId != "" && typeof queryParams.userId != "undefined") {
			var userId = await common.helpers.decryptData(queryParams.userId);

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
			} else {
				condition.where = { therapistId: userId, isDeleted: 0 };
			}
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
		if (typeof queryParams.search != "undefined" && queryParams.search != "") {
			condition.where = {
				[Op.or]: [
					Sequelize.where(
						Sequelize.fn(
							"concat",
							Sequelize.col("patientReviews.firstName"),
							" ",
							Sequelize.col("patientReviews.lastName")
						),
						{
							[Op.like]: `%${queryParams.search}%`,
						}
					),
					Sequelize.where(
						Sequelize.fn(
							"concat",
							Sequelize.col("therapistReviews.firstName"),
							" ",
							Sequelize.col("therapistReviews.lastName")
						),
						{
							[Op.like]: `%${queryParams.search}%`,
						}
					),
					{ description: { [Op.like]: `%${queryParams.search}%` } },
				],
			};
		}
		var offset = limitQuery * (pageQuery - 1);
		condition.include = [
			{
				model: usersCollection,
				as: "patientReviews",
				where: { isDeleted: 0 },
				required: true,
			},
			{
				model: usersCollection,
				as: "therapistReviews",
				where: { isDeleted: 0 },
				required: true,
			},
		];

		var count = await reviewsCollections.count(condition);
		condition.limit = limitQuery;
		condition.offset = offset;
		condition.order = [["updatedAt", sort]];
		var reviewsdata = await reviewsCollections.findAll(condition);
		if (reviewsdata.length == 0 || count == 0) {
			var successOrError = await common.responseServices.successOrErrors("err_84");
			return await common.responseModel.successResponse(successOrError.message, [], {});
		}
		var resArr = [];
		for (let i = 0; i < reviewsdata.length; i++) {
			const element = reviewsdata[i];
			var resObj = await common.response.reviews.getAllReviewsObj(element);
			resArr.push(resObj);
		}
		var paginations = await common.pagination(limitQuery, pageQuery, count);
		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successGetResponse(
			successOrError.reviews,
			resArr,
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
