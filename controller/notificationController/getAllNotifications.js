/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const userNotificationsCollection = common.db.userNotifications;
const notificationsCollection = common.db.notifications;
const usersCollection = common.db.users;

/**
 * GET ALL NOTIFICATION  FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.getAllNotifications = async (req) => {
	try {
		var queryParams = req.query;

		var userId = await common.helpers.decryptData(req.params.id);
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

		var getAll = await userNotificationsCollection.findAll({
			include: [{ model: notificationsCollection, as: "notifications" }],
			where: { userId: userId },
			limit: limitQuery,
			offset: offset,
			order: [["createdAt", sort]],
		});
		var resArr = [];
		for (let index = 0; index < getAll.length; index++) {
			const element = getAll[index];

			var responseObj = {
				title: element.notifications.title,
				message: element.notifications.message,
			};
			resArr.push(responseObj);
		}
		var count = await userNotificationsCollection.count({ where: { userId: userId } });

		var paginations = await common.pagination(limitQuery, pageQuery, count);

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successGetResponse(
			successOrError.notificationGet,
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
